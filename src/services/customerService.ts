import { getCustomerRepository } from '../infrastructure/repositoryFactory'
import type { Customer } from '../types/backend'
import type { CustomerData } from '../types/ecommerce'

const wait = (delay = 120) => new Promise((resolve) => window.setTimeout(resolve, delay))

export async function getCustomerProfile() {
  await wait()
  return getCustomerRepository().getCurrentCustomer()
}

export async function upsertCustomerProfile(input: CustomerData): Promise<Customer> {
  const repository = getCustomerRepository()
  const current = await repository.getCurrentCustomer()
  const nextCustomer: Customer = {
    ...current,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    updatedAt: new Date().toISOString(),
  }

  await wait()
  return repository.saveCustomer(nextCustomer)
}
