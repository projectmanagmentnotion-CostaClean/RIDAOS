import type { AdminOrderStatus } from '../types/adminModels'

type OrderStatusConfig = {
  label: string
  colorClass: string
  group: 'review' | 'payment' | 'production' | 'done'
  order: number
}

export const orderStatusConfig: Record<AdminOrderStatus, OrderStatusConfig> = {
  pending_review: { label: 'Pendiente de Comprobacion', colorClass: 'warning', group: 'review', order: 10 },
  approved: { label: 'Aprobado', colorClass: 'success', group: 'review', order: 20 },
  needs_changes: { label: 'Necesita cambios', colorClass: 'danger', group: 'review', order: 30 },
  awaiting_payment: { label: 'Esperando pago', colorClass: 'warning', group: 'payment', order: 40 },
  paid: { label: 'Pagado', colorClass: 'info', group: 'payment', order: 50 },
  in_production: { label: 'En Fabricacion', colorClass: 'info', group: 'production', order: 60 },
  quality_check: { label: 'Control de calidad', colorClass: 'warning', group: 'production', order: 70 },
  ready: { label: 'Listo', colorClass: 'success', group: 'production', order: 80 },
  completed: { label: 'Completado', colorClass: 'success', group: 'done', order: 90 },
  cancelled: { label: 'Cancelado', colorClass: 'muted', group: 'done', order: 100 },
}

export const orderStatusOptions = Object.entries(orderStatusConfig)
  .sort(([, left], [, right]) => left.order - right.order)
  .map(([value, config]) => ({
    value: value as AdminOrderStatus,
    ...config,
  }))
