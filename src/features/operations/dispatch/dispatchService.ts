import type { AdminShippingStatus } from '../../../admin/types/adminModels'
import { deliveryMessageTemplates } from './dispatchMockData'
import type {
  DeliveryMessagePreview,
  DispatchBoardColumnKey,
  DispatchDashboardData,
  DispatchCardRecord,
  OperationsOrderRecord,
} from '../types/operations'

function getDispatchColumn(order: OperationsOrderRecord): DispatchBoardColumnKey {
  if (order.deliveryIncident) {
    return 'incidents'
  }
  if (order.deliveryMethod === 'pickup' && order.shippingStatus === 'ready_for_dispatch') {
    return 'ready_for_pickup'
  }
  if (order.shippingStatus === 'shipped' || order.shippingStatus === 'delivered' || order.deliveryMethod !== 'pickup') {
    return 'delivery_queue'
  }
  return 'packing'
}

export function buildDispatchCard(order: OperationsOrderRecord): DispatchCardRecord {
  return {
    ...order,
    dispatchColumn: getDispatchColumn(order),
  }
}

export function buildDispatchDashboard(orders: OperationsOrderRecord[]): DispatchDashboardData {
  const cards = orders.map(buildDispatchCard)
  const today = new Date().toISOString().slice(0, 10)
  return {
    kpis: [
      {
        key: 'dispatch-ready',
        label: 'Listos para salida',
        value: cards.filter((item) => item.shippingStatus === 'ready_for_dispatch').length,
        note: 'Pedidos preparados para pickup o salida.',
      },
      {
        key: 'packing-pending',
        label: 'Pendientes de embalaje',
        value: cards.filter((item) => item.packingStatus === 'not_packed' || item.packingStatus === 'packing').length,
        note: 'Trabajos que todavia no cierran handoff.',
      },
      {
        key: 'pickup-today',
        label: 'Recogidas de hoy',
        value: cards.filter((item) => item.deliveryMethod === 'pickup' && item.scheduledDate === today).length,
        note: 'Clientes que pueden pasar hoy.',
      },
      {
        key: 'delivery-incidents',
        label: 'Incidencias',
        value: cards.filter((item) => Boolean(item.deliveryIncident)).length,
        note: 'Pedidos con bloqueo o retraso operativo.',
      },
    ],
    readyForPickup: cards.filter((item) => item.dispatchColumn === 'ready_for_pickup').slice(0, 5),
    packingQueue: cards.filter((item) => item.dispatchColumn === 'packing').slice(0, 5),
    todayDeliveries: cards.filter((item) => item.dispatchColumn === 'delivery_queue').slice(0, 5),
    incidents: cards.filter((item) => item.dispatchColumn === 'incidents').slice(0, 5),
    handoffs: cards
      .filter((item) => item.shippingStatus !== 'not_ready')
      .sort((left, right) => left.dueDate.localeCompare(right.dueDate))
      .slice(0, 6),
  }
}

export function groupDispatchColumns(orders: OperationsOrderRecord[]) {
  const cards = orders.map(buildDispatchCard)
  return {
    packing: cards.filter((item) => item.dispatchColumn === 'packing'),
    ready_for_pickup: cards.filter((item) => item.dispatchColumn === 'ready_for_pickup'),
    delivery_queue: cards.filter((item) => item.dispatchColumn === 'delivery_queue'),
    incidents: cards.filter((item) => item.dispatchColumn === 'incidents'),
  }
}

export function buildDeliveryMessagePreviews(order: OperationsOrderRecord): DeliveryMessagePreview[] {
  const resolve = (template: string) =>
    template
      .replace('{orderId}', order.id)
      .replace('{contact}', order.customerContactPreference === 'phone' ? order.phone : order.email)
      .replace('{tracking}', order.trackingCode || 'RDS-PENDING')
      .replace('{window}', order.deliveryWindow)

  return [
    { key: 'pickup_ready', label: 'Listo para recoger', message: resolve(deliveryMessageTemplates.pickup_ready) },
    { key: 'shipped', label: 'Pedido enviado', message: resolve(deliveryMessageTemplates.shipped) },
    { key: 'incident', label: 'Incidencia', message: resolve(deliveryMessageTemplates.incident) },
    { key: 'delayed', label: 'Retraso', message: resolve(deliveryMessageTemplates.delayed) },
    { key: 'delivered', label: 'Entrega completada', message: resolve(deliveryMessageTemplates.delivered) },
  ]
}

export function getNextShippingStatus(status: AdminShippingStatus): AdminShippingStatus {
  if (status === 'not_ready') return 'label_pending'
  if (status === 'label_pending') return 'ready_for_dispatch'
  if (status === 'ready_for_dispatch') return 'shipped'
  return 'delivered'
}
