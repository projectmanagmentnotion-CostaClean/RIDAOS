import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  authorizeDtiWorker,
  createResendDtiProvider,
  processDtiNotificationBatch,
} from '../supabase/functions/_shared/dtiNotificationWorker.mjs'

const notification = {
  id: '33cf6468-4ec6-4790-898e-b692d086daf5',
  order_id: '71712775-bdad-472b-b394-72e4db76405a',
  source_event_id: 'b67301d4-c8b6-4afd-a733-7c9235255092',
  notification_key: 'payment_confirmed',
  attempt_count: 1,
}

function fakeAdmin({ order, claimError, completeError, failError } = {}) {
  const calls = []
  const resolvedOrder = order === undefined ? { id: notification.order_id, customer_email: 'private@example.test', meters: 3, shipping_method: 'standard', tracking_reference: null } : order
  const admin = {
    calls,
    async rpc(name, args) {
      calls.push({ name, args })
      if (name === 'dti_claim_customer_notifications') return { data: claimError ? null : [notification], error: claimError }
      if (name === 'dti_complete_customer_notification') return { data: completeError ? null : true, error: completeError }
      if (name === 'dti_fail_customer_notification') return { data: failError ? null : true, error: failError }
      throw new Error('unexpected_rpc')
    },
    from(table) {
      assert.equal(table, 'dti_orders')
      return {
        select(columns) {
          assert.equal(columns, 'id,customer_email,meters,shipping_method,tracking_reference')
          return this
        },
        eq() { return this },
        async maybeSingle() { return { data: resolvedOrder, error: null } },
      }
    },
  }
  return admin
}

test('sends an allowlisted notification and marks the outbox only after provider acceptance', async () => {
  const admin = fakeAdmin()
  const delivered = []
  const logs = []
  const result = await processDtiNotificationBatch({
    admin,
    provider: { async send(message) { delivered.push(message); return { ok: true } } },
    logger: (entry) => logs.push(entry),
  })
  assert.deepEqual(result, { claimed: 1, sent: 1, retried: 0, failed: 0 })
  assert.equal(delivered[0].to, 'private@example.test')
  assert.equal(delivered[0].idempotencyKey, `dti:${notification.source_event_id}:payment_confirmed`)
  assert.match(delivered[0].subject, /Pedido confirmado/)
  assert.equal(admin.calls[1].name, 'dti_complete_customer_notification')
  assert.doesNotMatch(JSON.stringify(logs), /private@example\.test/)
})

test('transient failures are retried with a safe code and never log provider data', async () => {
  const admin = fakeAdmin()
  const logs = []
  const result = await processDtiNotificationBatch({
    admin,
    provider: { async send() { return { ok: false, permanent: false, body: 'secret provider response' } } },
    logger: (entry) => logs.push(entry),
  })
  assert.equal(result.retried, 1)
  assert.equal(admin.calls[1].name, 'dti_fail_customer_notification')
  assert.deepEqual(admin.calls[1].args, { p_outbox_id: notification.id, p_safe_error_code: 'provider_unavailable' })
  assert.doesNotMatch(JSON.stringify(logs), /secret provider response|private@example\.test/)
})

test('provider rejections become permanent safe failures and unknown orders never send', async () => {
  const rejectedAdmin = fakeAdmin()
  const rejected = await processDtiNotificationBatch({
    admin: rejectedAdmin,
    provider: { async send() { return { ok: false, permanent: true } } },
  })
  assert.equal(rejected.failed, 1)
  assert.equal(rejectedAdmin.calls[1].args.p_safe_error_code, 'provider_rejected')

  const missingAdmin = fakeAdmin({ order: null })
  let sends = 0
  const missing = await processDtiNotificationBatch({ admin: missingAdmin, provider: { async send() { sends += 1; return { ok: true } } } })
  assert.equal(missing.failed, 1)
  assert.equal(sends, 0)
  assert.equal(missingAdmin.calls[1].args.p_safe_error_code, 'order_unavailable')
})

test('authorization is constant-time style and requires a configured worker token', () => {
  const request = (authorization) => new Request('https://example.test', { headers: authorization ? { authorization } : {} })
  const secret = 'local-worker-secret-which-is-long-enough-32'
  assert.equal(authorizeDtiWorker(request(`Bearer ${secret}`), secret), true)
  assert.equal(authorizeDtiWorker(request('Bearer wrong'), secret), false)
  assert.equal(authorizeDtiWorker(request(''), ''), false)
})

test('Resend adapter sends stable idempotency and maps responses without exposing bodies', async () => {
  let requestOptions
  const provider = createResendDtiProvider({
    apiKey: 'test-token',
    from: 'Ridaos <orders@example.test>',
    fetchImpl: async (_url, options) => { requestOptions = options; return new Response('{"id":"test-id"}', { status: 200 }) },
  })
  const result = await provider.send({ to: 'client@example.test', subject: 'test', text: 'text', html: '<p>test</p>', idempotencyKey: 'dti:event:confirmed' })
  assert.deepEqual(result, { ok: true })
  assert.equal(requestOptions.headers['idempotency-key'], 'dti:event:confirmed')
  assert.equal(JSON.parse(requestOptions.body).from, 'Ridaos <orders@example.test>')

  const rejected = createResendDtiProvider({ apiKey: 'test-token', from: 'orders@example.test', fetchImpl: async () => new Response('private detail', { status: 422 }) })
  assert.deepEqual(await rejected.send({ to: 'client@example.test' }), { ok: false, permanent: true })
})

test('Edge Function cannot claim queue items until transport is explicitly enabled', async () => {
  const source = await readFile(new URL('../supabase/functions/dti-notification-worker/index.ts', import.meta.url), 'utf8')
  assert.ok(source.indexOf("DTI_EMAIL_TRANSPORT_ENABLED') !== 'true'") < source.indexOf('createClient(url, serviceKey'))
  assert.match(source, /SUPABASE_SERVICE_ROLE_KEY/)
  assert.doesNotMatch(source, /VITE_.*(?:SERVICE_ROLE|RESEND)/)
})
