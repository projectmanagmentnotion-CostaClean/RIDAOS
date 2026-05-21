import type { AdminOrder, AdminSlaStatus } from '../../../../admin/types/adminModels'

const HOUR = 1000 * 60 * 60

export function getSlaHoursRemaining(order: Pick<AdminOrder, 'dueDate'>) {
  return Math.round((new Date(order.dueDate).getTime() - Date.now()) / HOUR)
}

export function deriveSlaStatus(order: Pick<AdminOrder, 'dueDate' | 'status'>): AdminSlaStatus {
  if (order.status === 'completed' || order.status === 'cancelled') {
    return 'on_track'
  }

  const hours = getSlaHoursRemaining(order)

  if (hours < 0) {
    return 'breached'
  }

  if (hours <= 24) {
    return 'at_risk'
  }

  return 'on_track'
}

export function needsImmediateAttention(slaStatus: AdminSlaStatus, escalationLevel: string) {
  return slaStatus === 'breached' || escalationLevel === 'critical' || escalationLevel === 'urgent'
}
