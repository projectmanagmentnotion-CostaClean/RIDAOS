import type { ArtworkGuide as ArtworkGuideSpec, ArtworkPreview as ArtworkPreviewMetadata, ArtworkPreviewSummary } from '../../../domain/storage'

export type {
  ArtworkOrientation,
  ArtworkProductRule,
  ArtworkProductRuleKey,
  ArtworkRecommendation,
  ArtworkValidationCheck,
  ArtworkValidationState,
} from '../../../domain/storage'

export type { ArtworkGuideSpec, ArtworkPreviewMetadata, ArtworkPreviewSummary }

export type ArtworkUploadFlowState = {
  selectedFile: File | null
  metadata: ArtworkPreviewMetadata | null
  summary: ArtworkPreviewSummary | null
  confirmed: boolean
}
