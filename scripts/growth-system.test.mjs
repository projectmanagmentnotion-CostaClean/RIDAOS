import assert from 'node:assert/strict'
import test from 'node:test'
import { getCampaignProductHref, getCampaignQuoteHref } from '../src/features/growth-system/campaignAttribution.mjs'
import { createHmac } from 'node:crypto'
import { getMetaWebhookChallenge, verifyMetaWebhookSignature } from '../src/features/growth-system/server/metaWebhookSecurity.mjs'
import { InMemoryGrowthRepository } from './fixtures/inMemoryGrowthRepository.mjs'

function makeLead(overrides = {}) {
  return {
    name: 'Ada Example',
    email: 'ada@example.com',
    message: 'Necesito una propuesta de impresión.',
    source: 'campaign',
    campaignSlug: 'dtf-por-metro',
    attribution: { source: 'instagram', medium: 'organic' },
    consent: { accepted: true, policyVersion: 'test-v1', acceptedAt: '2026-10-21T10:00:00.000Z' },
    idempotencyKey: 'lead-event-1',
    ...overrides,
  }
}

test('keeps the service selector and carries approved UTM fields from clean and hash URLs', () => {
  const href = getCampaignQuoteHref(
    { slug: 'rotulacion-vehiculos', quoteHref: '#/presupuesto?service=rotulacion' },
    '?utm_source=instagram&utm_content=story%20one',
    '#/growth/rotulacion-vehiculos?utm_medium=organic&utm_campaign=verano',
  )
  const query = new URLSearchParams(href.slice(href.indexOf('?') + 1))

  assert.equal(href.split('?')[0], '#/presupuesto')
  assert.equal(query.get('service'), 'rotulacion')
  assert.equal(query.get('utm_source'), 'instagram')
  assert.equal(query.get('utm_medium'), 'organic')
  assert.equal(query.get('utm_campaign'), 'verano')
  assert.equal(query.get('utm_content'), 'story one')
})

test('uses a query separator for campaigns whose quote route has no service query', () => {
  assert.equal(
    getCampaignQuoteHref({ slug: 'promociones', quoteHref: '#/presupuesto' }, '', ''),
    '#/presupuesto?utm_campaign=promociones',
  )
})

test('does not carry click identifiers, arbitrary query fields, or personal data', () => {
  const href = getCampaignQuoteHref(
    { slug: 'textil-personalizado', quoteHref: '#/presupuesto?service=textil' },
    '?fbclid=ad-id&email=person%40example.com&utm_source=instagram',
    '#/growth/textil-personalizado?gclid=click-id&secret=ignore',
  )

  assert.equal(href, '#/presupuesto?service=textil&utm_source=instagram&utm_campaign=textil-personalizado')
})

test('carries approved attribution through the product CTA and into its next quote action', () => {
  const productHref = getCampaignProductHref(
    { slug: 'dtf-por-metro', productHref: '#/producto/dti-por-metro' },
    '?utm_source=instagram&utm_medium=organic',
    '#/growth/dtf-por-metro?utm_content=reel',
  )
  const quoteHref = getCampaignQuoteHref(
    { slug: 'dtf-por-metro', quoteHref: '#/presupuesto?service=textil' },
    '',
    productHref,
  )
  const quoteQuery = new URLSearchParams(quoteHref.slice(quoteHref.indexOf('?') + 1))

  assert.equal(productHref, '#/producto/dti-por-metro?utm_source=instagram&utm_medium=organic&utm_content=reel&utm_campaign=dtf-por-metro')
  assert.equal(quoteQuery.get('service'), 'textil')
  assert.equal(quoteQuery.get('utm_source'), 'instagram')
  assert.equal(quoteQuery.get('utm_medium'), 'organic')
  assert.equal(quoteQuery.get('utm_content'), 'reel')
  assert.equal(quoteQuery.get('utm_campaign'), 'dtf-por-metro')
})

test('PASS_MOCK requires consent and validates lead intake without storing invalid submissions', async () => {
  const repository = new InMemoryGrowthRepository()

  const noConsent = await repository.submitLead(makeLead({ consent: { accepted: false } }))
  const invalidEmail = await repository.submitLead(makeLead({ idempotencyKey: 'invalid', email: 'bad-email' }))
  const leads = await repository.listLeads()

  assert.equal(noConsent.ok, false)
  assert.equal(noConsent.code, 'consent_required')
  assert.equal(invalidEmail.ok, false)
  assert.equal(invalidEmail.code, 'invalid_input')
  assert.deepEqual(leads.value, [])
})

test('PASS_MOCK makes lead intake idempotent and supports tags, quote/order links, and interaction history', async () => {
  const repository = new InMemoryGrowthRepository({ now: () => '2026-10-21T10:00:00.000Z' })
  const first = await repository.submitLead(makeLead({ interestTags: ['dtf', 'textil', 'dtf'] }))
  const duplicate = await repository.submitLead(makeLead({ name: 'Different retry', idempotencyKey: 'lead-event-1' }))

  assert.equal(first.ok, true)
  assert.equal(duplicate.ok, true)
  assert.equal(first.value.id, duplicate.value.id)
  assert.deepEqual(first.value.interestTags, ['dtf', 'textil'])

  const tags = await repository.setLeadInterestTags(first.value.id, ['rotulación', ' rotulación ', 'flota'])
  const linked = await repository.linkLeadRecords(first.value.id, { quoteId: 'quote-fixture-1', orderId: 'order-fixture-1' })
  const interaction = await repository.addInteraction({
    leadId: first.value.id,
    channel: 'email',
    summary: 'Se revisó el alcance de la solicitud.',
    occurredAt: '2026-10-21T10:01:00.000Z',
    createdBy: 'sales-fixture',
  })
  const history = await repository.listInteractions(first.value.id)

  assert.deepEqual(tags.value.interestTags, ['rotulación', 'flota'])
  assert.equal(linked.value.quoteId, 'quote-fixture-1')
  assert.equal(linked.value.orderId, 'order-fixture-1')
  assert.equal(interaction.ok, true)
  assert.equal(history.value.length, 1)
  assert.equal(history.value[0].channel, 'email')
})

test('PASS_MOCK deduplicates conversion events and returns campaign and status metrics', async () => {
  const repository = new InMemoryGrowthRepository({
    campaigns: [{ slug: 'dtf-por-metro', name: 'DTF', status: 'active' }],
    now: () => '2026-10-21T10:00:00.000Z',
  })
  const lead = await repository.submitLead(makeLead())
  await repository.updateLeadStatus(lead.value.id, 'quoted')
  const event = {
    leadId: lead.value.id,
    name: 'quote_issued',
    occurredAt: '2026-10-21T10:02:00.000Z',
    deduplicationKey: 'quote-fixture-1',
  }
  const firstEvent = await repository.recordConversionEvent(event)
  const duplicateEvent = await repository.recordConversionEvent(event)
  const campaigns = await repository.listCampaigns()
  const metrics = await repository.getMetrics('2026-10-01T00:00:00.000Z', '2026-10-31T23:59:59.999Z')
  const filtered = await repository.listLeads({ status: 'quoted', campaignSlug: 'dtf-por-metro', source: 'campaign' })

  assert.equal(firstEvent.value.id, duplicateEvent.value.id)
  assert.equal(campaigns.value[0].slug, 'dtf-por-metro')
  assert.equal(metrics.value.leads, 1)
  assert.equal(metrics.value.byStatus.quoted, 1)
  assert.equal(metrics.value.byCampaign['dtf-por-metro'], 1)
  assert.equal(metrics.value.conversions.quote_issued, 1)
  assert.equal(filtered.value.length, 1)
})

test('PASS_MOCK exports consent/history and removes the lead and linked fixture data', async () => {
  const repository = new InMemoryGrowthRepository({ now: () => '2026-10-21T10:00:00.000Z' })
  const lead = await repository.submitLead(makeLead())
  await repository.addInteraction({
    leadId: lead.value.id,
    channel: 'instagram',
    summary: 'La persona inició un contacto de prueba.',
    occurredAt: '2026-10-21T10:01:00.000Z',
    createdBy: 'test-fixture',
  })
  await repository.recordConversionEvent({
    leadId: lead.value.id,
    name: 'lead_received',
    occurredAt: '2026-10-21T10:00:00.000Z',
    deduplicationKey: 'lead-conversion-fixture',
  })
  const exported = await repository.exportLead(lead.value.id)
  const deleted = await repository.deleteLead(lead.value.id)
  const leads = await repository.listLeads()
  const eventsAfterDelete = await repository.getMetrics('2026-10-01T00:00:00.000Z', '2026-10-31T23:59:59.999Z')

  assert.equal(exported.value.lead.consent.policyVersion, 'test-v1')
  assert.equal(exported.value.interactions.length, 1)
  assert.equal(exported.value.conversionEvents.length, 1)
  assert.equal(deleted.value.deleted, true)
  assert.deepEqual(leads.value, [])
  assert.equal(eventsAfterDelete.value.conversions.lead_received, 0)
})

test('PASS_REAL verifies the raw-body Meta webhook HMAC and rejects malformed or changed deliveries', () => {
  const secret = 'test-only-app-secret'
  const rawBody = Buffer.from('{"object":"instagram","entry":[]}')
  const digest = createHmac('sha256', secret).update(rawBody).digest('hex')

  assert.equal(verifyMetaWebhookSignature(rawBody, `sha256=${digest}`, secret), true)
  assert.equal(verifyMetaWebhookSignature(Buffer.from('{"object":"changed"}'), `sha256=${digest}`, secret), false)
  assert.equal(verifyMetaWebhookSignature(rawBody, digest, secret), false)
  assert.equal(verifyMetaWebhookSignature(rawBody, `sha256=${digest}`, ''), false)
})

test('PASS_REAL returns the Meta webhook challenge only for the matching subscription token', () => {
  const valid = getMetaWebhookChallenge({
    mode: 'subscribe',
    verifyToken: 'test-only-verify-token',
    expectedToken: 'test-only-verify-token',
    challenge: 'challenge-fixture',
  })
  const invalid = getMetaWebhookChallenge({
    mode: 'subscribe',
    verifyToken: 'wrong-token',
    expectedToken: 'test-only-verify-token',
    challenge: 'challenge-fixture',
  })

  assert.equal(valid, 'challenge-fixture')
  assert.equal(invalid, null)
})
