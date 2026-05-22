import type { ArtworkRepository } from '../../../domain/storage/repositories/ArtworkRepository'
import type { ArtworkUploadRecord } from '../../../domain/storage/storage.types'
import { toMockStorageFile } from '../../../domain/storage/mappers'
import { normalizeArtworkValidationResult } from '../../../domain/storage/validation'
import { mockOrderRepository } from '../../mock/orders.mockRepository'

function enrichUpload(upload: ArtworkUploadRecord): ArtworkUploadRecord {
  return {
    ...upload,
    storageFile: upload.storageFile ?? toMockStorageFile(upload),
    previewSummary: normalizeArtworkValidationResult(upload.previewSummary) ?? upload.previewSummary,
  }
}

export const mockArtworkRepository: ArtworkRepository = {
  async listArtworkUploads(filters) {
    const orders = await mockOrderRepository.listOrders()
    const uploads = orders
      .filter((order) => (filters?.customerId ? order.customerId === filters.customerId : true))
      .flatMap((order) =>
        order.items
          .filter(() => (filters?.orderId ? order.id === filters.orderId : true))
          .map((item) => enrichUpload(item.artwork as ArtworkUploadRecord)),
      )

    return uploads.sort((left, right) => right.uploadedAt.localeCompare(left.uploadedAt))
  },
  async getArtworkUploadByOrderId(orderId) {
    const uploads = await this.listArtworkUploads({ orderId })
    return uploads.find((upload) => upload.orderId === orderId)
  },
  async saveArtworkUpload(upload) {
    return enrichUpload(upload)
  },
}
