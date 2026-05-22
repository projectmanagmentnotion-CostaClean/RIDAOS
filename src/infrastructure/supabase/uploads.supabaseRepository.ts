import { createLegacyUploadRepositoryAdapter } from '../storage/adapters/legacyUploadRepositoryAdapter'
import { futureSupabaseArtworkRepository } from '../storage/future-supabase/futureSupabaseArtworkRepository'

export const supabaseUploadRepository = createLegacyUploadRepositoryAdapter(futureSupabaseArtworkRepository)
