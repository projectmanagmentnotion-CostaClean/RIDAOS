import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { calculateDtiOrder, deriveGuestOrderToken, sha256Hex } from '../_shared/dtiCommerce.mjs'

const cors = { 'access-control-allow-origin': Deno.env.get('DTI_ALLOWED_ORIGIN') ?? 'https://dti.ridaosprint.com', 'access-control-allow-headers': 'authorization, apikey, content-type, idempotency-key', 'access-control-allow-methods': 'POST, OPTIONS' }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' } })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
  if (request.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const tokenSecret = Deno.env.get('DTI_GUEST_TOKEN_SECRET')
    if (!url || !serviceKey || !tokenSecret) return reply({ error: 'service_unavailable' }, 503)
    const body = await request.json()
    const idempotencyKey = request.headers.get('idempotency-key')
    if (!idempotencyKey || !/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) return reply({ error: 'idempotency_key_required' }, 400)
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 7 || phone.length > 40) return reply({ error: 'valid_contact_required' }, 400)
    const totals = calculateDtiOrder({ meters: body.meters, shippingMethod: body.shippingMethod, adaptationRequested: body.adaptationRequested })
    const ownerClient = request.headers.get('authorization')
      ? createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: request.headers.get('authorization')! } } })
      : null
    const { data: authData } = ownerClient ? await ownerClient.auth.getUser() : { data: { user: null } }
    if (request.headers.has('authorization') && !authData.user) return reply({ error: 'invalid_authentication' }, 401)
    const ownerId = authData.user?.id ?? null
    const guestToken = ownerId ? null : await deriveGuestOrderToken(tokenSecret, idempotencyKey)
    const guestTokenHash = guestToken ? await sha256Hex(guestToken) : null
    const requestHash = await sha256Hex(JSON.stringify({ email, phone, ...totals }))
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
    const { data: existing, error: lookupError } = await admin.from('dti_orders').select('id,request_hash,guest_access_token_hash,status,total_cents').eq('idempotency_key', idempotencyKey).maybeSingle()
    if (lookupError) throw lookupError
    if (existing) {
      if (existing.request_hash !== requestHash || (guestTokenHash && existing.guest_access_token_hash !== guestTokenHash)) return reply({ error: 'idempotency_conflict' }, 409)
      return reply({ orderId: existing.id, status: existing.status, totalCents: existing.total_cents, ...(guestToken ? { guestAccessToken: guestToken } : {}) })
    }
    const { data: order, error } = await admin.from('dti_orders').insert({
      idempotency_key: idempotencyKey, request_hash: requestHash, owner_id: ownerId,
      guest_access_token_hash: guestTokenHash, customer_email: email, customer_phone: phone,
      meters: totals.meters, product_total_cents: totals.productTotalCents, product_vat_cents: totals.productVatCents,
      shipping_method: totals.shippingMethod, shipping_total_cents: totals.shippingTotalCents,
      shipping_vat_cents: totals.shippingVatCents, adaptation_requested: totals.adaptationRequested,
      total_cents: totals.totalCents, status: totals.initialStatus,
    }).select('id,status,total_cents').single()
    if (error) {
      if (error.code === '23505') return reply({ error: 'retry_with_same_idempotency_key' }, 409)
      throw error
    }
    await admin.from('dti_order_events').insert({ order_id: order.id, event_type: 'order_created', actor_kind: ownerId ? 'customer' : 'system', idempotency_key: `order:${idempotencyKey}`, details: { product_code: 'dti-innuro', meters: totals.meters } })
    return reply({ orderId: order.id, status: order.status, totalCents: order.total_cents, ...(guestToken ? { guestAccessToken: guestToken } : {}) }, 201)
  } catch (error) {
    console.error('dti-orders failure', error instanceof Error ? error.message : 'unknown')
    return reply({ error: 'invalid_order_request' }, 400)
  }
})
