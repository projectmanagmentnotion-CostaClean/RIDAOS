import type { ArtworkUpload } from '../../types/backend'

export type UploadRecord = ArtworkUpload

export type UploadListFilters = {
  orderId?: string
  customerId?: string
}
