import type { ArtworkValidationResult } from '../../../domain/storage'

type PrepressScoreBadgeProps = {
  summary: ArtworkValidationResult
}

function getTone(state: ArtworkValidationResult['readinessState']) {
  switch (state) {
    case 'blocked':
      return 'danger'
    case 'needs_review':
      return 'warning'
    case 'minor_warnings':
      return 'warning'
    case 'print_ready':
    default:
      return 'success'
  }
}

function getLabel(state: ArtworkValidationResult['readinessState']) {
  switch (state) {
    case 'blocked':
      return 'Bloqueado'
    case 'needs_review':
      return 'Revisión técnica'
    case 'minor_warnings':
      return 'Con avisos'
    case 'print_ready':
    default:
      return 'Listo para impresión'
  }
}

export function PrepressScoreBadge({ summary }: PrepressScoreBadgeProps) {
  return (
    <div className="prepress-score-badge">
      <div className="prepress-score-badge__value">
        <strong>{summary.readinessScore}</strong>
        <span>/100</span>
      </div>
      <span className={`status-badge status-${getTone(summary.readinessState)}`}>{getLabel(summary.readinessState)}</span>
    </div>
  )
}
