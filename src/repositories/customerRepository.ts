import { getCustomerRepository } from '../infrastructure/repositoryFactory'
import type { Customer } from '../types/backend'

export async function getCurrentCustomer(): Promise<Customer> {
  return getCustomerRepository().getCurrentCustomer()
}

export async function saveCustomer(customer: Customer): Promise<Customer> {
  return getCustomerRepository().saveCustomer(customer)
}
