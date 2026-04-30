import { runtimeConfig } from '../config/runtime'
import { useOrderStore } from '../store/useOrderStore'
import type { Order } from '../types/backend'

const readOrders = () => useOrderStore.getState().orders

export async function listOrders(): Promise<Order[]> {
  switch (runtimeConfig.backendMode) {
    case 'mock':
      return readOrders()
    case 'supabase':
      // Supabase-backed order listing will plug in here later.
      return readOrders()
  }
}

export async function createOrder(order: Order): Promise<Order> {
  switch (runtimeConfig.backendMode) {
    case 'mock':
      useOrderStore.getState().addOrder(order)
      return order
    case 'supabase':
      // Supabase-backed order creation will plug in here later.
      useOrderStore.getState().addOrder(order)
      return order
  }
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const orders = await listOrders()
  return orders.find((order) => order.id === orderId)
}
