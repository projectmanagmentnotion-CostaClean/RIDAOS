import assert from 'node:assert/strict'
import test from 'node:test'
import {
  calculateDtiAdaptationQuote,
  calculateDtiOrder,
  checkDtiPaymentEligibility,
  deriveGuestOrderToken,
  normalizeDtiArtworkMetadata,
  validateDtiArtworkBytes,
  verifyStripeWebhookSignature,
} from '../supabase/functions/_shared/dtiCommerce.mjs'

test('server order calculator ignores client prices and applies only approved delivery choices', () => {
  assert.deepEqual(calculateDtiOrder({ meters: 1, shippingMethod: 'standard' }), {
    meters: 1,
    unitPriceCents: 1500,
    productTotalCents: 1500,
    productVatCents: 260,
    shippingMethod: 'standard',
    shippingTotalCents: 500,
    shippingVatCents: 87,
    adaptationRequested: false,
    totalCents: 2000,
    initialStatus: 'awaiting_artwork',
    paymentStatus: 'not_ready',
  })
  assert.throws(() => calculateDtiOrder({ meters: 0.9, shippingMethod: 'pickup' }), /mínimo/)
  assert.throws(() => calculateDtiOrder({ meters: 1.05, shippingMethod: 'pickup' }), /pasos/)
  assert.throws(() => calculateDtiOrder({ meters: 1, shippingMethod: 'express', price: 1 }), /método/)
  assert.equal(calculateDtiOrder({ meters: 10.1, shippingMethod: 'pickup' }).initialStatus, 'awaiting_manual_quote')
})

test('adaptation quotes are server calculated at 35 EUR plus VAT', () => {
  assert.deepEqual(calculateDtiAdaptationQuote(1), {
    hours: 1,
    hourlyRateCents: 3500,
    netCents: 3500,
    vatCents: 735,
    totalCents: 4235,
  })
  assert.throws(() => calculateDtiAdaptationQuote(0), /positivas/)
})

test('metadata allowlist limits private uploads and marks native/vector files for review', () => {
  assert.equal(normalizeDtiArtworkMetadata({ fileName: 'logo.pdf', mimeType: 'application/pdf', fileSizeBytes: 1024 }).reviewRequired, false)
  assert.equal(normalizeDtiArtworkMetadata({ fileName: 'C:\\fakepath\\logo.ai', mimeType: 'application/postscript', fileSizeBytes: 1024 }).safeFileName, 'logo.ai')
  assert.equal(normalizeDtiArtworkMetadata({ fileName: 'logo.cdr', mimeType: 'application/octet-stream', fileSizeBytes: 1024 }).reviewRequired, true)
  assert.throws(() => normalizeDtiArtworkMetadata({ fileName: '../escape.pdf', mimeType: 'application/pdf', fileSizeBytes: 1024 }), /nombre/)
  assert.throws(() => normalizeDtiArtworkMetadata({ fileName: 'large.png', mimeType: 'image/png', fileSizeBytes: 262_144_001 }), /250 MiB/)
})

test('server validation rejects malformed PNG/PDF and never treats manual formats as validated', () => {
  assert.equal(validateDtiArtworkBytes({ format: 'PNG', bytes: new Uint8Array([1, 2, 3]) }).status, 'failed')
  assert.equal(validateDtiArtworkBytes({ format: 'AI', bytes: new Uint8Array([1, 2, 3]) }).status, 'manual_review')
  const pdf = new TextEncoder().encode('%PDF-1.7\n/Root 1 0 R\n%%EOF')
  assert.equal(validateDtiArtworkBytes({ format: 'PDF', bytes: pdf }).status, 'passed')
  const activePdf = new TextEncoder().encode('%PDF-1.7\n/OpenAction /JavaScript\n%%EOF')
  assert.equal(validateDtiArtworkBytes({ format: 'PDF', bytes: activePdf }).status, 'manual_review')
})

test('client acceptance alone does not permit payment or production', () => {
  const order = { status: 'awaiting_payment', payment_status: 'unpaid', adaptation_requested: false, total_cents: 2000 }
  const version = { format: 'PNG', validation_status: 'passed', client_accepted_at: null }
  assert.equal(checkDtiPaymentEligibility({ order, latestVersion: version }).reason, 'customer_acceptance_required')
  const eligible = checkDtiPaymentEligibility({ order, latestVersion: { ...version, client_accepted_at: '2026-11-24T00:00:00Z' } })
  assert.deepEqual(eligible, { allowed: true, amountCents: 2000 })
  const manual = { ...version, format: 'AI', validation_status: 'manual_review', client_accepted_at: '2026-11-24T00:00:00Z' }
  assert.equal(checkDtiPaymentEligibility({ order, latestVersion: manual }).reason, 'professional_review_required')
  assert.equal(checkDtiPaymentEligibility({ order, latestVersion: manual, latestProfessionalReview: { decision: 'approved' } }).allowed, true)
})

test('guest access tokens are deterministic for retries and distinct per idempotency key', async () => {
  const secret = 'server-only-test-secret'
  const first = await deriveGuestOrderToken(secret, 'request-a')
  assert.equal(await deriveGuestOrderToken(secret, 'request-a'), first)
  assert.notEqual(await deriveGuestOrderToken(secret, 'request-b'), first)
})

test('Stripe webhook signatures enforce HMAC, event body, and a 5 minute timestamp window', async () => {
  const secret = 'whsec_test-secret'
  const timestamp = 1_800_000_000
  const rawBody = '{"id":"evt_test"}'
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${rawBody}`)))
  const signature = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  const header = `t=${timestamp},v1=${signature}`

  assert.equal(await verifyStripeWebhookSignature(rawBody, header, secret, timestamp), true)
  assert.equal(await verifyStripeWebhookSignature(`${rawBody} `, header, secret, timestamp), false)
  assert.equal(await verifyStripeWebhookSignature(rawBody, header, secret, timestamp + 301), false)
})
