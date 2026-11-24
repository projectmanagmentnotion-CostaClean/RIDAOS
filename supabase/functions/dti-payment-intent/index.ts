import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { checkDtiPaymentEligibility, sha256Hex } from '../_shared/dtiCommerce.mjs'

const cors = { 'access-control-allow-origin': Deno.env.get('DTI_ALLOWED_ORIGIN') ?? 'https://dti.ridaosprint.com', 'access-control-allow-headers': 'authorization, apikey, content-type, x-dti-order-token', 'access-control-allow-methods': 'POST, OPTIONS' }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' } })

async function requestIntent(stripeKey: string, idempotencyKey: string, amount: number, orderId: string, versionId: string, quoteId?: string) {
  const form = new URLSearchParams({ amount: String(amount), currency: 'eur', 'automatic_payment_methods[enabled]': 'true', 'metadata[order_id]': orderId, 'metadata[artwork_version_id]': versionId })
  if (quoteId) form.set('metadata[adaptation_quote_id]', quoteId)
  const response = await fetch('https://api.stripe.com/v1/payment_intents', { method: 'POST', headers: { authorization: `Bearer ${stripeKey}`, 'content-type': 'application/x-www-form-urlencoded', 'idempotency-key': idempotencyKey }, body: form })
  const intent = await response.json()
  if (!response.ok || intent.livemode !== false || !intent.id || !intent.client_secret) throw new Error('stripe_request_failed')
  return intent
}

async function retrieveIntent(stripeKey: string, paymentIntentId: string) {
  const response = await fetch(`https://api.stripe.com/v1/payment_intents/${encodeURIComponent(paymentIntentId)}`, { headers: { authorization: `Bearer ${stripeKey}` } })
  const intent = await response.json()
  if (!response.ok || intent.livemode !== false || !intent.id || !intent.client_secret) throw new Error('stripe_retrieve_failed')
  return intent
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
  if (request.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL'), key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!url || !key || !stripeKey?.startsWith('sk_test_')) return reply({ error: 'test_payment_unavailable' }, 503)
    const { orderId } = await request.json()
    if (typeof orderId !== 'string' || !/^[0-9a-f-]{36}$/i.test(orderId)) return reply({ error: 'invalid_order' }, 400)
    const admin = createClient(url, key, { auth: { persistSession: false } })
    const authorization = request.headers.get('authorization')
    const authClient = authorization ? createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authorization } } }) : null
    const { data: userData } = authClient ? await authClient.auth.getUser() : { data: { user: null } }
    if (authorization && !userData.user) return reply({ error: 'invalid_authentication' }, 401)
    const { data: order, error: orderError } = await admin.from('dti_orders').select('*').eq('id', orderId).maybeSingle()
    if (orderError) throw orderError
    if (!order) return reply({ error: 'order_not_found' }, 404)
    let allowed = Boolean(userData.user && order.owner_id === userData.user.id)
    const guestToken = request.headers.get('x-dti-order-token')
    if (!order.owner_id && guestToken) allowed = await sha256Hex(guestToken) === order.guest_access_token_hash
    if (!allowed) return reply({ error: 'forbidden' }, 403)
    if (order.status === 'awaiting_manual_timeline') return reply({ error: 'manual_lead_time_confirmation_required' }, 409)
    if (!['awaiting_artwork', 'awaiting_artwork_review', 'awaiting_payment'].includes(order.status) || ['paid', 'cancelled'].includes(order.payment_status)) return reply({ error: 'order_not_payable' }, 409)

    const { data: artwork, error: artworkError } = await admin.from('dti_artwork_files').select('id').eq('order_id', orderId).maybeSingle()
    if (artworkError) throw artworkError
    if (!artwork) return reply({ error: 'artwork_required' }, 409)
    const { data: versions, error: versionsError } = await admin.from('dti_artwork_versions').select('*').eq('artwork_file_id', artwork.id).order('version_number', { ascending: false }).limit(1)
    if (versionsError) throw versionsError
    const latest = versions?.[0]
    const { data: reviews, error: reviewsError } = latest ? await admin.from('dti_artwork_reviews').select('decision,created_at').eq('artwork_version_id', latest.id).order('created_at', { ascending: false }).limit(1) : { data: [], error: null }
    if (reviewsError) throw reviewsError
    const { data: quote, error: quoteError } = order.adaptation_quote_id ? await admin.from('dti_adaptation_quotes').select('id,status,total_cents').eq('id', order.adaptation_quote_id).maybeSingle() : { data: null, error: null }
    if (quoteError) throw quoteError
    const eligibility = checkDtiPaymentEligibility({ order, latestVersion: latest, latestProfessionalReview: reviews?.[0], approvedQuote: quote })
    if (!eligibility.allowed) return reply({ error: eligibility.reason }, 409)

    const amount = order.product_total_cents + order.shipping_total_cents + (quote?.total_cents ?? 0)
    if (!Number.isSafeInteger(amount) || amount < 100) return reply({ error: 'invalid_server_amount' }, 409)
    const { data: existingAttempts, error: attemptsError } = await admin.from('dti_payment_attempts').select('*').eq('order_id', order.id).in('status', ['creating', 'requires_payment_method', 'requires_action', 'processing']).order('created_at', { ascending: false }).limit(1)
    if (attemptsError) throw attemptsError
    let attempt = existingAttempts?.[0]

    if (attempt && (attempt.amount_cents !== amount || attempt.artwork_version_id !== latest.id || attempt.adaptation_quote_id !== (quote?.id ?? null))) {
      return reply({ error: 'payment_attempt_state_conflict' }, 409)
    }
    if (!attempt) {
      const attemptKey = `dti-${order.id}-${crypto.randomUUID()}`
      const { data: created, error: createError } = await admin.from('dti_payment_attempts').insert({
        order_id: order.id, idempotency_key: attemptKey, artwork_version_id: latest.id,
        adaptation_quote_id: quote?.id ?? null, amount_cents: amount, currency_code: 'EUR', status: 'creating',
      }).select('*').single()
      if (createError?.code === '23505') {
        const { data: concurrent } = await admin.from('dti_payment_attempts').select('*').eq('order_id', order.id).in('status', ['creating', 'requires_payment_method', 'requires_action', 'processing']).order('created_at', { ascending: false }).limit(1).maybeSingle()
        attempt = concurrent
      } else if (createError) throw createError
      else attempt = created
    }
    if (!attempt) return reply({ error: 'payment_attempt_conflict' }, 409)

    const { data: updatedOrder, error: updateError } = await admin.from('dti_orders').update({ status: 'awaiting_payment', payment_status: 'unpaid', total_cents: amount, updated_at: new Date().toISOString() })
      .eq('id', order.id).in('status', ['awaiting_artwork', 'awaiting_artwork_review', 'awaiting_payment']).in('payment_status', ['not_ready', 'unpaid', 'failed']).select('id').maybeSingle()
    if (updateError) throw updateError
    if (!updatedOrder) return reply({ error: 'order_state_conflict' }, 409)

    const intent = attempt.stripe_payment_intent_id
      ? await retrieveIntent(stripeKey, attempt.stripe_payment_intent_id)
      : await requestIntent(stripeKey, attempt.idempotency_key, amount, order.id, latest.id, quote?.id)
    const attemptStatus = intent.status === 'requires_action' ? 'requires_action'
      : intent.status === 'canceled' ? 'cancelled'
        : intent.status === 'processing' || intent.status === 'succeeded' ? 'processing' : 'requires_payment_method'
    const { error: saveError } = await admin.from('dti_payment_attempts').update({ stripe_payment_intent_id: intent.id, status: attemptStatus, updated_at: new Date().toISOString() }).eq('id', attempt.id)
    if (saveError) throw saveError
    if (intent.status === 'succeeded') return reply({ paymentConfirmationPending: true, amountCents: amount, currency: 'EUR' }, 202)
    if (intent.status === 'canceled') return reply({ error: 'payment_intent_cancelled' }, 409)
    return reply({ clientSecret: intent.client_secret, amountCents: amount, currency: 'EUR', paymentIntentId: intent.id })
  } catch (error) {
    console.error('dti-payment-intent failure', error instanceof Error ? error.message : 'unknown')
    return reply({ error: 'payment_initialization_failed' }, 502)
  }
})
