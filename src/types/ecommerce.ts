import type { Customer, Order, OrderItem } from './backend'

export type CartItem = OrderItem

export type CustomerData = Pick<Customer, 'name' | 'email' | 'phone'>

export type SimulatedOrder = Order
