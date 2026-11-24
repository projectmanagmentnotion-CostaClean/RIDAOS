import assert from 'node:assert/strict'
import { deflateSync } from 'node:zlib'
import test from 'node:test'
import {
  calculateDtiAdaptationQuote,
  calculateDtiOrder,
  checkDtiPaymentEligibility,
  deriveGuestOrderToken,
  normalizeDtiShippingAddress,
  normalizeDtiArtworkMetadata,
  validateDtiArtworkBytes,
  verifyStripeWebhookSignature,
} from '../supabase/functions/_shared/dtiCommerce.mjs'

test('server order calculator ignores client prices and applies only approved delivery choices', () => {
  assert.deepEqual(calculateDtiOrder({ meters: 1, shippingMethod: 'standard', orderedAt: new Date('2026-11-24T09:00:00Z') }), {
    meters: 1,
    usefulWidthMm: 550,
    unitPriceCents: 1500,
    productTotalCents: 1500,
    productVatCents: 260,
    shippingMethod: 'standard',
    shippingTotalCents: 500,
    shippingVatCents: 87,
    adaptationRequested: false,
    totalCents: 2000,
    preparationWorkingDays: 2,
    estimatedDispatchDate: '2026-11-26',
    initialStatus: 'awaiting_artwork',
    paymentStatus: 'not_ready',
  })
  assert.throws(() => calculateDtiOrder({ meters: 0.9, shippingMethod: 'pickup' }), /mínimo/)
  assert.throws(() => calculateDtiOrder({ meters: 1.05, shippingMethod: 'pickup' }), /pasos/)
  assert.throws(() => calculateDtiOrder({ meters: 1, shippingMethod: 'express', price: 1 }), /método/)
  const longOrder = calculateDtiOrder({ meters: 10.1, shippingMethod: 'pickup', orderedAt: new Date('2026-11-24T09:00:00Z') })
  assert.equal(longOrder.initialStatus, 'awaiting_manual_timeline')
  assert.equal(longOrder.estimatedDispatchDate, null)
})

test('server dispatch estimates apply the 18:30 Madrid cutoff and skip weekends', () => {
  assert.equal(calculateDtiOrder({ meters: 1, shippingMethod: 'pickup', orderedAt: new Date('2026-11-24T17:30:00Z') }).estimatedDispatchDate, '2026-11-27')
  assert.equal(calculateDtiOrder({ meters: 1, shippingMethod: 'pickup', orderedAt: new Date('2026-11-28T10:00:00Z') }).estimatedDispatchDate, '2026-12-02')
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

test('server address normalization requires a Spanish peninsula address for delivery', () => {
  assert.equal(normalizeDtiShippingAddress('pickup', null), null)
  assert.deepEqual(normalizeDtiShippingAddress('standard', {
    line1: ' Carrer d’Aragó 423 ', line2: '', postalCode: '08013', city: ' Barcelona ', province: ' Barcelona ', countryCode: 'FR',
  }), {
    line1: 'Carrer d’Aragó 423', line2: null, postalCode: '08013', city: 'Barcelona', province: 'Barcelona', countryCode: 'ES',
  })
  assert.throws(() => normalizeDtiShippingAddress('standard', null), /obligatoria/)
  for (const postalCode of ['07001', '35001', '38001', '51001', '52001', '00001']) {
    assert.throws(() => normalizeDtiShippingAddress('standard', {
      line1: 'Carrer d’Aragó 423', postalCode, city: 'Barcelona', province: 'Barcelona',
    }), /península/)
  }
})

test('metadata allowlist limits private uploads and marks native/vector files for review', () => {
  assert.equal(normalizeDtiArtworkMetadata({ fileName: 'logo.pdf', mimeType: 'application/pdf', fileSizeBytes: 1024 }).reviewRequired, false)
  assert.equal(normalizeDtiArtworkMetadata({ fileName: 'C:\\fakepath\\logo.ai', mimeType: 'application/postscript', fileSizeBytes: 1024 }).safeFileName, 'logo.ai')
  assert.equal(normalizeDtiArtworkMetadata({ fileName: 'logo.cdr', mimeType: 'application/octet-stream', fileSizeBytes: 1024 }).reviewRequired, true)
  assert.throws(() => normalizeDtiArtworkMetadata({ fileName: '../escape.pdf', mimeType: 'application/pdf', fileSizeBytes: 1024 }), /nombre/)
  assert.throws(() => normalizeDtiArtworkMetadata({ fileName: 'large.png', mimeType: 'image/png', fileSizeBytes: 20 * 1024 * 1024 + 1 }), /20 MiB/)
})

test('server validation rejects malformed PNG/PDF and never treats manual formats as validated', async () => {
  assert.equal((await validateDtiArtworkBytes({ format: 'PNG', bytes: new Uint8Array([1, 2, 3]) })).status, 'failed')
  assert.equal((await validateDtiArtworkBytes({ format: 'PNG', bytes: makePng() })).status, 'passed')
  const corruptedPng = makePng()
  corruptedPng[corruptedPng.length - 1] ^= 0xff
  assert.equal((await validateDtiArtworkBytes({ format: 'PNG', bytes: corruptedPng })).reason, 'png_chunk_crc_mismatch')
  assert.equal((await validateDtiArtworkBytes({ format: 'AI', bytes: new Uint8Array([1, 2, 3]) })).status, 'manual_review')
  const pdf = new TextEncoder().encode(makePdf())
  assert.equal((await validateDtiArtworkBytes({ format: 'PDF', bytes: pdf })).status, 'passed')
  const activePdf = new TextEncoder().encode(makePdf(true))
  assert.equal((await validateDtiArtworkBytes({ format: 'PDF', bytes: activePdf })).status, 'manual_review')
  const escapedActionPdf = new TextEncoder().encode(makePdf(false, ' /Java#53cript true'))
  assert.equal((await validateDtiArtworkBytes({ format: 'PDF', bytes: escapedActionPdf })).status, 'manual_review')
  const compressedObjectsPdf = new TextEncoder().encode(makePdf(false, ' /Type /ObjStm'))
  assert.equal((await validateDtiArtworkBytes({ format: 'PDF', bytes: compressedObjectsPdf })).status, 'manual_review')
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
  const suspiciousPdf = { ...manual, format: 'PDF' }
  assert.equal(checkDtiPaymentEligibility({ order, latestVersion: suspiciousPdf }).reason, 'professional_review_required')
})

test('guest access tokens are deterministic for retries and distinct per idempotency key', async () => {
  const secret = 'server-only-test-secret'
  const recoveryKey = 'j84mkQ4nNfE0jxq38yEw82C1p3k7C9xA3mZqV6gLPXs'
  const first = await deriveGuestOrderToken(secret, 'request-a', recoveryKey)
  assert.equal(await deriveGuestOrderToken(secret, 'request-a', recoveryKey), first)
  assert.notEqual(await deriveGuestOrderToken(secret, 'request-b', recoveryKey), first)
  assert.notEqual(await deriveGuestOrderToken(secret, 'request-a', 'different-high-entropy-key'), first)
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

function makePng() {
  const crc32 = (bytes) => {
    let crc = 0xffffffff
    for (const byte of bytes) {
      crc ^= byte
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
    return (crc ^ 0xffffffff) >>> 0
  }
  const chunk = (type, data) => {
    const typeBytes = Buffer.from(type)
    const payload = Buffer.concat([typeBytes, data])
    const header = Buffer.alloc(4)
    header.writeUInt32BE(data.length)
    const checksum = Buffer.alloc(4)
    checksum.writeUInt32BE(crc32(payload))
    return Buffer.concat([header, payload, checksum])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(1, 0)
  ihdr.writeUInt32BE(1, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(Buffer.from([0, 0, 0, 0, 0]))), chunk('IEND', Buffer.alloc(0)),
  ])
}

function makePdf(active = false, extra = '') {
  const parts = ['%PDF-1.4\n']
  const offsets = [0]
  offsets.push(parts.join('').length)
  parts.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R${active ? ' /OpenAction /JavaScript' : ''}${extra} >>\nendobj\n`)
  offsets.push(parts.join('').length)
  parts.push('2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\n')
  const xrefOffset = parts.join('').length
  parts.push('xref\n0 3\n0000000000 65535 f \n')
  parts.push(`${String(offsets[1]).padStart(10, '0')} 00000 n \n`)
  parts.push(`${String(offsets[2]).padStart(10, '0')} 00000 n \n`)
  parts.push(`trailer\n<< /Size 3 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`)
  return parts.join('')
}
