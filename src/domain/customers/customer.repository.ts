import type { CustomerRecord, CustomerSummary, CustomerUpsertInput } from './customer.types'

export interface CustomerRepository {
  getCurrentCustomer(): Promise<CustomerRecord>
  saveCustomer(customer: CustomerRecord): Promise<CustomerRecord>
  upsertCustomer(input: CustomerUpsertInput): Promise<CustomerRecord>
  listCustomers(): Promise<CustomerSummary[]>
}
