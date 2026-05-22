import type { ArtworkRepository } from '../storage/repositories/ArtworkRepository'
import type { UploadListFilters, UploadRecord } from './upload.types'

export interface UploadRepository {
  listUploads(filters?: UploadListFilters): Promise<UploadRecord[]>
  getUploadByOrderId(orderId: string): Promise<UploadRecord | undefined>
  saveUpload(upload: UploadRecord): Promise<UploadRecord>
}

export type LegacyUploadRepositoryBridge = ArtworkRepository
