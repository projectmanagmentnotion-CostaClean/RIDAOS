import type { ArtworkRepository } from '../../../domain/storage/repositories/ArtworkRepository'
import { assertSupabaseFeature } from '../../supabase/supabaseClient'

export const futureSupabaseArtworkRepository: ArtworkRepository = {
  async listArtworkUploads() {
    return assertSupabaseFeature('storage.artwork.listArtworkUploads')
  },
  async getArtworkUploadByOrderId() {
    return assertSupabaseFeature('storage.artwork.getArtworkUploadByOrderId')
  },
  async saveArtworkUpload() {
    return assertSupabaseFeature('storage.artwork.saveArtworkUpload')
  },
}
