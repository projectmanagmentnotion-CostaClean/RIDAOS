import type { ArtworkUploadRecord } from '../storage.types'

export type ArtworkListFilters = {
  orderId?: string
  customerId?: string
}

export interface ArtworkRepository {
  listArtworkUploads(filters?: ArtworkListFilters): Promise<ArtworkUploadRecord[]>
  getArtworkUploadByOrderId(orderId: string): Promise<ArtworkUploadRecord | undefined>
  saveArtworkUpload(upload: ArtworkUploadRecord): Promise<ArtworkUploadRecord>
}
