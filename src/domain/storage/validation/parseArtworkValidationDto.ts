import type { ArtworkValidationResult } from '../storage.types'
import type { ArtworkValidationDto } from '../dto'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function parseArtworkValidationDto(input: unknown): ArtworkValidationDto | null {
  if (!isRecord(input)) {
    return null
  }

  if (
    typeof input.ruleKey !== 'string' ||
    typeof input.workflowStatus !== 'string' ||
    typeof input.orientation !== 'string' ||
    typeof input.fileName !== 'string' ||
    typeof input.formatLabel !== 'string' ||
    typeof input.fileSizeLabel !== 'string' ||
    typeof input.estimatedPhysicalSizeLabel !== 'string' ||
    !Array.isArray(input.checks) ||
    !Array.isArray(input.recommendations)
  ) {
    return null
  }

  return {
    ruleKey: input.ruleKey as ArtworkValidationDto['ruleKey'],
    workflowStatus: input.workflowStatus as ArtworkValidationDto['workflowStatus'],
    orientation: input.orientation as ArtworkValidationDto['orientation'],
    fileName: input.fileName,
    formatLabel: input.formatLabel,
    fileSizeLabel: input.fileSizeLabel,
    estimatedPhysicalSizeLabel: input.estimatedPhysicalSizeLabel,
    checks: input.checks
      .filter(isRecord)
      .map((check) => ({
        id: typeof check.id === 'string' ? check.id : 'unknown-check',
        label: typeof check.label === 'string' ? check.label : 'Check',
        status:
          check.status === 'ready' || check.status === 'warning' || check.status === 'needs_review' || check.status === 'blocked'
            ? check.status
            : 'warning',
        message: typeof check.message === 'string' ? check.message : '',
      })),
    recommendations: input.recommendations
      .filter(isRecord)
      .map((recommendation) => ({
        id: typeof recommendation.id === 'string' ? recommendation.id : 'unknown-recommendation',
        message: typeof recommendation.message === 'string' ? recommendation.message : '',
        tone:
          recommendation.tone === 'info' || recommendation.tone === 'warning' || recommendation.tone === 'critical'
            ? recommendation.tone
            : 'info',
      })),
  }
}

export function normalizeArtworkValidationResult(input: unknown): ArtworkValidationResult | null {
  const dto = parseArtworkValidationDto(input)
  if (!dto) {
    return null
  }

  return dto
}
