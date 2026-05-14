import type { PaymentStatus, Order, OrderItem, OrderStatus } from '../../types/backend'

export type OrderRecord = Order

export type OrderItemRecord = OrderItem

export type OrderPaymentStatus = PaymentStatus

export type OrderCreateInput = Pick<OrderRecord, 'customer' | 'customerId' | 'items' | 'paymentStatus' | 'source'> & {
  id?: string
  createdAt?: string
  total?: number
  status: OrderStatus
}

export type OrderListFilters = {
  customerId?: string
  status?: OrderStatus
}
