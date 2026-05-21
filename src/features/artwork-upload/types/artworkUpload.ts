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

export type ArtworkGuideSpec = {
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
  guide: ArtworkGuideSpec
  helperCopy: string
  recommendations: string[]
}

export type ArtworkPreviewMetadata = {
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

export type ArtworkPreviewSummary = {
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

export type ArtworkUploadFlowState = {
  selectedFile: File | null
  metadata: ArtworkPreviewMetadata | null
  summary: ArtworkPreviewSummary | null
  confirmed: boolean
}
