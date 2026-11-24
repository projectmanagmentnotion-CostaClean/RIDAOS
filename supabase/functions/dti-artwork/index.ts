import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { normalizeDtiArtworkMetadata, sha256Hex, validateDtiArtworkBytes } from '../_shared/dtiCommerce.mjs'

const cors = { 'access-control-allow-origin': Deno.env.get('DTI_ALLOWED_ORIGIN') ?? 'https://dti.ridaosprint.com', 'access-control-allow-headers': 'authorization, apikey, content-type, x-dti-order-token', 'access-control-allow-methods': 'POST, OPTIONS' }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' } })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
  if (request.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !serviceKey) return reply({ error: 'service_unavailable' }, 503)
    const form = await request.formData()
    const orderId = String(form.get('orderId') ?? '')
    const file = form.get('file')
    if (!/^[0-9a-f-]{36}$/i.test(orderId) || !(file instanceof File)) return reply({ error: 'invalid_upload_request' }, 400)
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
    const authorization = request.headers.get('authorization')
    const authClient = authorization ? createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authorization } } }) : null
    const { data: authData } = authClient ? await authClient.auth.getUser() : { data: { user: null } }
    if (authorization && !authData.user) return reply({ error: 'invalid_authentication' }, 401)
    const { data: order, error: orderError } = await admin.from('dti_orders').select('id,owner_id,guest_access_token_hash,status').eq('id', orderId).maybeSingle()
    if (orderError) throw orderError
    if (!order) return reply({ error: 'order_not_found' }, 404)
    let allowed = Boolean(authData.user && order.owner_id === authData.user.id)
    if (!order.owner_id && request.headers.get('x-dti-order-token')) {
      const tokenHash = await sha256Hex(request.headers.get('x-dti-order-token')!)
      allowed = tokenHash === order.guest_access_token_hash
    }
    if (!allowed) return reply({ error: 'forbidden' }, 403)
    if (['paid_awaiting_technical_review', 'queued_for_production', 'cancelled'].includes(order.status)) return reply({ error: 'order_locked' }, 409)
    const metadata = normalizeDtiArtworkMetadata({ fileName: file.name, mimeType: file.type, fileSizeBytes: file.size })
    const bytes = new Uint8Array(await file.arrayBuffer())
    const check = validateDtiArtworkBytes({ format: metadata.format, bytes })
    if (check.status === 'failed') return reply({ error: 'server_validation_failed', reason: check.reason }, 422)
    const digest = await sha256Hex(bytes)
    const { data: existingArtwork, error } = await admin.from('dti_artwork_files').select('id').eq('order_id', orderId).maybeSingle()
    if (error) throw error
    let artwork = existingArtwork
    if (!artwork) {
      const created = await admin.from('dti_artwork_files').insert({ order_id: orderId }).select('id').single()
      if (created.error) throw created.error
      artwork = created.data
    }
    const { data: prior, error: priorError } = await admin.from('dti_artwork_versions').select('version_number').eq('artwork_file_id', artwork.id).order('version_number', { ascending: false }).limit(1).maybeSingle()
    if (priorError) throw priorError
    const versionNumber = (prior?.version_number ?? 0) + 1
    const storagePath = `${orderId}/${crypto.randomUUID()}/${metadata.safeFileName}`
    const { error: uploadError } = await admin.storage.from('dti-artwork').upload(storagePath, new Blob([bytes], { type: metadata.mimeType }), { contentType: metadata.mimeType, upsert: false })
    if (uploadError) throw uploadError
    const { data: version, error: versionError } = await admin.from('dti_artwork_versions').insert({
      artwork_file_id: artwork.id, version_number: versionNumber, storage_path: storagePath,
      original_file_name: metadata.safeFileName, format: metadata.format, mime_type: metadata.mimeType,
      file_size_bytes: file.size, sha256_hex: digest, validation_status: check.status,
      validation_summary: { reason: check.reason ?? null, dimensions: check.dimensions ?? null, reviewRequired: check.reviewRequired ?? metadata.reviewRequired },
      uploaded_at: new Date().toISOString(), uploaded_by: authData.user?.id ?? null,
    }).select('id,version_number,validation_status').single()
    if (versionError) {
      await admin.storage.from('dti-artwork').remove([storagePath])
      throw versionError
    }
    await admin.from('dti_artwork_events').insert({ artwork_version_id: version.id, event_type: 'upload_validated', actor_user_id: authData.user?.id ?? null, actor_kind: authData.user ? 'customer' : 'customer', details: { validation: check.status, sha256: digest } })
    return reply({ versionId: version.id, version: version.version_number, validation: version.validation_status, reviewRequired: check.status === 'manual_review' || metadata.reviewRequired }, 201)
  } catch (error) {
    console.error('dti-artwork failure', error instanceof Error ? error.message : 'unknown')
    return reply({ error: 'upload_failed' }, 400)
  }
})
