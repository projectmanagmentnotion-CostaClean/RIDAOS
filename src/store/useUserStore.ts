import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { demoCustomer } from '../repositories/demoData'
import type { Customer } from '../types/backend'

type UserStore = {
  customer: Customer
  setCustomer: (customer: Customer) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      customer: demoCustomer,
      setCustomer: (customer) => set({ customer }),
    }),
    {
      name: 'ridaosprint-user',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
