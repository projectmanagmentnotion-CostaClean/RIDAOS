import { runtimeConfig } from '../config/runtime'
import { getCurrentCustomer, saveCustomer } from '../repositories/customerRepository'
import type { Customer } from '../types/backend'
import type { CustomerData } from '../types/ecommerce'

const wait = (delay = 120) => new Promise((resolve) => window.setTimeout(resolve, delay))

export async function getCustomerProfile() {
  switch (runtimeConfig.dataMode) {
    case 'demo':
      await wait()
      return getCurrentCustomer()
    case 'supabase':
      // Supabase-backed customer service will plug in here later.
      await wait()
      return getCurrentCustomer()
  }
}

export async function upsertCustomerProfile(input: CustomerData): Promise<Customer> {
  const current = await getCurrentCustomer()
  const nextCustomer: Customer = {
    ...current,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    updatedAt: new Date().toISOString(),
  }

  switch (runtimeConfig.dataMode) {
    case 'demo':
      await wait()
      return saveCustomer(nextCustomer)
    case 'supabase':
      // Supabase-backed customer service will plug in here later.
      await wait()
      return saveCustomer(nextCustomer)
  }
}
