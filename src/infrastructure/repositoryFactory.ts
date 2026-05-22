import type { AdminRepository } from '../domain/admin/admin.repository'
import type { AuthRepository } from '../domain/auth/auth.repository'
import type { CustomerRepository } from '../domain/customers/customer.repository'
import type { OrderRepository } from '../domain/orders/order.repository'
import type { ArtworkReviewRepository } from '../domain/storage/repositories/ArtworkReviewRepository'
import type { ArtworkRepository } from '../domain/storage/repositories/ArtworkRepository'
import type { PreviewAssetRepository } from '../domain/storage/repositories/PreviewAssetRepository'
import type { ProductTemplateRepository } from '../domain/storage/repositories/ProductTemplateRepository'
import type { UploadStorageRepository } from '../domain/storage/repositories/UploadStorageRepository'
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
import { mockArtworkReviewRepository } from './storage/mock/mockArtworkReviewRepository'
import { mockArtworkRepository } from './storage/mock/mockArtworkRepository'
import { mockPreviewAssetRepository } from './storage/mock/mockPreviewAssetRepository'
import { mockProductTemplateRepository } from './storage/mock/mockProductTemplateRepository'
import { mockUploadStorageRepository } from './storage/mock/mockUploadStorageRepository'
import { futureSupabaseArtworkReviewRepository } from './storage/future-supabase/futureSupabaseArtworkReviewRepository'
import { futureSupabaseArtworkRepository } from './storage/future-supabase/futureSupabaseArtworkRepository'
import { futureSupabasePreviewAssetRepository } from './storage/future-supabase/futureSupabasePreviewAssetRepository'
import { futureSupabaseProductTemplateRepository } from './storage/future-supabase/futureSupabaseProductTemplateRepository'
import { futureSupabaseUploadStorageRepository } from './storage/future-supabase/futureSupabaseUploadStorageRepository'

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

export function getArtworkRepository(): ArtworkRepository {
  return resolveRepository(runtimeConfig.dataMode, {
    mock: mockArtworkRepository,
    supabase: futureSupabaseArtworkRepository,
  })
}

export function getUploadStorageRepository(): UploadStorageRepository {
  return resolveRepository(runtimeConfig.dataMode, {
    mock: mockUploadStorageRepository,
    supabase: futureSupabaseUploadStorageRepository,
  })
}

export function getPreviewAssetRepository(): PreviewAssetRepository {
  return resolveRepository(runtimeConfig.dataMode, {
    mock: mockPreviewAssetRepository,
    supabase: futureSupabasePreviewAssetRepository,
  })
}

export function getProductTemplateRepository(): ProductTemplateRepository {
  return resolveRepository(runtimeConfig.dataMode, {
    mock: mockProductTemplateRepository,
    supabase: futureSupabaseProductTemplateRepository,
  })
}

export function getArtworkReviewRepository(): ArtworkReviewRepository {
  return resolveRepository(runtimeConfig.dataMode, {
    mock: mockArtworkReviewRepository,
    supabase: futureSupabaseArtworkReviewRepository,
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
