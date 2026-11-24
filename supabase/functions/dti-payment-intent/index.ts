import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { checkDtiPaymentEligibility, sha256Hex } from '../_shared/dtiCommerce.mjs'

const cors = { 'access-control-allow-origin': Deno.env.get('DTI_ALLOWED_ORIGIN') ?? 'https://dti.ridaosprint.com', 'access-control-allow-headers': 'authorization, apikey, content-type, x-dti-order-token', 'access-control-allow-methods': 'POST, OPTIONS' }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' } })
Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
  if (request.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL'), key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!url || !key || !stripeKey?.startsWith('sk_test_')) return reply({ error: 'test_payment_unavailable' }, 503)
    const { orderId } = await request.json()
    const admin = createClient(url, key, { auth: { persistSession: false } })
    const authorization = request.headers.get('authorization')
    const authClient = authorization ? createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authorization } } }) : null
    const { data: userData } = authClient ? await authClient.auth.getUser() : { data: { user: null } }
    if (authorization && !userData.user) return reply({ error: 'invalid_authentication' }, 401)
    const { data: order, error } = await admin.from('dti_orders').select('*').eq('id', orderId).maybeSingle()
    if (error) throw error
    if (!order) return reply({ error: 'order_not_found' }, 404)
    let allowed = Boolean(userData.user && order.owner_id === userData.user.id)
    const token = request.headers.get('x-dti-order-token')
    if (!order.owner_id && token) allowed = await sha256Hex(token) === order.guest_access_token_hash
    if (!allowed) return reply({ error: 'forbidden' }, 403)
    const { data: artwork } = await admin.from('dti_artwork_files').select('id').eq('order_id', orderId).maybeSingle()
    if (!artwork) return reply({ error: 'artwork_required' }, 409)
    const { data: versions } = await admin.from('dti_artwork_versions').select('*').eq('artwork_file_id', artwork.id).order('version_number', { ascending: false }).limit(1)
    const latest = versions?.[0]
    const { data: reviews } = latest ? await admin.from('dti_artwork_reviews').select('decision,created_at').eq('artwork_version_id', latest.id).order('created_at', { ascending: false }).limit(1) : { data: [] }
    const { data: quote } = order.adaptation_quote_id ? await admin.from('dti_adaptation_quotes').select('id,status,total_cents').eq('id', order.adaptation_quote_id).maybeSingle() : { data: null }
    const eligibility = checkDtiPaymentEligibility({ order, latestVersion: latest, latestProfessionalReview: reviews?.[0], approvedQuote: quote })
    if (!eligibility.allowed) return reply({ error: eligibility.reason }, 409)
    if (order.status === 'awaiting_manual_quote') return reply({ error: 'manual_deadline_quote_required' }, 409)
    const amount = order.total_cents + (quote?.total_cents ?? 0)
    if (!Number.isSafeInteger(amount) || amount < 100) return reply({ error: 'invalid_server_amount' }, 409)
    const stableKey = `dti-${order.id}-${latest.id}-${quote?.id ?? 'noquote'}`
    const form = new URLSearchParams({ amount: String(amount), currency: 'eur', 'automatic_payment_methods[enabled]': 'true', 'metadata[order_id]': order.id, 'metadata[artwork_version_id]': latest.id })
    if (quote?.id) form.set('metadata[adaptation_quote_id]', quote.id)
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', { method: 'POST', headers: { authorization: `Bearer ${stripeKey}`, 'content-type': 'application/x-www-form-urlencoded', 'idempotency-key': stableKey }, body: form })
    const intent = await stripeResponse.json()
    if (!stripeResponse.ok || !intent.id || !intent.client_secret) return reply({ error: 'payment_provider_error' }, 502)
    const { error: attemptError } = await admin.from('dti_payment_attempts').upsert({ order_id: order.id, idempotency_key: stableKey, stripe_payment_intent_id: intent.id, amount_cents: amount, status: intent.status === 'requires_action' ? 'requires_action' : 'requires_payment_method' }, { onConflict: 'idempotency_key' })
    if (attemptError) throw attemptError
    const { error: orderUpdateError } = await admin.from('dti_orders').update({ status: 'awaiting_payment', payment_status: 'unpaid', total_cents: amount }).eq('id', order.id).in('status', ['awaiting_artwork', 'awaiting_artwork_review'])
    if (orderUpdateError) throw orderUpdateError
    return reply({ clientSecret: intent.client_secret, amountCents: amount, currency: 'EUR', paymentIntentId: intent.id })
  } catch (error) {
    console.error('dti-payment-intent failure', error instanceof Error ? error.message : 'unknown')
    return reply({ error: 'payment_initialization_failed' }, 400)
  }
})
