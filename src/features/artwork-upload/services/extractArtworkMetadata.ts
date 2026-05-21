import type { ArtworkOrientation, ArtworkPreviewMetadata } from '../types/artworkUpload'

const previewableTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']

function formatFileSize(file: File) {
  if (file.size < 1024 * 1024) {
    return `${Math.max(file.size / 1024, 0.1).toFixed(1)} KB`
  }

  return `${(file.size / (1024 * 1024)).toFixed(2)} MB`
}

function detectFormatLabel(file: File) {
  const extension = file.name.split('.').pop()?.toUpperCase()
  if (extension) {
    return extension
  }

  return file.type ? file.type.toUpperCase() : 'DESCONOCIDO'
}

function detectOrientation(width?: number, height?: number): ArtworkOrientation {
  if (!width || !height) {
    return 'free'
  }

  if (Math.abs(width - height) < 10) {
    return 'square'
  }

  return width > height ? 'landscape' : 'portrait'
}

function loadImageDimensions(url: string) {
  return new Promise<{ width: number; height: number } | null>((resolve) => {
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => resolve(null)
    image.src = url
  })
}

export async function extractArtworkMetadata(file: File): Promise<ArtworkPreviewMetadata> {
  const canPreview = previewableTypes.includes(file.type)
  const objectUrl = canPreview ? URL.createObjectURL(file) : undefined
  const dimensions = objectUrl ? await loadImageDimensions(objectUrl) : null

  return {
    fileName: file.name,
    fileType: file.type || 'application/octet-stream',
    fileSize: file.size,
    fileSizeLabel: formatFileSize(file),
    formatLabel: detectFormatLabel(file),
    objectUrl,
    canPreview,
    widthPx: dimensions?.width,
    heightPx: dimensions?.height,
    orientation: detectOrientation(dimensions?.width, dimensions?.height),
  }
}
