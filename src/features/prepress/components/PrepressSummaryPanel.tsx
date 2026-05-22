import type { ArtworkValidationResult } from '../../../domain/storage'
import { PrepressScoreBadge } from './PrepressScoreBadge'

type PrepressSummaryPanelProps = {
  summary: ArtworkValidationResult
}

export function PrepressSummaryPanel({ summary }: PrepressSummaryPanelProps) {
  const priorityChecks = summary.advancedChecks.filter((check) => check.status === 'fail' || check.status === 'warning').slice(0, 4)

  return (
    <article className="content-card artwork-upload-flow__panel" data-cursor="interactive">
      <p className="section-label">PREPRESS_SCORE</p>
      <PrepressScoreBadge summary={summary} />
      <p>{summary.customerSummary}</p>
      <p className="inline-notice">{summary.productionImpactSummary}</p>
      {summary.templateRecommendation ? <p className="file-meta">Plantilla recomendada: {summary.templateRecommendation}</p> : null}
      <div className="summary-list compact-summary">
        <div className="summary-row">
          <span>Estado general</span>
          <strong>{summary.suggestedActionLabel}</strong>
        </div>
        <div className="summary-row">
          <span>Escala guía</span>
          <strong>{summary.estimatedPhysicalSizeLabel}</strong>
        </div>
        <div className="summary-row">
          <span>Formato</span>
          <strong>{summary.formatLabel}</strong>
        </div>
      </div>
      {priorityChecks.length ? (
        <div className="admin-list-card">
          {priorityChecks.map((check) => (
            <article className="admin-list-row admin-list-row-block" key={check.id}>
              <div>
                <strong>{check.title}</strong>
                <p>{check.recommendation}</p>
              </div>
              <span className={`status-badge status-${check.status === 'fail' ? 'danger' : check.status === 'warning' ? 'warning' : 'info'}`}>
                {check.status === 'fail' ? 'Crítico' : check.status === 'warning' ? 'Aviso' : 'Info'}
              </span>
            </article>
          ))}
        </div>
      ) : null}
    </article>
  )
}
