import type { ArtworkPreview, ArtworkUploadRecord } from '../storage.types'
import type { ArtworkPreviewDto, UploadStorageDto } from '../dto'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readOptionalNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function readOptionalString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined
}

export function parseUploadStorageDto(input: unknown): UploadStorageDto | null {
  if (!isRecord(input)) {
    return null
  }

  const dto: UploadStorageDto = {
    id: typeof input.id === 'string' ? input.id : '',
    itemId: typeof input.itemId === 'string' ? input.itemId : '',
    orderId: readOptionalString(input.orderId),
    fileName: typeof input.fileName === 'string' ? input.fileName : '',
    fileType: typeof input.fileType === 'string' ? input.fileType : '',
    fileSize: typeof input.fileSize === 'number' ? input.fileSize : Number.NaN,
    formatLabel: typeof input.formatLabel === 'string' ? input.formatLabel : '',
    status: (typeof input.status === 'string' ? input.status : '') as UploadStorageDto['status'],
    uploadedAt: typeof input.uploadedAt === 'string' ? input.uploadedAt : '',
    notes: readOptionalString(input.notes),
    previewObjectUrl: readOptionalString(input.previewObjectUrl),
    widthPx: readOptionalNumber(input.widthPx),
    heightPx: readOptionalNumber(input.heightPx),
    orientation:
      input.orientation === 'portrait' ||
      input.orientation === 'landscape' ||
      input.orientation === 'square' ||
      input.orientation === 'free'
        ? input.orientation
        : undefined,
  }

  if (
    !dto.id ||
    !dto.itemId ||
    !dto.fileName ||
    !dto.fileType ||
    !Number.isFinite(dto.fileSize) ||
    !dto.formatLabel ||
    !dto.status ||
    !dto.uploadedAt
  ) {
    return null
  }

  return dto
}

export function parseArtworkPreviewDto(input: unknown): ArtworkPreviewDto | null {
  if (!isRecord(input)) {
    return null
  }

  const orientation =
    input.orientation === 'portrait' ||
    input.orientation === 'landscape' ||
    input.orientation === 'square' ||
    input.orientation === 'free'
      ? input.orientation
      : 'free'

  const dto: ArtworkPreviewDto = {
    uploadId: typeof input.uploadId === 'string' ? input.uploadId : '',
    fileName: typeof input.fileName === 'string' ? input.fileName : '',
    fileType: typeof input.fileType === 'string' ? input.fileType : '',
    fileSize: typeof input.fileSize === 'number' ? input.fileSize : Number.NaN,
    fileSizeLabel: typeof input.fileSizeLabel === 'string' ? input.fileSizeLabel : '',
    formatLabel: typeof input.formatLabel === 'string' ? input.formatLabel : '',
    objectUrl: readOptionalString(input.objectUrl),
    canPreview: typeof input.canPreview === 'boolean' ? input.canPreview : false,
    widthPx: readOptionalNumber(input.widthPx),
    heightPx: readOptionalNumber(input.heightPx),
    orientation,
  }

  if (!dto.uploadId || !dto.fileName || !dto.fileType || !Number.isFinite(dto.fileSize) || !dto.fileSizeLabel || !dto.formatLabel) {
    return null
  }

  return dto
}

export function toArtworkPreviewFromDto(dto: ArtworkPreviewDto): ArtworkPreview {
  return {
    id: `preview-${dto.uploadId}`,
    fileName: dto.fileName,
    fileType: dto.fileType,
    fileSize: dto.fileSize,
    fileSizeLabel: dto.fileSizeLabel,
    formatLabel: dto.formatLabel,
    objectUrl: dto.objectUrl,
    canPreview: dto.canPreview,
    widthPx: dto.widthPx,
    heightPx: dto.heightPx,
    orientation: dto.orientation,
  }
}

export function normalizeArtworkUploadRecord(input: unknown): ArtworkUploadRecord | null {
  const uploadDto = parseUploadStorageDto(input)
  if (!uploadDto) {
    return null
  }

  const previewInput =
    isRecord(input) && isRecord(input.preview)
      ? {
          uploadId: uploadDto.id,
          ...input.preview,
        }
      : uploadDto.previewObjectUrl
        ? {
            uploadId: uploadDto.id,
            fileName: uploadDto.fileName,
            fileType: uploadDto.fileType,
            fileSize: uploadDto.fileSize,
            fileSizeLabel: `${Math.max(uploadDto.fileSize / 1024, 0.1).toFixed(1)} KB`,
            formatLabel: uploadDto.formatLabel,
            objectUrl: uploadDto.previewObjectUrl,
            canPreview: true,
            widthPx: uploadDto.widthPx,
            heightPx: uploadDto.heightPx,
            orientation: uploadDto.orientation ?? 'free',
          }
        : null

  const previewDto = previewInput ? parseArtworkPreviewDto(previewInput) : null

  return {
    ...uploadDto,
    preview: previewDto ? toArtworkPreviewFromDto(previewDto) : undefined,
  }
}
