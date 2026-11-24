import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'

const cors = { 'access-control-allow-origin': Deno.env.get('DTI_ALLOWED_ORIGIN') ?? 'https://dti.ridaosprint.com', 'access-control-allow-headers': 'authorization, apikey, content-type, idempotency-key', 'access-control-allow-methods': 'POST, OPTIONS' }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' } })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
  if (request.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL'), serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !serviceKey) return reply({ error: 'service_unavailable' }, 503)
    const authorization = request.headers.get('authorization')
    if (!authorization) return reply({ error: 'authentication_required' }, 401)
    const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authorization } } })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return reply({ error: 'invalid_authentication' }, 401)
    const body = await request.json()
    const idempotencyKey = request.headers.get('idempotency-key')
    if (!idempotencyKey || !/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) return reply({ error: 'idempotency_key_required' }, 400)
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

    if (body.action === 'review_artwork') {
      if (typeof body.versionId !== 'string' || !['approved', 'rejected', 'revision_requested'].includes(body.decision) || typeof body.summary !== 'string' || body.summary.trim().length < 3 || body.summary.length > 2000 || !Array.isArray(body.checklist) || body.checklist.length > 100) return reply({ error: 'invalid_review_request' }, 400)
      const { data, error } = await admin.schema('dti_private').rpc('record_artwork_review', {
        p_version_id: body.versionId, p_reviewer_user_id: user.id, p_decision: body.decision,
        p_summary: body.summary.trim(), p_checklist: body.checklist, p_idempotency_key: idempotencyKey,
      })
      if (error) return reply({ error: 'review_rejected' }, 409)
      return reply({ recorded: data === true, versionId: body.versionId, decision: body.decision })
    }

    if (body.action === 'release_production') {
      if (typeof body.orderId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.orderId)) return reply({ error: 'invalid_order' }, 400)
      const { data, error } = await admin.schema('dti_private').rpc('release_order_to_production', {
        p_order_id: body.orderId, p_staff_user_id: user.id, p_idempotency_key: idempotencyKey,
      })
      if (error) return reply({ error: 'production_release_rejected' }, 409)
      return reply({ released: data === true, orderId: body.orderId })
    }
    if (body.action === 'confirm_lead_time') {
      if (typeof body.orderId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.orderId) || typeof body.summary !== 'string' || body.summary.trim().length < 5 || body.summary.length > 500) return reply({ error: 'invalid_lead_time_confirmation' }, 400)
      const { data, error } = await admin.schema('dti_private').rpc('confirm_dti_lead_time', {
        p_order_id: body.orderId, p_staff_user_id: user.id, p_summary: body.summary.trim(),
      })
      if (error) return reply({ error: 'lead_time_confirmation_rejected' }, 409)
      return reply({ confirmed: data === true, orderId: body.orderId, summary: body.summary.trim() })
    }
    return reply({ error: 'unknown_action' }, 400)
  } catch (error) {
    console.error('dti-staff-operations failure', error instanceof Error ? error.message : 'unknown')
    return reply({ error: 'staff_operation_failed' }, 500)
  }
})
