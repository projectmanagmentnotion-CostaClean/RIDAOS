import type { UploadStorageRepository } from '../../../domain/storage/repositories/UploadStorageRepository'
import type { MockStorageFile } from '../../../domain/storage/storage.types'
import { mockArtworkRepository } from './mockArtworkRepository'

export const mockUploadStorageRepository: UploadStorageRepository = {
  async createLocalFileRecord(file) {
    return file
  },
  async getLocalFileRecord(fileId) {
    const records = await this.listLocalFileRecords()
    return records.find((record) => record.id === fileId)
  },
  async listLocalFileRecords() {
    const uploads = await mockArtworkRepository.listArtworkUploads()
    const records = uploads.map(
      (upload): MockStorageFile =>
        upload.storageFile ?? {
          id: `storage-${upload.id}`,
          fileName: upload.fileName,
          mimeType: upload.fileType,
          size: upload.fileSize,
          localObjectUrl: upload.preview?.objectUrl,
          createdAt: upload.uploadedAt,
        },
    )

    return records.sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  },
}
