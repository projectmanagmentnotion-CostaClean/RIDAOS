import type { Customer } from '../../types/backend'

export type CustomerRecord = Customer

export type CustomerSummary = Pick<CustomerRecord, 'id' | 'name' | 'email' | 'phone' | 'company' | 'updatedAt'>

export type CustomerUpsertInput = Pick<CustomerRecord, 'name' | 'email' | 'phone'> &
  Partial<Pick<CustomerRecord, 'id' | 'company' | 'createdAt' | 'updatedAt'>>
