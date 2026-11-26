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
    const idempotencyKey = request.headers.get('idempotency-key')
    if (!idempotencyKey || !/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) return reply(request, { error: 'idempotency_key_required' }, 400)
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

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
