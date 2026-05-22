export type ArtworkValidationState = 'ready' | 'warning' | 'needs_review' | 'blocked'

export type ArtworkOrientation = 'portrait' | 'landscape' | 'square' | 'free'

export type ArtworkProductRuleKey =
  | 'business_cards'
  | 'stickers'
  | 'dtf_meter'
  | 'printed_vinyl'
  | 'signage'
  | 'textile'
  | 'paper'

export type ArtworkUploadStatus =
  | 'pending_review'
  | 'approved'
  | 'needs_changes'
  | 'awaiting_payment'
  | 'paid'
  | 'in_production'
  | 'quality_check'
  | 'ready'
  | 'completed'
  | 'cancelled'

export type ArtworkValidationCheck = {
  id: string
  label: string
  status: ArtworkValidationState
  message: string
}

export type ArtworkRecommendation = {
  id: string
  message: string
  tone: 'info' | 'warning' | 'critical'
}

export type ArtworkGuide = {
  bleedMm: number
  safeMarginMm: number
  innerMarginMm: number
  showCutline: boolean
  showSafeZone: boolean
  showBleedZone: boolean
  previewMode: 'sheet' | 'roll' | 'vinyl'
  preferredOrientation: ArtworkOrientation
  aspectRatio: number
}

export type ArtworkProductRule = {
  key: ArtworkProductRuleKey
  label: string
  acceptedFormats: string[]
  maxFileSizeMb: number
  recommendedMinResolutionDpi: number
  recommendedPhysicalSizeLabel: string
  guide: ArtworkGuide
  helperCopy: string
  recommendations: string[]
}

export type PreviewAsset = {
  id: string
  uploadId: string
  kind: 'client_preview' | 'print_preview' | 'admin_preview'
  src?: string
  widthPx?: number
  heightPx?: number
  orientation: ArtworkOrientation
  generatedAt: string
}

export type UploadAsset = {
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
}

export type MockStorageFile = {
  id: string
  fileName: string
  mimeType: string
  size: number
  localObjectUrl?: string
  createdAt: string
}

export type ArtworkValidationResult = {
  ruleKey: ArtworkProductRuleKey
  workflowStatus: ArtworkValidationState
  orientation: ArtworkOrientation
  fileName: string
  formatLabel: string
  fileSizeLabel: string
  estimatedPhysicalSizeLabel: string
  checks: ArtworkValidationCheck[]
  recommendations: ArtworkRecommendation[]
}

export type ArtworkPreview = {
  id?: string
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

export type ArtworkReview = {
  id?: string
  uploadId: string
  reviewStatus: 'pending' | 'approved' | 'needs_fix' | 'reuploaded'
  validation: ArtworkValidationResult | null
  checklist: string[]
  reviewerNotes?: string
  customerNotes?: string
  updatedAt: string
}

export type ProductTemplateAsset = {
  id: string
  productRuleKey: ArtworkProductRuleKey
  label: string
  fileName: string
  kind: 'guide_overlay' | 'storytelling_asset' | 'downloadable_template'
  recommendedFormat: 'png' | 'webp' | 'pdf' | 'svg'
  transparentBackground: boolean
  orientation: 'portrait' | 'landscape' | 'square'
  recommendedSize: string
  priority: 'high' | 'medium' | 'low'
}

export type ArtworkUploadRecord = UploadAsset & {
  storageFile?: MockStorageFile
  preview?: ArtworkPreview
  previewSummary?: ArtworkValidationResult
}

export type ArtworkPreviewSummary = ArtworkValidationResult

export type ArtworkStorageLifecycle =
  | 'selected_locally'
  | 'validated_locally'
  | 'ready_for_mock_review'
  | 'approved_for_storage'

export type ArtworkStorageEntitySnapshot = {
  upload: ArtworkUploadRecord
  review: ArtworkReview | null
  previewAsset: PreviewAsset | null
}
