import type { OrderStatus as LegacyOrderStatus } from '../../types/backend'

export const orderLifecycleStatuses = [
  'draft',
  'pending_review',
  'artwork_received',
  'artwork_checking',
  'artwork_approved',
  'needs_changes',
  'awaiting_payment',
  'paid',
  'queued_for_production',
  'in_production',
  'quality_check',
  'ready_for_pickup',
  'shipped',
  'delivered',
  'cancelled',
] as const

export type OrderLifecycleStatus = (typeof orderLifecycleStatuses)[number]

export type OrderRuntimeStatus = OrderLifecycleStatus | LegacyOrderStatus
