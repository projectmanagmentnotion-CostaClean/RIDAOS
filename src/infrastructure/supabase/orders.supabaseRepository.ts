import type { OrderRepository } from '../../domain/orders/order.repository'
import { assertSupabaseFeature } from './supabaseClient'

export const supabaseOrderRepository: OrderRepository = {
  async listOrders() {
    return assertSupabaseFeature('orders.listOrders')
  },
  async getOrderById() {
    return assertSupabaseFeature('orders.getOrderById')
  },
  async createOrder() {
    return assertSupabaseFeature('orders.createOrder')
  },
  async createDraft() {
    return assertSupabaseFeature('orders.createDraft')
  },
}
