import type {
  ArtworkPreview,
  ArtworkProductRule,
  ArtworkProductRuleKey,
  ArtworkValidationResult,
  PrepressCheckDefinition,
  PrepressCheckSeverity,
} from '../../../domain/storage'

export type PrepressThresholds = {
  recommendedMinDpi: number
  warningMinDpi: number
  preferredColorMode: 'CMYK' | 'RGB'
  maxFileSizeMb: number
  safeAreaToleranceMm: number
  bleedRequiredMm: number
}

export type ProductPrepressRuleset = {
  key: ArtworkProductRuleKey
  label: string
  requiredChecks: PrepressCheckDefinition['id'][]
  optionalChecks: PrepressCheckDefinition['id'][]
  blockingChecks: PrepressCheckDefinition['id'][]
  thresholds: PrepressThresholds
  customerFriendlyCopy: string
  templateRecommendation?: string
}

export type PrepressCheckContext = {
  metadata: ArtworkPreview
  productRule: ArtworkProductRule
  ruleset: ProductPrepressRuleset
}

export type PrepressCheckBuilder = (context: PrepressCheckContext) => PrepressCheckDefinition

export type PrepressScoreBreakdown = {
  score: number
  state: ArtworkValidationResult['readinessState']
  topSeverity: PrepressCheckSeverity
  productionImpactSummary: string
}

export type PrepressAnalysisPayload = {
  metadata: ArtworkPreview
  productRule: ArtworkProductRule
  ruleset: ProductPrepressRuleset
}
