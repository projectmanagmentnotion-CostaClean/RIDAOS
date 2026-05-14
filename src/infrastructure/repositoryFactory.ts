import type { AdminRepository } from '../domain/admin/admin.repository'
import type { AuthRepository } from '../domain/auth/auth.repository'
import type { CustomerRepository } from '../domain/customers/customer.repository'
import type { OrderRepository } from '../domain/orders/order.repository'
import type { UploadRepository } from '../domain/uploads/upload.repository'
import { runtimeConfig } from '../config/runtime'
import { mockAdminRepository } from './mock/admin.mockRepository'
import { mockAuthRepository } from './mock/auth.mockRepository'
import { mockCustomerRepository } from './mock/customers.mockRepository'
import { mockOrderRepository } from './mock/orders.mockRepository'
import { mockUploadRepository } from './mock/uploads.mockRepository'
import { supabaseAdminRepository } from './supabase/admin.supabaseRepository'
import { supabaseAuthRepository } from './supabase/auth.supabaseRepository'
import { supabaseCustomerRepository } from './supabase/customers.supabaseRepository'
import { supabaseOrderRepository } from './supabase/orders.supabaseRepository'
import { supabaseUploadRepository } from './supabase/uploads.supabaseRepository'

function resolveRepository<T>(mode: 'mock' | 'supabase', implementations: Record<'mock' | 'supabase', T>) {
  return implementations[mode]
}

export function getCustomerRepository(): CustomerRepository {
  return resolveRepository(runtimeConfig.dataMode, {
    mock: mockCustomerRepository,
    supabase: supabaseCustomerRepository,
  })
}

export function getOrderRepository(): OrderRepository {
  return resolveRepository(runtimeConfig.dataMode, {
    mock: mockOrderRepository,
    supabase: supabaseOrderRepository,
  })
}

export function getUploadRepository(): UploadRepository {
  return resolveRepository(runtimeConfig.dataMode, {
    mock: mockUploadRepository,
    supabase: supabaseUploadRepository,
  })
}

export function getAuthRepository(): AuthRepository {
  const mode = runtimeConfig.authMode === 'supabase' ? 'supabase' : 'mock'
  return resolveRepository(mode, {
    mock: mockAuthRepository,
    supabase: supabaseAuthRepository,
  })
}

export function getAdminRepository(): AdminRepository {
  return resolveRepository(runtimeConfig.adminMode, {
    mock: mockAdminRepository,
    supabase: supabaseAdminRepository,
  })
}
