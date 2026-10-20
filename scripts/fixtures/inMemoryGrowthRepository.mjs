/** Test-only fixture. It has no disk, network, browser-storage, or production adapter. */
export class InMemoryGrowthRepository {
  #leads = new Map()
  #idempotencyKeys = new Map()
  #idempotencyByLead = new Map()
  #interactions = new Map()
  #campaigns
  #conversionEvents = new Map()
  #nextId = 1
  #now

  constructor({ campaigns = [], now = () => new Date().toISOString() } = {}) {
    this.#campaigns = structuredClone(campaigns)
    this.#now = now
  }

  async submitLead(input) {
    if (!input.consent?.accepted) {
      return { ok: false, code: 'consent_required', message: 'Consent is required.' }
    }
    if (!input.idempotencyKey || !input.name?.trim() || !input.message?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email ?? '')) {
      return { ok: false, code: 'invalid_input', message: 'Required lead fields are invalid.' }
    }

    const existingId = this.#idempotencyKeys.get(input.idempotencyKey)
    if (existingId) return { ok: true, value: structuredClone(this.#leads.get(existingId)) }

    const id = this.#createId('lead')
    const createdAt = this.#now()
    const lead = {
      id,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      ...(input.phone?.trim() ? { phone: input.phone.trim() } : {}),
      message: input.message.trim(),
      ...(input.campaignSlug ? { campaignSlug: input.campaignSlug } : {}),
      source: input.source,
      status: 'new',
      interestTags: [...new Set((input.interestTags ?? []).map((tag) => tag.trim()).filter(Boolean))],
      consent: structuredClone(input.consent),
      attribution: structuredClone(input.attribution ?? {}),
      createdAt,
      updatedAt: createdAt,
    }
    this.#leads.set(id, lead)
    this.#idempotencyKeys.set(input.idempotencyKey, id)
    this.#idempotencyByLead.set(id, input.idempotencyKey)
    this.#interactions.set(id, [])
    return { ok: true, value: structuredClone(lead) }
  }

  async listLeads(filters = {}) {
    const leads = [...this.#leads.values()]
      .filter((lead) => !filters.status || lead.status === filters.status)
      .filter((lead) => !filters.campaignSlug || lead.campaignSlug === filters.campaignSlug)
      .filter((lead) => !filters.source || lead.source === filters.source)
      .filter((lead) => !filters.createdAfter || lead.createdAt >= filters.createdAfter)
      .filter((lead) => !filters.createdBefore || lead.createdAt <= filters.createdBefore)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id))
    const offset = Math.max(0, Number(filters.cursor) || 0)
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 50))
    return { ok: true, value: structuredClone(leads.slice(offset, offset + limit)) }
  }

  async updateLeadStatus(leadId, status) {
    const lead = this.#leads.get(leadId)
    if (!lead) return { ok: false, code: 'not_found', message: 'Lead not found.' }
    lead.status = status
    lead.updatedAt = this.#now()
    return { ok: true, value: structuredClone(lead) }
  }

  async exportLead(leadId) {
    const lead = this.#leads.get(leadId)
    if (!lead) return { ok: false, code: 'not_found', message: 'Lead not found.' }
    const conversionEvents = [...this.#conversionEvents.values()].filter((event) => event.leadId === leadId)
    return {
      ok: true,
      value: structuredClone({ lead, interactions: this.#interactions.get(leadId), conversionEvents }),
    }
  }

  async deleteLead(leadId) {
    if (!this.#leads.has(leadId)) return { ok: false, code: 'not_found', message: 'Lead not found.' }
    const idempotencyKey = this.#idempotencyByLead.get(leadId)
    this.#leads.delete(leadId)
    this.#interactions.delete(leadId)
    this.#idempotencyByLead.delete(leadId)
    if (idempotencyKey) this.#idempotencyKeys.delete(idempotencyKey)
    for (const [key, event] of this.#conversionEvents) {
      if (event.leadId === leadId) this.#conversionEvents.delete(key)
    }
    return { ok: true, value: { deleted: true } }
  }

  async setLeadInterestTags(leadId, tags) {
    const lead = this.#leads.get(leadId)
    if (!lead) return { ok: false, code: 'not_found', message: 'Lead not found.' }
    lead.interestTags = [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))]
    lead.updatedAt = this.#now()
    return { ok: true, value: structuredClone(lead) }
  }

  async linkLeadRecords(leadId, records) {
    const lead = this.#leads.get(leadId)
    if (!lead) return { ok: false, code: 'not_found', message: 'Lead not found.' }
    if (records.quoteId) lead.quoteId = records.quoteId
    if (records.orderId) lead.orderId = records.orderId
    lead.updatedAt = this.#now()
    return { ok: true, value: structuredClone(lead) }
  }

  async addInteraction(interaction) {
    if (!this.#leads.has(interaction.leadId)) {
      return { ok: false, code: 'not_found', message: 'Lead not found.' }
    }
    const saved = { ...structuredClone(interaction), id: this.#createId('interaction') }
    this.#interactions.get(interaction.leadId).push(saved)
    return { ok: true, value: structuredClone(saved) }
  }

  async listInteractions(leadId) {
    if (!this.#leads.has(leadId)) return { ok: false, code: 'not_found', message: 'Lead not found.' }
    return { ok: true, value: structuredClone(this.#interactions.get(leadId)) }
  }

  async listCampaigns() {
    return { ok: true, value: structuredClone(this.#campaigns) }
  }

  async recordConversionEvent(event) {
    if (!this.#leads.has(event.leadId)) return { ok: false, code: 'not_found', message: 'Lead not found.' }
    const existing = this.#conversionEvents.get(event.deduplicationKey)
    if (existing) return { ok: true, value: structuredClone(existing) }
    const saved = { ...structuredClone(event), id: this.#createId('conversion') }
    this.#conversionEvents.set(event.deduplicationKey, saved)
    return { ok: true, value: structuredClone(saved) }
  }

  async getMetrics(periodStart, periodEnd) {
    const leads = [...this.#leads.values()].filter((lead) => lead.createdAt >= periodStart && lead.createdAt <= periodEnd)
    const byStatus = { new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 }
    const byCampaign = {}
    const conversions = { lead_received: 0, quote_issued: 0, order_won: 0 }
    for (const lead of leads) {
      byStatus[lead.status] += 1
      if (lead.campaignSlug) byCampaign[lead.campaignSlug] = (byCampaign[lead.campaignSlug] ?? 0) + 1
    }
    for (const event of this.#conversionEvents.values()) {
      if (event.occurredAt >= periodStart && event.occurredAt <= periodEnd) conversions[event.name] += 1
    }
    return { ok: true, value: { leads: leads.length, byStatus, byCampaign, conversions, periodStart, periodEnd } }
  }

  #createId(prefix) {
    return `${prefix}-${this.#nextId++}`
  }
}
