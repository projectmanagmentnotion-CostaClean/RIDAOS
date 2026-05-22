import type { PreviewAssetRepository } from '../../../domain/storage/repositories/PreviewAssetRepository'
import { assertSupabaseFeature } from '../../supabase/supabaseClient'

export const futureSupabasePreviewAssetRepository: PreviewAssetRepository = {
  async listPreviewAssets() {
    return assertSupabaseFeature('storage.preview.listPreviewAssets')
  },
  async getPreviewAssetByUploadId() {
    return assertSupabaseFeature('storage.preview.getPreviewAssetByUploadId')
  },
  async savePreviewAsset() {
    return assertSupabaseFeature('storage.preview.savePreviewAsset')
  },
}
