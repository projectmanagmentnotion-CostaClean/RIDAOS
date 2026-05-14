import type { CustomerRepository } from '../../domain/customers/customer.repository'
import type {
  CustomerRecord,
  CustomerSummary,
  CustomerUpsertInput,
} from '../../domain/customers/customer.types'
import { useOrderStore } from '../../store/useOrderStore'
import { useUserStore } from '../../store/useUserStore'

function readCurrentCustomer() {
  return useUserStore.getState().customer
}

function deriveCustomerSummaries(): CustomerSummary[] {
  const current = readCurrentCustomer()
  const orders = useOrderStore.getState().orders
  const customers = new Map<string, CustomerSummary>([
    [
      current.id,
      {
        id: current.id,
        name: current.name,
        email: current.email,
        phone: current.phone,
        company: current.company,
        updatedAt: current.updatedAt,
      },
    ],
  ])

  for (const order of orders) {
    customers.set(order.customer.id, {
      id: order.customer.id,
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      company: order.customer.company,
      updatedAt: order.customer.updatedAt,
    })
  }

  return Array.from(customers.values()).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
}

export const mockCustomerRepository: CustomerRepository = {
  async getCurrentCustomer() {
    return readCurrentCustomer()
  },
  async saveCustomer(customer: CustomerRecord) {
    useUserStore.getState().setCustomer(customer)
    return customer
  },
  async upsertCustomer(input: CustomerUpsertInput) {
    const current = readCurrentCustomer()
    const timestamp = new Date().toISOString()
    const nextCustomer: CustomerRecord = {
      ...current,
      ...input,
      id: input.id ?? current.id,
      company: input.company ?? input.name.trim(),
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      createdAt: input.createdAt ?? current.createdAt ?? timestamp,
      updatedAt: input.updatedAt ?? timestamp,
    }

    useUserStore.getState().setCustomer(nextCustomer)
    return nextCustomer
  },
  async listCustomers() {
    return deriveCustomerSummaries()
  },
}
