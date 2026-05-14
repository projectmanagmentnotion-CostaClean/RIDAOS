import type { OrderCreateInput, OrderListFilters, OrderRecord } from './order.types'

export interface OrderRepository {
  listOrders(filters?: OrderListFilters): Promise<OrderRecord[]>
  getOrderById(orderId: string): Promise<OrderRecord | undefined>
  createOrder(order: OrderRecord): Promise<OrderRecord>
  createDraft(input: OrderCreateInput): Promise<OrderRecord>
}
