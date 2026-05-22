import type { ArtworkValidationResult } from '../storage.types'
import type { ArtworkValidationDto } from '../dto'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function parseArtworkValidationDto(input: unknown): ArtworkValidationDto | null {
  if (!isRecord(input)) {
    return null
  }

  if (typeof input.ruleKey !== 'string' || typeof input.fileName !== 'string' || typeof input.formatLabel !== 'string') {
    return null
  }

  return {
    ruleKey: input.ruleKey as ArtworkValidationDto['ruleKey'],
    workflowStatus:
      input.workflowStatus === 'ready' ||
      input.workflowStatus === 'warning' ||
      input.workflowStatus === 'needs_review' ||
      input.workflowStatus === 'blocked'
        ? input.workflowStatus
        : 'warning',
    orientation:
      input.orientation === 'portrait' ||
      input.orientation === 'landscape' ||
      input.orientation === 'square' ||
      input.orientation === 'free'
        ? input.orientation
        : 'free',
    fileName: input.fileName,
    formatLabel: input.formatLabel,
    fileSizeLabel: typeof input.fileSizeLabel === 'string' ? input.fileSizeLabel : 'No disponible',
    estimatedPhysicalSizeLabel:
      typeof input.estimatedPhysicalSizeLabel === 'string' ? input.estimatedPhysicalSizeLabel : 'Revision tecnica recomendada',
    checks: (Array.isArray(input.checks) ? input.checks : [])
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
    recommendations: (Array.isArray(input.recommendations) ? input.recommendations : [])
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

  const readinessState =
    isRecord(input) && (input.readinessState === 'print_ready' || input.readinessState === 'minor_warnings' || input.readinessState === 'needs_review' || input.readinessState === 'blocked')
      ? input.readinessState
      : dto.workflowStatus === 'ready'
        ? 'print_ready'
        : dto.workflowStatus === 'warning'
          ? 'minor_warnings'
          : dto.workflowStatus === 'needs_review'
            ? 'needs_review'
            : 'blocked'

  return {
    ...dto,
    readinessScore: isRecord(input) && typeof input.readinessScore === 'number' ? input.readinessScore : dto.workflowStatus === 'ready' ? 92 : dto.workflowStatus === 'warning' ? 78 : dto.workflowStatus === 'needs_review' ? 58 : 32,
    readinessState,
    advancedChecks:
      isRecord(input) && Array.isArray(input.advancedChecks)
        ? input.advancedChecks.filter(isRecord).map((check) => ({
            id: typeof check.id === 'string' ? (check.id as ArtworkValidationResult['advancedChecks'][number]['id']) : 'file_format_check',
            status:
              check.status === 'pass' || check.status === 'warning' || check.status === 'fail' || check.status === 'info'
                ? check.status
                : 'info',
            severity:
              check.severity === 'low' || check.severity === 'medium' || check.severity === 'high' || check.severity === 'critical'
                ? check.severity
                : 'medium',
            title: typeof check.title === 'string' ? check.title : typeof check.label === 'string' ? check.label : 'Check',
            description: typeof check.description === 'string' ? check.description : typeof check.message === 'string' ? check.message : '',
            recommendation:
              typeof check.recommendation === 'string'
                ? check.recommendation
                : typeof check.message === 'string'
                  ? check.message
                  : 'Revision tecnica recomendada.',
            productApplicability: Array.isArray(check.productApplicability)
              ? check.productApplicability.filter((value): value is ArtworkValidationResult['ruleKey'] => typeof value === 'string')
              : [dto.ruleKey],
            productionImpact: typeof check.productionImpact === 'string' ? check.productionImpact : 'Puede requerir revision tecnica.',
            blocking: typeof check.blocking === 'boolean' ? check.blocking : false,
          }))
        : dto.checks.map((check) => ({
            id: 'file_format_check',
            status: check.status === 'blocked' ? 'fail' : check.status === 'warning' || check.status === 'needs_review' ? 'warning' : 'pass',
            severity: check.status === 'blocked' ? 'critical' : check.status === 'warning' || check.status === 'needs_review' ? 'medium' : 'low',
            title: check.label,
            description: check.message,
            recommendation: check.message,
            productApplicability: [dto.ruleKey],
            productionImpact: 'Compatibilidad con resumen legacy.',
            blocking: check.status === 'blocked',
          })),
    customerSummary:
      isRecord(input) && typeof input.customerSummary === 'string'
        ? input.customerSummary
        : 'Resumen mock heredado. Conviene validar el archivo con la capa de preprensa avanzada.',
    suggestedActionLabel:
      isRecord(input) && typeof input.suggestedActionLabel === 'string'
        ? input.suggestedActionLabel
        : readinessState === 'blocked'
          ? 'Corrige el archivo antes de continuar'
          : readinessState === 'needs_review'
            ? 'Pide revision tecnica'
            : readinessState === 'minor_warnings'
              ? 'Continua con advertencias'
              : 'Listo para confirmar',
    templateRecommendation:
      isRecord(input) && typeof input.templateRecommendation === 'string' ? input.templateRecommendation : undefined,
    productionImpactSummary:
      isRecord(input) && typeof input.productionImpactSummary === 'string'
        ? input.productionImpactSummary
        : 'Resumen cargado desde una version anterior del workflow mock.',
  }
}
