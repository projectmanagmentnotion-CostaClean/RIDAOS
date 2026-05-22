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

export type PrepressCheckStatus = 'pass' | 'warning' | 'fail' | 'info'

export type PrepressCheckSeverity = 'low' | 'medium' | 'high' | 'critical'

export type PrepressReadinessState = 'print_ready' | 'minor_warnings' | 'needs_review' | 'blocked'

export type PrepressCheckDefinition = {
  id:
    | 'file_format_check'
    | 'file_size_check'
    | 'dpi_check'
    | 'bleed_check'
    | 'safe_area_check'
    | 'cutline_check'
    | 'vector_check'
    | 'color_mode_check'
    | 'transparency_check'
    | 'font_outline_check'
    | 'layer_structure_check'
    | 'scale_check'
    | 'orientation_check'
    | 'dtf_spacing_check'
    | 'sticker_contour_check'
    | 'card_trim_check'
    | 'vinyl_panel_check'
  status: PrepressCheckStatus
  severity: PrepressCheckSeverity
  title: string
  description: string
  recommendation: string
  productApplicability: ArtworkProductRuleKey[]
  productionImpact: string
  blocking: boolean
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
  readinessScore: number
  readinessState: PrepressReadinessState
  orientation: ArtworkOrientation
  fileName: string
  formatLabel: string
  fileSizeLabel: string
  estimatedPhysicalSizeLabel: string
  checks: ArtworkValidationCheck[]
  advancedChecks: PrepressCheckDefinition[]
  recommendations: ArtworkRecommendation[]
  customerSummary: string
  suggestedActionLabel: string
  templateRecommendation?: string
  productionImpactSummary?: string
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
  productTypeLabel: string
  label: string
  description: string
  fileName: string
  kind: 'guide_overlay' | 'storytelling_asset' | 'downloadable_template'
  formatsAvailable: Array<'pdf' | 'ai' | 'svg' | 'cdr' | 'png' | 'webp'>
  recommendedFormat: 'png' | 'webp' | 'pdf' | 'svg' | 'ai' | 'cdr'
  downloadUrls: Partial<Record<'pdf' | 'ai' | 'svg' | 'cdr' | 'png' | 'webp', string>>
  previewImage?: string
  transparentBackground: boolean
  orientation: 'portrait' | 'landscape' | 'square'
  recommendedSize: string
  bleedMm: number
  safeAreaMm: number
  cutlineRequired: boolean
  language: 'es'
  status: 'pending' | 'ready'
  updatedAt: string
  version: string
  priority: 'high' | 'medium' | 'low'
  usageNotes?: string[]
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
