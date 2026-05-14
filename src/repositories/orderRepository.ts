import { getOrderRepository } from '../infrastructure/repositoryFactory'
import type { Order } from '../types/backend'

export async function listOrders(): Promise<Order[]> {
  return getOrderRepository().listOrders()
}

export async function createOrder(order: Order): Promise<Order> {
  return getOrderRepository().createOrder(order)
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  return getOrderRepository().getOrderById(orderId)
}
