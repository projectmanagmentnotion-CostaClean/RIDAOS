import type { ArtworkOrientation, ArtworkUploadStatus } from '../storage.types'

export type UploadStorageDto = {
  id: string
  itemId: string
  orderId?: string
  fileName: string
  fileType: string
  fileSize: number
  formatLabel: string
  status: ArtworkUploadStatus
  uploadedAt: string
  notes?: string
  previewObjectUrl?: string
  widthPx?: number
  heightPx?: number
  orientation?: ArtworkOrientation
}

export type ArtworkPreviewDto = {
  uploadId: string
  fileName: string
  fileType: string
  fileSize: number
  fileSizeLabel: string
  formatLabel: string
  objectUrl?: string
  canPreview: boolean
  widthPx?: number
  heightPx?: number
  orientation: ArtworkOrientation
}
