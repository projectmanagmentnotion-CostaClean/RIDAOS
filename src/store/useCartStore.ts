import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CartItem } from '../types/ecommerce'

type CartStore = {
  items: CartItem[]
  couponCode: string
  shippingMethod: string
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  setCouponCode: (code: string) => void
  setShippingMethod: (method: string) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      shippingMethod: 'pickup',
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, lineQuantity: item.lineQuantity ?? 1 }],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateItemQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  lineQuantity: Math.max(1, Math.round(quantity)),
                }
              : item,
          ),
        })),
      setCouponCode: (code) => set({ couponCode: code }),
      setShippingMethod: (method) => set({ shippingMethod: method }),
      clearCart: () => set({ items: [], couponCode: '', shippingMethod: 'pickup' }),
      getTotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.pricing.total * (item.lineQuantity ?? 1),
          0,
        ),
    }),
    {
      name: 'ridaosprint-cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
