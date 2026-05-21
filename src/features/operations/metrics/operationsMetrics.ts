import type { OperationsOrderRecord } from '../types/operations'

export function countUrgentOperations(orders: OperationsOrderRecord[]) {
  return orders.filter((order) => order.priority === 'urgent').length
}

export function countOrdersReadyForDispatch(orders: OperationsOrderRecord[]) {
  return orders.filter((order) => order.shippingStatus === 'ready_for_dispatch' || order.shippingStatus === 'label_pending').length
}
