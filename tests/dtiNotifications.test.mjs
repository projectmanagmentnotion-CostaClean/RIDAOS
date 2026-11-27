import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DTI_NOTIFICATION_TEMPLATES,
  dtiNotificationIdempotencyKey,
  planDtiNotificationRetry,
  renderDtiCustomerEmail,
} from '../supabase/functions/_shared/dtiNotifications.mjs'

const eventId = 'b67301d4-c8b6-4afd-a733-7c9235255092'

test('renders professional Spanish templates for the complete customer lifecycle', () => {
  for (const key of Object.keys(DTI_NOTIFICATION_TEMPLATES)) {
    const email = renderDtiCustomerEmail(key, { reference: 'DTI-2048', meters: 4, fulfilment: 'pickup' })
    assert.match(email.subject, /DTI-2048/)
    assert.match(email.text, /Ridaos Print/)
    assert.match(email.html, /lang="es"/)
    assert.match(email.html, /DTI-2048/)
  }
  assert.equal(Object.keys(DTI_NOTIFICATION_TEMPLATES).length, 18)
  assert.match(renderDtiCustomerEmail('payment_confirmed', { reference: 'DTI-2048' }).text, /Pago confirmado/)
})

test('supports distinct prepared, dispatch, and pickup messages', () => {
  assert.match(renderDtiCustomerEmail('ready_for_dispatch', { fulfilment: 'pickup' }).text, /Carrer d’Aragó 423/)
  assert.match(renderDtiCustomerEmail('ready_for_dispatch', { fulfilment: 'shipping' }).text, /preparado para despacho/)
  assert.match(renderDtiCustomerEmail('order_dispatched', { trackingReference: 'TRACK-9' }).text, /TRACK-9/)
  assert.match(renderDtiCustomerEmail('ready_for_pickup', {}).text, /listo para recoger/)
})

test('escapes user-controlled values and excludes unapproved customer PII', () => {
  const email = renderDtiCustomerEmail('order_received', {
    reference: '<script>alert(1)</script>',
    meters: 2,
    customerEmail: 'private@example.test',
    customerPhone: '+34999000111',
  })
  assert.doesNotMatch(email.html, /<script>/)
  assert.match(email.html, /&lt;script&gt;/)
  assert.doesNotMatch(email.text, /private@example\.test|\+34999000111/)
  assert.throws(() => renderDtiCustomerEmail('unknown', {}), /Unsupported/)
})

test('normalizes header control characters and bounds malformed quantities', () => {
  const email = renderDtiCustomerEmail('order_received', {
    reference: 'DTI-2048\r\nBcc: attacker@example.test',
    meters: -4,
  })
  assert.doesNotMatch(email.subject, /\r|\n/)
  assert.match(email.text, /solicitud de 0 m/)
})

test('uses source event id for deterministic transport idempotency without PII', () => {
  assert.equal(
    dtiNotificationIdempotencyKey(eventId, 'order_received'),
    dtiNotificationIdempotencyKey(eventId.toUpperCase(), 'order_received'),
  )
  assert.match(dtiNotificationIdempotencyKey(eventId, 'order_received'), new RegExp(eventId))
  assert.throws(() => dtiNotificationIdempotencyKey('bad-id', 'order_received'), /source event/)
  assert.throws(() => dtiNotificationIdempotencyKey(eventId, 'not_a_notification'), /Unsupported/)
})

test('schedules bounded exponential retry and stops after six attempts', () => {
  const now = Date.UTC(2026, 0, 1)
  assert.equal(planDtiNotificationRetry(1, now).availableAt.getTime(), now + 60_000)
  assert.equal(planDtiNotificationRetry(2, now).availableAt.getTime(), now + 120_000)
  assert.equal(planDtiNotificationRetry(6, now).retry, false)
  assert.throws(() => planDtiNotificationRetry(0, now), /positive integer/)
})
