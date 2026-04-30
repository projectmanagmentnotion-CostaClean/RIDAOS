import { runtimeConfig } from '../config/runtime'
import { createOrder, getOrderById, listOrders } from '../repositories/orderRepository'
import type { Order } from '../types/backend'
import type { CartItem, CustomerData } from '../types/ecommerce'

const wait = (delay = 160) => new Promise((resolve) => window.setTimeout(resolve, delay))

function buildOrderId() {
  return `RP-${Date.now()}`
}

export async function listOrderHistory() {
  switch (runtimeConfig.backendMode) {
    case 'mock':
      await wait()
      return listOrders()
    case 'supabase':
      // Supabase-backed order history will plug in here later.
      await wait()
      return listOrders()
  }
}

export async function getOrderDetail(orderId: string) {
  switch (runtimeConfig.backendMode) {
    case 'mock':
      await wait()
      return getOrderById(orderId)
    case 'supabase':
      // Supabase-backed order detail will plug in here later.
      await wait()
      return getOrderById(orderId)
  }
}

export async function submitOrder(input: {
  customer: CustomerData
  customerId: string
  items: CartItem[]
}): Promise<Order> {
  const createdAt = new Date().toISOString()
  const orderId = buildOrderId()
  const total = input.items.reduce((sum, item) => sum + item.pricing.total, 0)

  const order: Order = {
    id: orderId,
    customerId: input.customerId,
    customer: {
      id: input.customerId,
      name: input.customer.name.trim(),
      email: input.customer.email.trim(),
      phone: input.customer.phone.trim(),
      company: input.customer.name.trim(),
      createdAt,
      updatedAt: createdAt,
    },
    items: input.items.map((item) => ({
      ...item,
      artwork: {
        ...item.artwork,
        orderId,
        status: 'pending_review',
      },
    })),
    total,
    createdAt,
    status: 'pending_review',
    paymentStatus: 'disabled',
    source: 'mock_frontend',
  }

  switch (runtimeConfig.backendMode) {
    case 'mock':
      await wait()
      return createOrder(order)
    case 'supabase':
      // Supabase-backed order submission will plug in here later.
      await wait()
      return createOrder(order)
  }
}
