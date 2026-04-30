import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { mockCustomer } from '../repositories/mockData'
import type { Customer } from '../types/backend'

type UserStore = {
  customer: Customer
  setCustomer: (customer: Customer) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      customer: mockCustomer,
      setCustomer: (customer) => set({ customer }),
    }),
    {
      name: 'ridaosprint-user',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
