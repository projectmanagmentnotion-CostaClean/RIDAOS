import type { ArtworkPreview, ArtworkProductRuleKey, ArtworkValidationResult } from '../../../domain/storage'
import { artworkProductRules } from '../../artwork-upload/product-rules/artworkProductRules'
import { buildPrepressChecks } from '../checks/buildPrepressChecks'
import { prepressCheckCatalogOrder } from '../mock/prepressCheckCatalog'
import { mapPrepressChecksToLegacyChecks, mapReadinessToWorkflowStatus } from '../mappers/mapPrepressToArtworkSummary'
import { buildPrepressRecommendations } from '../recommendations/buildPrepressRecommendations'
import { productPrepressRulesets } from '../rules/productPrepressRulesets'
import { scorePrepressChecks } from '../scoring/scorePrepressChecks'

export function runMockPrepressAnalysis(ruleKey: ArtworkProductRuleKey, metadata: ArtworkPreview): ArtworkValidationResult {
  const productRule = artworkProductRules[ruleKey]
  const ruleset = productPrepressRulesets[ruleKey]
  const checks = buildPrepressChecks({ metadata, productRule, ruleset }).sort(
    (left, right) => prepressCheckCatalogOrder.indexOf(left.id) - prepressCheckCatalogOrder.indexOf(right.id),
  )
  const score = scorePrepressChecks(checks)
  const recommendations = buildPrepressRecommendations(checks, score.state, productRule.recommendations)

  return {
    ruleKey,
    workflowStatus: mapReadinessToWorkflowStatus(score.state),
    readinessScore: score.score,
    readinessState: score.state,
    orientation: metadata.orientation,
    fileName: metadata.fileName,
    formatLabel: metadata.formatLabel,
    fileSizeLabel: metadata.fileSizeLabel,
    estimatedPhysicalSizeLabel: productRule.recommendedPhysicalSizeLabel,
    checks: mapPrepressChecksToLegacyChecks(checks),
    advancedChecks: checks,
    recommendations,
    customerSummary: ruleset.customerFriendlyCopy,
    suggestedActionLabel:
      score.state === 'blocked'
        ? 'Corrige el archivo antes de continuar'
        : score.state === 'needs_review'
          ? 'Pide revisión técnica'
          : score.state === 'minor_warnings'
            ? 'Continúa con advertencias'
            : 'Listo para confirmar',
    templateRecommendation: ruleset.templateRecommendation,
    productionImpactSummary: score.productionImpactSummary,
  }
}
