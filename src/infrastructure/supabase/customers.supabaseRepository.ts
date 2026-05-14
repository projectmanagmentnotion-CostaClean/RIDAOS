import type { CustomerRepository } from '../../domain/customers/customer.repository'
import { assertSupabaseFeature } from './supabaseClient'

export const supabaseCustomerRepository: CustomerRepository = {
  async getCurrentCustomer() {
    return assertSupabaseFeature('customers.getCurrentCustomer')
  },
  async saveCustomer() {
    return assertSupabaseFeature('customers.saveCustomer')
  },
  async upsertCustomer() {
    return assertSupabaseFeature('customers.upsertCustomer')
  },
  async listCustomers() {
    return assertSupabaseFeature('customers.listCustomers')
  },
}
