import type { OrderRepository } from '../../domain/orders/order.repository'
import type { OrderCreateInput, OrderListFilters, OrderRecord } from '../../domain/orders/order.types'
import { useOrderStore } from '../../store/useOrderStore'

function readOrders() {
  return useOrderStore.getState().orders as OrderRecord[]
}

function applyFilters(orders: OrderRecord[], filters?: OrderListFilters) {
  return orders.filter((order) => {
    if (filters?.customerId && order.customerId !== filters.customerId) {
      return false
    }

    if (filters?.status && order.status !== filters.status) {
      return false
    }

    return true
  })
}

export const mockOrderRepository: OrderRepository = {
  async listOrders(filters) {
    return applyFilters(readOrders(), filters)
  },
  async getOrderById(orderId) {
    return readOrders().find((order) => order.id === orderId)
  },
  async createOrder(order) {
    useOrderStore.getState().addOrder(order)
    return order
  },
  async createDraft(input: OrderCreateInput) {
    const createdAt = input.createdAt ?? new Date().toISOString()
    const order: OrderRecord = {
      id: input.id ?? `draft-${Date.now()}`,
      customer: input.customer,
      customerId: input.customerId,
      items: input.items,
      total: input.total ?? input.items.reduce((sum, item) => sum + item.pricing.total, 0),
      createdAt,
      status: input.status,
      paymentStatus: input.paymentStatus,
      source: input.source,
    }

    useOrderStore.getState().addOrder(order)
    return order
  },
}
