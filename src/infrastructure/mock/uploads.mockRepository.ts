import type { UploadRepository } from '../../domain/uploads/upload.repository'
import type { UploadListFilters, UploadRecord } from '../../domain/uploads/upload.types'
import { mockOrderRepository } from './orders.mockRepository'

function flattenUploads(uploads: UploadRecord[]) {
  return uploads.sort((left, right) => right.uploadedAt.localeCompare(left.uploadedAt))
}

function applyFilters(uploads: UploadRecord[], filters?: UploadListFilters) {
  return uploads.filter((upload) => {
    if (filters?.orderId && upload.orderId !== filters.orderId) {
      return false
    }

    return true
  })
}

export const mockUploadRepository: UploadRepository = {
  async listUploads(filters) {
    const orders = await mockOrderRepository.listOrders()
    const uploads = flattenUploads(orders.flatMap((order) => order.items.map((item) => item.artwork)))
    return applyFilters(uploads, filters)
  },
  async getUploadByOrderId(orderId) {
    const uploads = await this.listUploads({ orderId })
    return uploads.find((upload) => upload.orderId === orderId)
  },
  async saveUpload(upload) {
    return upload
  },
}
