import type { AdminUploadReviewStatus } from '../types/adminModels'

type UploadStatusConfig = {
  label: string
  colorClass: string
}

export const uploadReviewStatusConfig: Record<AdminUploadReviewStatus, UploadStatusConfig> = {
  pending: { label: 'Pendiente', colorClass: 'warning' },
  approved: { label: 'Aprobado', colorClass: 'success' },
  needs_fix: { label: 'Necesita correccion', colorClass: 'danger' },
  reuploaded: { label: 'Reenviado', colorClass: 'info' },
}

export const uploadReviewStatusOptions = Object.entries(uploadReviewStatusConfig).map(
  ([value, config]) => ({
    value: value as AdminUploadReviewStatus,
    ...config,
  }),
)
