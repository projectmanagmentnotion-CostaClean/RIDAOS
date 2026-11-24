import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { sha256Hex, dtiCorsHeaders } from '../_shared/dtiCommerce.mjs'

const cors = (request: Request) => dtiCorsHeaders(request, Deno.env.get('DTI_ALLOWED_ORIGIN') ?? '', 'authorization, apikey, content-type, x-dti-order-token', 'POST, OPTIONS')
const reply = (request: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...Object.fromEntries(cors(request)), 'content-type': 'application/json', 'cache-control': 'no-store' } })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: request.headers.get('origin') && !cors(request).has('access-control-allow-origin') ? 403 : 200, headers: cors(request) })
  if (request.method !== 'POST') return reply(request, { error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL'), serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !serviceKey) return reply(request, { error: 'service_unavailable' }, 503)
    const body = await request.json()
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
    const authorization = request.headers.get('authorization')
    const authClient = authorization ? createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authorization } } }) : null
    const { data: userData } = authClient ? await authClient.auth.getUser() : { data: { user: null } }
    if (authorization && !userData.user) return reply(request, { error: 'invalid_authentication' }, 401)

    if (body.action === 'create') {
      if (!userData.user || typeof body.orderId !== 'string' || !Number.isFinite(Number(body.hours))) return reply(request, { error: 'invalid_quote_request' }, 400)
      const { data: permission, error: permissionError } = await admin.from('dti_staff_permissions').select('user_id').eq('user_id', userData.user.id).eq('permission', 'manage_quotes').maybeSingle()
      if (permissionError) throw permissionError
      if (!permission) return reply(request, { error: 'forbidden' }, 403)
      const { data: quoteId, error } = await admin.rpc('dti_create_adaptation_quote', { p_order_id: body.orderId, p_hours: Number(body.hours), p_staff_user_id: userData.user.id })
      if (error) return reply(request, { error: error.message.includes('permission') ? 'forbidden' : 'quote_cannot_be_created' }, 409)
      const { data: quote, error: quoteError } = await admin.from('dti_adaptation_quotes').select('id,order_id,quote_version,hours,hourly_rate_cents,net_cents,vat_cents,total_cents,status,created_at').eq('id', quoteId).single()
      if (quoteError) throw quoteError
      return reply(request, { quote }, 201)
    }

    if (body.action === 'decide') {
      if (typeof body.quoteId !== 'string' || !['approved', 'rejected'].includes(body.decision)) return reply(request, { error: 'invalid_quote_decision' }, 400)
      const { data: quote, error: quoteError } = await admin.from('dti_adaptation_quotes').select('id,order_id,status').eq('id', body.quoteId).maybeSingle()
      if (quoteError) throw quoteError
      if (!quote) return reply(request, { error: 'quote_not_found' }, 404)
      const { data: order, error: orderError } = await admin.from('dti_orders').select('owner_id,guest_access_token_hash').eq('id', quote.order_id).single()
      if (orderError) throw orderError
      let guestHash: string | null = null
      if (order.owner_id) {
        if (order.owner_id !== userData.user?.id) return reply(request, { error: 'forbidden' }, 403)
      } else {
        const token = request.headers.get('x-dti-order-token')
        if (!token) return reply(request, { error: 'forbidden' }, 403)
        guestHash = await sha256Hex(token)
        if (guestHash !== order.guest_access_token_hash) return reply(request, { error: 'forbidden' }, 403)
      }
      const { data: decided, error } = await admin.rpc('dti_decide_adaptation_quote', {
        p_quote_id: quote.id, p_decision: body.decision,
        p_customer_user_id: userData.user?.id ?? null, p_guest_token_hash: guestHash,
      })
      if (error) return reply(request, { error: 'quote_decision_rejected' }, 409)
      if (!decided) return reply(request, { error: 'quote_already_decided' }, 409)
      return reply(request, { quoteId: quote.id, decision: body.decision, approvedBeforePayment: body.decision === 'approved' })
    }
    return reply(request, { error: 'unknown_action' }, 400)
  } catch (error) {
    console.error('dti-adaptation-quotes failure', error instanceof Error ? error.message : 'unknown')
    return reply(request, { error: 'quote_operation_failed' }, 500)
  }
})
