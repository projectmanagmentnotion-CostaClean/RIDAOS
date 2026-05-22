import type { ArtworkPreviewDto, UploadStorageDto } from '../dto'
import type { ArtworkPreview, ArtworkReview, ArtworkUploadRecord, MockStorageFile, PreviewAsset } from '../storage.types'

function buildPreview(upload: ArtworkUploadRecord): ArtworkPreview | undefined {
  if (upload.preview) {
    return upload.preview
  }

  if (!upload.storageFile?.localObjectUrl) {
    return undefined
  }

  return {
    id: `preview-${upload.id}`,
    fileName: upload.fileName,
    fileType: upload.fileType,
    fileSize: upload.fileSize,
    fileSizeLabel: `${Math.max(upload.fileSize / 1024, 0.1).toFixed(1)} KB`,
    formatLabel: upload.formatLabel,
    objectUrl: upload.storageFile.localObjectUrl,
    canPreview: true,
    orientation: 'free',
  }
}

export function toUploadStorageDto(upload: ArtworkUploadRecord): UploadStorageDto {
  return {
    id: upload.id,
    itemId: upload.itemId,
    orderId: upload.orderId,
    fileName: upload.fileName,
    fileType: upload.fileType,
    fileSize: upload.fileSize,
    formatLabel: upload.formatLabel,
    status: upload.status,
    uploadedAt: upload.uploadedAt,
    notes: upload.notes,
    previewObjectUrl: upload.preview?.objectUrl ?? upload.storageFile?.localObjectUrl,
    widthPx: upload.preview?.widthPx,
    heightPx: upload.preview?.heightPx,
    orientation: upload.preview?.orientation,
  }
}

export function toArtworkPreviewDto(upload: ArtworkUploadRecord): ArtworkPreviewDto | null {
  const preview = buildPreview(upload)
  if (!preview) {
    return null
  }

  return {
    uploadId: upload.id,
    fileName: preview.fileName,
    fileType: preview.fileType,
    fileSize: preview.fileSize,
    fileSizeLabel: preview.fileSizeLabel,
    formatLabel: preview.formatLabel,
    objectUrl: preview.objectUrl,
    canPreview: preview.canPreview,
    widthPx: preview.widthPx,
    heightPx: preview.heightPx,
    orientation: preview.orientation,
  }
}

export function toMockStorageFile(upload: ArtworkUploadRecord): MockStorageFile {
  return {
    id: `storage-${upload.id}`,
    fileName: upload.fileName,
    mimeType: upload.fileType,
    size: upload.fileSize,
    localObjectUrl: upload.preview?.objectUrl,
    createdAt: upload.uploadedAt,
  }
}

export function toPreviewAsset(
  upload: ArtworkUploadRecord,
  kind: PreviewAsset['kind'] = 'admin_preview',
): PreviewAsset | null {
  const preview = buildPreview(upload)
  if (!preview) {
    return null
  }

  return {
    id: `${kind}-${upload.id}`,
    uploadId: upload.id,
    kind,
    src: preview.objectUrl,
    widthPx: preview.widthPx,
    heightPx: preview.heightPx,
    orientation: preview.orientation,
    generatedAt: upload.uploadedAt,
  }
}

export function toArtworkReview(upload: ArtworkUploadRecord): ArtworkReview {
  return {
    id: `review-${upload.id}`,
    uploadId: upload.id,
    reviewStatus:
      upload.status === 'approved'
        ? 'approved'
        : upload.status === 'needs_changes'
          ? 'needs_fix'
          : 'pending',
    validation: upload.previewSummary ?? null,
    checklist: [
      'Formato y metadata consolidados en storage contract.',
      'Resumen de preview preparado para admin y cliente.',
      'Estado listo para migrar a storage real sin tocar UI.',
    ],
    updatedAt: upload.uploadedAt,
  }
}
