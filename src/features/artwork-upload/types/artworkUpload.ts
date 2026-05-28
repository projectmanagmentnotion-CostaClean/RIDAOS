import type {
  ArtworkGuide as ArtworkGuideSpec,
  ArtworkPreview as ArtworkPreviewMetadata,
  ArtworkPreviewSummary,
  ArtworkReferenceAcceptance,
} from '../../../domain/storage'

export type {
  ArtworkOrientation,
  ArtworkProductRule,
  ArtworkProductRuleKey,
  ArtworkRecommendation,
  ArtworkValidationCheck,
  ArtworkValidationState,
} from '../../../domain/storage'

export type { ArtworkGuideSpec, ArtworkPreviewMetadata, ArtworkPreviewSummary }

export type ArtworkValidationContext = {
  productName?: string
  configuration?: Partial<Record<string, string>>
}

export type ArtworkUploadFlowState = {
  selectedFile: File | null
  metadata: ArtworkPreviewMetadata | null
  summary: ArtworkPreviewSummary | null
  acceptance: ArtworkReferenceAcceptance | null
  confirmed: boolean
}
