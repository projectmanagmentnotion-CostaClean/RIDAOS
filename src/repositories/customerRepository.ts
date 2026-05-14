import { runtimeConfig } from '../config/runtime'
import { useUserStore } from '../store/useUserStore'
import type { Customer } from '../types/backend'

export async function getCurrentCustomer(): Promise<Customer> {
  switch (runtimeConfig.dataMode) {
    case 'demo':
      return useUserStore.getState().customer
    case 'supabase':
      // Supabase-backed customer lookup will plug in here later.
      return useUserStore.getState().customer
  }
}

export async function saveCustomer(customer: Customer): Promise<Customer> {
  switch (runtimeConfig.dataMode) {
    case 'demo':
      useUserStore.getState().setCustomer(customer)
      return customer
    case 'supabase':
      // Supabase-backed customer save will plug in here later.
      useUserStore.getState().setCustomer(customer)
      return customer
  }
}
