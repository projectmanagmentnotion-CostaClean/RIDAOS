import type { UploadStorageRepository } from '../../../domain/storage/repositories/UploadStorageRepository'
import { assertSupabaseFeature } from '../../supabase/supabaseClient'

export const futureSupabaseUploadStorageRepository: UploadStorageRepository = {
  async createLocalFileRecord() {
    return assertSupabaseFeature('storage.uploads.createLocalFileRecord')
  },
  async getLocalFileRecord() {
    return assertSupabaseFeature('storage.uploads.getLocalFileRecord')
  },
  async listLocalFileRecords() {
    return assertSupabaseFeature('storage.uploads.listLocalFileRecords')
  },
}
