import type {
  ArtworkOrientation,
  ArtworkProductRuleKey,
  ArtworkRecommendation,
  ArtworkValidationCheck,
  ArtworkValidationState,
} from '../storage.types'

export type ArtworkValidationDto = {
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
