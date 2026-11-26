import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { dtiCorsHeaders } from '../_shared/dtiCommerce.mjs'

const cors = (request: Request) => dtiCorsHeaders(request, Deno.env.get('DTI_ALLOWED_ORIGIN') ?? '', 'authorization, apikey, content-type, idempotency-key', 'POST, OPTIONS')
const reply = (request: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...Object.fromEntries(cors(request)), 'content-type': 'application/json', 'cache-control': 'no-store' } })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: request.headers.get('origin') && !cors(request).has('access-control-allow-origin') ? 403 : 200, headers: cors(request) })
  if (request.method !== 'POST') return reply(request, { error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL'), serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !serviceKey) return reply(request, { error: 'service_unavailable' }, 503)
    const authorization = request.headers.get('authorization')
    if (!authorization) return reply(request, { error: 'authentication_required' }, 401)
    const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authorization } } })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return reply(request, { error: 'invalid_authentication' }, 401)
    const body = await request.json()
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
    const { data: permissionRows, error: permissionError } = await admin.from('dti_staff_permissions')
      .select('permission').eq('user_id', user.id)
    if (permissionError) throw permissionError
    const permissions = (permissionRows ?? []).map((row) => row.permission)
    if (body.action === 'list_orders') {
      if (!permissions.some((permission) => ['review_artwork', 'manage_quotes', 'manage_production', 'manage_payments'].includes(permission))) {
        return reply(request, { error: 'insufficient_staff_permission' }, 403)
      }
      const { data: orders, error: ordersError } = await admin.from('dti_orders')
        .select('id,customer_name,meters,useful_width_mm,shipping_method,shipping_total_cents,total_cents,currency_code,status,payment_status,adaptation_requested,preparation_working_days,estimated_dispatch_date,confirmed_lead_time,lead_time_confirmed_at,production_started_at,quality_control_completed_at,dispatch_ready_at,dispatched_at,picked_up_at,tracking_reference,created_at')
        .order('created_at', { ascending: false }).limit(100)
      if (ordersError) throw ordersError
      const orderIds = (orders ?? []).map((order) => order.id)
      const { data: artworkFiles, error: artworkError } = orderIds.length
        ? await admin.from('dti_artwork_files').select('id,order_id').in('order_id', orderIds)
        : { data: [], error: null }
      if (artworkError) throw artworkError
      const fileIds = (artworkFiles ?? []).map((file) => file.id)
      const { data: versions, error: versionsError } = fileIds.length
        ? await admin.from('dti_artwork_versions').select('id,artwork_file_id,version_number,original_file_name,format,file_size_bytes,validation_status,validation_summary,client_accepted_at,uploaded_at').in('artwork_file_id', fileIds).order('version_number', { ascending: false })
        : { data: [], error: null }
      if (versionsError) throw versionsError
      const versionIds = (versions ?? []).map((version) => version.id)
      const { data: reviews, error: reviewsError } = versionIds.length
        ? await admin.from('dti_artwork_reviews').select('artwork_version_id,decision,summary,reviewer_user_id,created_at').in('artwork_version_id', versionIds).order('created_at', { ascending: false })
        : { data: [], error: null }
      if (reviewsError) throw reviewsError
      const { data: events, error: eventsError } = orderIds.length
        ? await admin.from('dti_order_events').select('order_id,event_type,actor_user_id,actor_kind,details,created_at').in('order_id', orderIds).order('created_at', { ascending: false }).limit(500)
        : { data: [], error: null }
      if (eventsError) throw eventsError
      const fileByOrder = new Map((artworkFiles ?? []).map((file) => [file.order_id, file.id]))
      const latestVersionByFile = new Map<string, NonNullable<typeof versions>[number]>()
      for (const version of versions ?? []) if (!latestVersionByFile.has(version.artwork_file_id)) latestVersionByFile.set(version.artwork_file_id, version)
      const latestReviewByVersion = new Map<string, NonNullable<typeof reviews>[number]>()
      for (const review of reviews ?? []) if (!latestReviewByVersion.has(review.artwork_version_id)) latestReviewByVersion.set(review.artwork_version_id, review)
      return reply(request, {
        permissions,
        orders: (orders ?? []).map((order) => {
          const version = latestVersionByFile.get(fileByOrder.get(order.id) ?? '')
          return {
            ...order,
            latestArtwork: version ? { ...version, latestReview: latestReviewByVersion.get(version.id) ?? null } : null,
            events: (events ?? []).filter((event) => event.order_id === order.id).slice(0, 8),
          }
        }),
      })
    }
    if (body.action === 'artwork_download') {
      if (!permissions.includes('review_artwork') || typeof body.versionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.versionId)) {
        return reply(request, { error: 'insufficient_staff_permission' }, 403)
      }
      const { data: version, error: versionError } = await admin.from('dti_artwork_versions')
        .select('storage_path,format,original_file_name').eq('id', body.versionId).maybeSingle()
      if (versionError) throw versionError
      if (!version) return reply(request, { error: 'artwork_not_found' }, 404)
      const { data: signed, error: signedError } = await admin.storage.from('dti-artwork').createSignedUrl(version.storage_path, 120, { download: version.original_file_name })
      if (signedError) throw signedError
      return reply(request, { url: signed.signedUrl, format: version.format, fileName: version.original_file_name, expiresInSeconds: 120 })
    }
    const idempotencyKey = request.headers.get('idempotency-key')
    if (!idempotencyKey || !/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) return reply(request, { error: 'idempotency_key_required' }, 400)

    if (body.action === 'review_artwork') {
      if (typeof body.versionId !== 'string' || !['approved', 'rejected', 'revision_requested'].includes(body.decision) || typeof body.summary !== 'string' || body.summary.trim().length < 3 || body.summary.length > 2000 || !Array.isArray(body.checklist) || body.checklist.length > 100) return reply(request, { error: 'invalid_review_request' }, 400)
      const { data, error } = await admin.rpc('dti_record_artwork_review', {
        p_version_id: body.versionId, p_reviewer_user_id: user.id, p_decision: body.decision,
        p_summary: body.summary.trim(), p_checklist: body.checklist, p_idempotency_key: idempotencyKey,
      })
      if (error) return reply(request, { error: 'review_rejected' }, 409)
      return reply(request, { recorded: data === true, versionId: body.versionId, decision: body.decision })
    }

    if (body.action === 'release_production') {
      if (typeof body.orderId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.orderId)) return reply(request, { error: 'invalid_order' }, 400)
      const { data, error } = await admin.rpc('dti_release_order_to_production', {
        p_order_id: body.orderId, p_staff_user_id: user.id, p_idempotency_key: idempotencyKey,
      })
      if (error) return reply(request, { error: 'production_release_rejected' }, 409)
      return reply(request, { released: data === true, orderId: body.orderId })
    }
    if (body.action === 'update_production_status') {
      const statuses = ['in_production', 'quality_control', 'rework_required', 'preparing_dispatch', 'ready_for_dispatch', 'dispatched', 'ready_for_pickup', 'picked_up']
      if (typeof body.orderId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.orderId)
        || typeof body.status !== 'string' || !statuses.includes(body.status)
        || typeof body.summary !== 'string' || body.summary.trim().length < 5 || body.summary.length > 500
        || (body.trackingReference !== undefined && body.trackingReference !== null && typeof body.trackingReference !== 'string')) {
        return reply(request, { error: 'invalid_production_status_request' }, 400)
      }
      const trackingReference = typeof body.trackingReference === 'string' ? body.trackingReference.trim() : null
      if (body.status === 'dispatched' && (!trackingReference || trackingReference.length < 4 || trackingReference.length > 120)
        || body.status !== 'dispatched' && trackingReference !== null) {
        return reply(request, { error: 'invalid_tracking_reference' }, 400)
      }
      const { data, error } = await admin.rpc('dti_update_production_status', {
        p_order_id: body.orderId,
        p_staff_user_id: user.id,
        p_next_status: body.status,
        p_summary: body.summary.trim(),
        p_tracking_reference: trackingReference,
        p_idempotency_key: idempotencyKey,
      })
      if (error) return reply(request, { error: 'production_status_update_rejected' }, 409)
      return reply(request, { updated: data === true, orderId: body.orderId, status: body.status })
    }
    if (body.action === 'confirm_lead_time') {
      if (typeof body.orderId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.orderId) || typeof body.summary !== 'string' || body.summary.trim().length < 5 || body.summary.length > 500) return reply(request, { error: 'invalid_lead_time_confirmation' }, 400)
      const { data, error } = await admin.rpc('dti_confirm_lead_time', {
        p_order_id: body.orderId, p_staff_user_id: user.id, p_summary: body.summary.trim(),
      })
      if (error) return reply(request, { error: 'lead_time_confirmation_rejected' }, 409)
      return reply(request, { confirmed: data === true, orderId: body.orderId, summary: body.summary.trim() })
    }
    return reply(request, { error: 'unknown_action' }, 400)
  } catch (error) {
    console.error('dti-staff-operations failure', error instanceof Error ? error.message : 'unknown')
    return reply(request, { error: 'staff_operation_failed' }, 500)
  }
})
