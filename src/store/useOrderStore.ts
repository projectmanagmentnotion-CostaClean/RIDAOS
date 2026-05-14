import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { demoOrders } from '../repositories/demoData'
import type { Order } from '../types/backend'

type OrderStore = {
  orders: Order[]
  addOrder: (order: Order) => void
  setOrders: (orders: Order[]) => void
  updateOrder: (orderId: string, updater: (order: Order) => Order) => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: demoOrders,
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      setOrders: (orders) => set({ orders }),
      updateOrder: (orderId, updater) =>
        set((state) => ({
          orders: state.orders.map((order) => (order.id === orderId ? updater(order) : order)),
        })),
    }),
    {
      name: 'ridaosprint-orders',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
