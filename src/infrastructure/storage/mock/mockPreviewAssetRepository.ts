import type { PreviewAssetRepository } from '../../../domain/storage/repositories/PreviewAssetRepository'
import { toPreviewAsset } from '../../../domain/storage/mappers'
import { mockArtworkRepository } from './mockArtworkRepository'

export const mockPreviewAssetRepository: PreviewAssetRepository = {
  async listPreviewAssets(filters) {
    const uploads = await mockArtworkRepository.listArtworkUploads()
    return uploads
      .filter((upload) => (filters?.uploadId ? upload.id === filters.uploadId : true))
      .map((upload) => toPreviewAsset(upload, filters?.kind ?? 'admin_preview'))
      .filter((asset) => asset !== null)
  },
  async getPreviewAssetByUploadId(uploadId) {
    const uploads = await mockArtworkRepository.listArtworkUploads()
    const upload = uploads.find((candidate) => candidate.id === uploadId)
    return upload ? toPreviewAsset(upload) ?? undefined : undefined
  },
  async savePreviewAsset(asset) {
    return asset
  },
}
