import { getOrderLifecycleDescriptor } from '../../domain/orders/orderLifecycle'
import type { OrderLifecycleStatus } from '../../domain/orders/order-status.types'
import type { AdminOrderStatus } from '../types/adminModels'

const adminToLifecycleStatus: Record<AdminOrderStatus, OrderLifecycleStatus> = {
  pending_review: 'pending_review',
  approved: 'artwork_approved',
  needs_changes: 'needs_changes',
  awaiting_payment: 'awaiting_payment',
  paid: 'paid',
  in_production: 'in_production',
  quality_check: 'quality_check',
  ready: 'ready_for_pickup',
  completed: 'delivered',
  cancelled: 'cancelled',
}

export function getLifecycleStatusFromAdminStatus(status: AdminOrderStatus) {
  return adminToLifecycleStatus[status]
}

export function getLifecycleDescriptorFromAdminStatus(status: AdminOrderStatus) {
  return getOrderLifecycleDescriptor(getLifecycleStatusFromAdminStatus(status))
}
