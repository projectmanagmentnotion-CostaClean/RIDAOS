import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { verifyStripeWebhookSignature } from '../_shared/dtiCommerce.mjs'

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  try {
    const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!secret?.startsWith('whsec_') || !url || !serviceKey) return new Response('service_unavailable', { status: 503 })
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature') ?? ''
    if (!await verifyStripeWebhookSignature(rawBody, signature, secret)) return new Response('invalid_signature', { status: 400 })
    const event = JSON.parse(rawBody)
    const supported = new Set(['payment_intent.succeeded', 'payment_intent.payment_failed', 'payment_intent.canceled', 'payment_intent.processing', 'payment_intent.requires_action'])
    if (!supported.has(event.type)) return new Response('ignored', { status: 200 })
    const intent = event.data?.object
    if (!intent?.id || !Number.isSafeInteger(intent.amount)) return new Response('invalid_event', { status: 400 })
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
    const { error } = await admin.schema('dti_private').rpc('process_stripe_payment_event', {
      p_event_id: event.id,
      p_event_type: event.type,
      p_payment_intent_id: intent.id,
      p_amount_cents: event.type === 'payment_intent.succeeded' ? intent.amount_received : intent.amount,
    })
    if (error) {
      console.error('stripe-webhook processing failed', error.message)
      return new Response('retry', { status: 500 })
    }
    return new Response('ok', { status: 200 })
  } catch (error) {
    console.error('stripe-webhook failure', error instanceof Error ? error.message : 'unknown')
    return new Response('retry', { status: 500 })
  }
})
