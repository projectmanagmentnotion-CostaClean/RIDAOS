/** Provider-neutral domain contracts. These types do not imply a live backend. */

export type GrowthLeadSource = 'campaign' | 'reel' | 'comment' | 'ad' | 'landing'
export type GrowthLeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
export type GrowthInteractionChannel = 'email' | 'phone' | 'instagram' | 'whatsapp' | 'other'
export type GrowthConversionName = 'lead_received' | 'quote_issued' | 'order_won'

export interface GrowthAttribution {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
}

export interface GrowthConsent {
  accepted: boolean
  policyVersion: string
  acceptedAt: string
}

export interface GrowthLeadSubmission {
  name: string
  email: string
  phone?: string
  message: string
  campaignSlug?: string
  source: GrowthLeadSource
  interestTags?: string[]
  attribution: GrowthAttribution
  consent: GrowthConsent
  idempotencyKey: string
}

export interface GrowthLead {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  campaignSlug?: string
  source: GrowthLeadSource
  status: GrowthLeadStatus
  interestTags: string[]
  consent: GrowthConsent
  attribution: GrowthAttribution
  quoteId?: string
  orderId?: string
  createdAt: string
  updatedAt: string
}

export interface GrowthInteraction {
  id: string
  leadId: string
  channel: GrowthInteractionChannel
  summary: string
  occurredAt: string
  createdBy: string
}

export interface GrowthCampaignRecord {
  slug: string
  name: string
  status: 'draft' | 'active' | 'paused' | 'ended'
  startsAt?: string
  endsAt?: string
}

export interface GrowthLeadFilters {
  status?: GrowthLeadStatus
  campaignSlug?: string
  source?: GrowthLeadSource
  createdAfter?: string
  createdBefore?: string
  limit?: number
  cursor?: string
}

export interface GrowthMetrics {
  leads: number
  byStatus: Record<GrowthLeadStatus, number>
  byCampaign: Record<string, number>
  conversions: Record<GrowthConversionName, number>
  periodStart: string
  periodEnd: string
}

export interface GrowthConversionEvent {
  id: string
  leadId: string
  name: GrowthConversionName
  occurredAt: string
  deduplicationKey: string
}

export interface GrowthLeadExport {
  lead: GrowthLead
  interactions: GrowthInteraction[]
  conversionEvents: GrowthConversionEvent[]
}

export type GrowthRepositoryErrorCode =
  | 'invalid_input'
  | 'consent_required'
  | 'unauthorized'
  | 'not_found'
  | 'conflict'
  | 'rate_limited'
  | 'unavailable'

export type GrowthRepositoryResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: GrowthRepositoryErrorCode; message: string }

/** Intended for a trusted server adapter; never expose CRM queries to the browser. */
export interface GrowthRepository {
  submitLead(input: GrowthLeadSubmission): Promise<GrowthRepositoryResult<GrowthLead>>
  listLeads(filters: GrowthLeadFilters): Promise<GrowthRepositoryResult<GrowthLead[]>>
  updateLeadStatus(
    leadId: string,
    status: GrowthLeadStatus,
  ): Promise<GrowthRepositoryResult<GrowthLead>>
  exportLead(leadId: string): Promise<GrowthRepositoryResult<GrowthLeadExport>>
  deleteLead(leadId: string): Promise<GrowthRepositoryResult<{ deleted: true }>>
  setLeadInterestTags(
    leadId: string,
    tags: string[],
  ): Promise<GrowthRepositoryResult<GrowthLead>>
  linkLeadRecords(
    leadId: string,
    records: { quoteId?: string; orderId?: string },
  ): Promise<GrowthRepositoryResult<GrowthLead>>
  addInteraction(
    interaction: Omit<GrowthInteraction, 'id'>,
  ): Promise<GrowthRepositoryResult<GrowthInteraction>>
  listInteractions(leadId: string): Promise<GrowthRepositoryResult<GrowthInteraction[]>>
  listCampaigns(): Promise<GrowthRepositoryResult<GrowthCampaignRecord[]>>
  recordConversionEvent(
    event: Omit<GrowthConversionEvent, 'id'>,
  ): Promise<GrowthRepositoryResult<GrowthConversionEvent>>
  getMetrics(periodStart: string, periodEnd: string): Promise<GrowthRepositoryResult<GrowthMetrics>>
}
