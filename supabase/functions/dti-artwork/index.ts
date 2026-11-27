import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { DTI_MAX_FILE_BYTES, normalizeDtiArtworkMetadata, sha256Hex, validateDtiArtworkBytes, dtiCorsHeaders, dtiCorsOriginsForProject } from '../_shared/dtiCommerce.mjs'

const cors = (request: Request) => dtiCorsHeaders(request, dtiCorsOriginsForProject(Deno.env.get('DTI_ALLOWED_ORIGIN') ?? '', Deno.env.get('SUPABASE_URL') ?? ''), 'authorization, apikey, content-type, idempotency-key, x-dti-order-token', 'POST, OPTIONS')
const reply = (request: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...Object.fromEntries(cors(request)), 'content-type': 'application/json', 'cache-control': 'no-store' } })
const MAX_MULTIPART_BYTES = DTI_MAX_FILE_BYTES + 1_048_576

class UploadTooLargeError extends Error {}

async function parseBoundedFormData(request: Request): Promise<FormData> {
  const declaredLength = request.headers.get('content-length')
  if (declaredLength !== null && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_MULTIPART_BYTES)) {
    throw new UploadTooLargeError()
  }
  if (!request.body) throw new TypeError('missing_request_body')

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    totalBytes += value.byteLength
    if (totalBytes > MAX_MULTIPART_BYTES) {
      await reader.cancel()
      throw new UploadTooLargeError()
    }
    chunks.push(value)
  }

  const body = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  return await new Request(request.url, { method: request.method, headers: request.headers, body }).formData()
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: request.headers.get('origin') && !cors(request).has('access-control-allow-origin') ? 403 : 200, headers: cors(request) })
  if (request.method !== 'POST') return reply(request, { error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !serviceKey) return reply(request, { error: 'service_unavailable' }, 503)
    const idempotencyKey = request.headers.get('idempotency-key')
    if (!idempotencyKey || !/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) return reply(request, { error: 'idempotency_key_required' }, 400)
    const form = await parseBoundedFormData(request)
    const orderId = String(form.get('orderId') ?? '')
    const file = form.get('file')
    if (!/^[0-9a-f-]{36}$/i.test(orderId) || !(file instanceof File)) return reply(request, { error: 'invalid_upload_request' }, 400)
    if (file.size > DTI_MAX_FILE_BYTES) return reply(request, { error: 'upload_too_large' }, 413)
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
    const authorization = request.headers.get('authorization')
    const authClient = authorization ? createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authorization } } }) : null
    const { data: authData } = authClient ? await authClient.auth.getUser() : { data: { user: null } }
    if (authorization && !authData.user) return reply(request, { error: 'invalid_authentication' }, 401)
    const { data: order, error: orderError } = await admin.from('dti_orders').select('id,owner_id,guest_access_token_hash,status').eq('id', orderId).maybeSingle()
    if (orderError) throw orderError
    if (!order) return reply(request, { error: 'order_not_found' }, 404)
    let allowed = Boolean(authData.user && order.owner_id === authData.user.id)
    if (!order.owner_id && request.headers.get('x-dti-order-token')) {
      const tokenHash = await sha256Hex(request.headers.get('x-dti-order-token')!)
      allowed = tokenHash === order.guest_access_token_hash
    }
    if (!allowed) return reply(request, { error: 'forbidden' }, 403)
    if (['awaiting_payment', 'paid_awaiting_technical_review', 'queued_for_production', 'cancelled'].includes(order.status)) return reply(request, { error: 'order_locked' }, 409)
    const metadata = normalizeDtiArtworkMetadata({ fileName: file.name, mimeType: file.type, fileSizeBytes: file.size })
    const bytes = new Uint8Array(await file.arrayBuffer())
    const check = await validateDtiArtworkBytes({ format: metadata.format, bytes })
    if (check.status === 'failed') return reply(request, { error: 'server_validation_failed', reason: check.reason }, 422)
    const digest = await sha256Hex(bytes)
    const { data: existingArtwork, error } = await admin.from('dti_artwork_files').select('id').eq('order_id', orderId).maybeSingle()
    if (error) throw error
    let artwork = existingArtwork
    if (!artwork) {
      const created = await admin.from('dti_artwork_files').insert({ order_id: orderId }).select('id').single()
      if (created.error) throw created.error
      artwork = created.data
    }
    const { data: priorRequest, error: priorRequestError } = await admin.from('dti_artwork_versions')
      .select('id,version_number,validation_status,sha256_hex')
      .eq('artwork_file_id', artwork.id)
      .eq('upload_idempotency_key', idempotencyKey)
      .maybeSingle()
    if (priorRequestError) throw priorRequestError
    if (priorRequest) {
      if (priorRequest.sha256_hex !== digest) return reply(request, { error: 'upload_idempotency_conflict' }, 409)
      const { error: retryEventError } = await admin.from('dti_artwork_events').upsert({
        artwork_version_id: priorRequest.id, event_type: 'upload_validated', actor_user_id: authData.user?.id ?? null,
        actor_kind: 'customer', idempotency_key: `upload:${priorRequest.id}`,
        details: { validation: priorRequest.validation_status, sha256: digest },
      }, { onConflict: 'idempotency_key' })
      if (retryEventError) throw retryEventError
      if (check.status === 'manual_review' || metadata.reviewRequired) {
        const { error: statusError } = await admin.from('dti_orders').update({ status: 'awaiting_artwork_review', updated_at: new Date().toISOString() }).eq('id', orderId).in('status', ['awaiting_artwork', 'awaiting_artwork_review'])
        if (statusError) throw statusError
      }
      return reply(request, { versionId: priorRequest.id, version: priorRequest.version_number, validation: priorRequest.validation_status, reviewRequired: check.status === 'manual_review' || metadata.reviewRequired })
    }
    const { data: prior, error: priorError } = await admin.from('dti_artwork_versions').select('version_number').eq('artwork_file_id', artwork.id).order('version_number', { ascending: false }).limit(1).maybeSingle()
    if (priorError) throw priorError
    const versionNumber = (prior?.version_number ?? 0) + 1
    const storagePath = `${orderId}/${crypto.randomUUID()}/${metadata.safeFileName}`
    const { error: uploadError } = await admin.storage.from('dti-artwork').upload(storagePath, file, { contentType: metadata.mimeType, upsert: false })
    if (uploadError) throw uploadError
    const { data: version, error: versionError } = await admin.from('dti_artwork_versions').insert({
      artwork_file_id: artwork.id, upload_idempotency_key: idempotencyKey, version_number: versionNumber, storage_path: storagePath,
      original_file_name: metadata.safeFileName, format: metadata.format, mime_type: metadata.mimeType,
      file_size_bytes: file.size, sha256_hex: digest, validation_status: check.status,
      validation_summary: { reason: check.reason ?? null, dimensions: check.dimensions ?? null, reviewRequired: check.reviewRequired ?? metadata.reviewRequired },
      uploaded_at: new Date().toISOString(), uploaded_by: authData.user?.id ?? null,
    }).select('id,version_number,validation_status').single()
    if (versionError) {
      await admin.storage.from('dti-artwork').remove([storagePath])
      if (versionError.code === '23505') return reply(request, { error: 'retry_upload_with_same_idempotency_key' }, 409)
      throw versionError
    }
    const { error: eventError } = await admin.from('dti_artwork_events').insert({ artwork_version_id: version.id, event_type: 'upload_validated', actor_user_id: authData.user?.id ?? null, actor_kind: 'customer', idempotency_key: `upload:${version.id}`, details: { validation: check.status, sha256: digest } })
    if (eventError) {
      await admin.from('dti_artwork_versions').delete().eq('id', version.id)
      await admin.storage.from('dti-artwork').remove([storagePath])
      throw eventError
    }
    if (check.status === 'manual_review' || metadata.reviewRequired) {
      const { error: statusError } = await admin.from('dti_orders').update({ status: 'awaiting_artwork_review', updated_at: new Date().toISOString() }).eq('id', orderId).in('status', ['awaiting_artwork', 'awaiting_artwork_review'])
      if (statusError) throw statusError
    }
    return reply(request, { versionId: version.id, version: version.version_number, validation: version.validation_status, reviewRequired: check.status === 'manual_review' || metadata.reviewRequired }, 201)
  } catch (error) {
    if (error instanceof UploadTooLargeError) return reply(request, { error: 'upload_too_large' }, 413)
    console.error('dti-artwork failure', error instanceof Error ? error.message : 'unknown')
    return reply(request, { error: 'upload_failed' }, 400)
  }
})
