import type { ArtworkRecommendation, PrepressCheckDefinition, PrepressReadinessState } from '../../../domain/storage'

export function buildPrepressRecommendations(
  checks: PrepressCheckDefinition[],
  readinessState: PrepressReadinessState,
  baseRecommendations: string[],
): ArtworkRecommendation[] {
  const dynamic = checks
    .filter((check) => check.status === 'warning' || check.status === 'fail')
    .map<ArtworkRecommendation>((check) => ({
      id: `prepress-${check.id}`,
      message: check.recommendation,
      tone: check.status === 'fail' ? 'critical' : 'warning',
    }))

  const base = baseRecommendations.map<ArtworkRecommendation>((message, index) => ({
    id: `prepress-base-${index}`,
    message,
    tone: readinessState === 'blocked' ? 'warning' : 'info',
  }))

  return [...base, ...dynamic]
}
