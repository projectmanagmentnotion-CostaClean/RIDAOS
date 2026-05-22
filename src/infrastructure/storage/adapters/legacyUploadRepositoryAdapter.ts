import type { UploadRepository } from '../../../domain/uploads/upload.repository'
import type { ArtworkRepository } from '../../../domain/storage/repositories/ArtworkRepository'

export function createLegacyUploadRepositoryAdapter(artworkRepository: ArtworkRepository): UploadRepository {
  return {
    async listUploads(filters) {
      return artworkRepository.listArtworkUploads(filters)
    },
    async getUploadByOrderId(orderId) {
      return artworkRepository.getArtworkUploadByOrderId(orderId)
    },
    async saveUpload(upload) {
      return artworkRepository.saveArtworkUpload(upload)
    },
  }
}
