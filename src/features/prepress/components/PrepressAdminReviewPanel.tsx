import type { ArtworkValidationResult } from '../../../domain/storage'
import { PrepressScoreBadge } from './PrepressScoreBadge'

type PrepressAdminReviewPanelProps = {
  summary: ArtworkValidationResult
}

export function PrepressAdminReviewPanel({ summary }: PrepressAdminReviewPanelProps) {
  return (
    <div className="admin-upload-note prepress-admin-panel">
      <div className="order-card-head">
        <div>
          <strong>Revision de preprensa</strong>
          <p>{summary.productionImpactSummary}</p>
        </div>
        <PrepressScoreBadge summary={summary} />
      </div>
      <div className="summary-list">
        <div className="summary-row">
          <span>Estado</span>
          <strong>{summary.suggestedActionLabel}</strong>
        </div>
        <div className="summary-row">
          <span>Plantilla</span>
          <strong>{summary.templateRecommendation ?? 'Sin plantilla especifica'}</strong>
        </div>
      </div>
      <div className="admin-list-card">
        {summary.advancedChecks.map((check) => (
          <article className="admin-list-row admin-list-row-block" key={check.id}>
            <div>
              <strong>{check.title}</strong>
              <p>{check.description}</p>
              <small>{check.productionImpact}</small>
            </div>
            <span className={`status-badge status-${check.status === 'fail' ? 'danger' : check.status === 'warning' ? 'warning' : check.status === 'pass' ? 'success' : 'info'}`}>
              {check.status}
            </span>
          </article>
        ))}
      </div>
    </div>
  )
}

