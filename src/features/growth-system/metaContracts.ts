export type MetaGrowthEventType =
  | 'instagram.message.received'
  | 'instagram.comment.created'
  | 'lead_ads.lead.created'

/** Normalized, provider-facing event metadata; do not store an unfiltered raw payload here. */
export interface MetaGrowthEvent {
  provider: 'meta'
  type: MetaGrowthEventType
  eventId: string
  occurredAt: string
  accountId: string
  deduplicationKey: string
}

export type MetaAdapterResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: 'invalid_signature' | 'unsupported_event' | 'invalid_payload' | 'unavailable' }

/** Contract only. A concrete adapter requires an authorized Meta app and endpoint. */
export interface MetaIntegrationAdapter {
  verifyWebhookChallenge(input: {
    mode: string | null
    verifyToken: string | null
    challenge: string | null
  }): string | null
  verifyWebhookSignature(rawBody: Uint8Array, signatureHeader: string | null): boolean
  normalizeWebhook(rawBody: Uint8Array): MetaAdapterResult<MetaGrowthEvent[]>
}
