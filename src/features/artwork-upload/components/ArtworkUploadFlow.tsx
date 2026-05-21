import { useEffect } from 'react'
import { useArtworkUploadFlow } from '../hooks/useArtworkUploadFlow'
import { PrintPreviewCanvas } from '../preview/PrintPreviewCanvas'
import type { ArtworkPreviewSummary, ArtworkProductRuleKey, ArtworkUploadFlowState } from '../types/artworkUpload'

type ArtworkUploadFlowProps = {
  file: File | null
  onFileChange: (file: File | null) => void
  ruleKey: ArtworkProductRuleKey
  title?: string
  description?: string
  showUploadField?: boolean
  acceptedFormats?: string
  onStateChange?: (state: {
    metadata: ArtworkUploadFlowState['metadata']
    summary: ArtworkPreviewSummary | null
    confirmed: boolean
  }) => void
}

function getStatusLabel(status: ArtworkPreviewSummary['workflowStatus']) {
  switch (status) {
    case 'blocked':
      return 'Bloqueado'
    case 'needs_review':
      return 'Revisión manual'
    case 'warning':
      return 'Advertencias'
    case 'ready':
    default:
      return 'Listo'
  }
}

export function ArtworkUploadFlow({
  file,
  onFileChange,
  ruleKey,
  title = 'Artwork upload y preview',
  description = 'Sube el archivo, revisa las guías y confirma la pieza antes de continuar.',
  showUploadField = true,
  acceptedFormats,
  onStateChange,
}: ArtworkUploadFlowProps) {
  const { rule, metadata, summary, confirmed, setConfirmed, isLoading, steps } = useArtworkUploadFlow(ruleKey, file)

  useEffect(() => {
    onStateChange?.({ metadata, summary, confirmed })
  }, [confirmed, metadata, onStateChange, summary])

  return (
    <article className="content-card artwork-upload-flow" data-cursor="interest">
      <div className="premium-panel-header">
        <div>
          <p className="section-label">ARTWORK_UPLOAD_FLOW</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span className={`status-badge status-${summary?.workflowStatus === 'blocked' ? 'danger' : summary?.workflowStatus === 'needs_review' ? 'warning' : summary?.workflowStatus === 'warning' ? 'warning' : 'success'}`}>
          {summary ? getStatusLabel(summary.workflowStatus) : 'Pendiente'}
        </span>
      </div>

      <ol className="artwork-upload-flow__steps">
        {steps.map((step, index) => (
          <li className={`artwork-upload-flow__step${metadata && index < 5 ? ' is-complete' : ''}${confirmed && index === 5 ? ' is-complete' : ''}`} key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>

      {showUploadField ? (
        <label className="field-group" htmlFor={`artwork-upload-${ruleKey}`}>
          <span className="field-label">Archivo</span>
          <input
            accept={acceptedFormats}
            className="form-input form-input-file"
            id={`artwork-upload-${ruleKey}`}
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            type="file"
          />
          <span className="file-meta">{metadata?.fileName ?? 'Todavía no has cargado un archivo.'}</span>
          <span className="file-meta">{rule.helperCopy}</span>
        </label>
      ) : null}

      <div className="artwork-upload-flow__grid">
        <div className="artwork-upload-flow__preview">
          <PrintPreviewCanvas metadata={metadata} ruleKey={ruleKey} />
        </div>

        <div className="summary-stack">
          <article className="content-card artwork-upload-flow__panel">
            <p className="section-label">Revisión automática mock</p>
            {isLoading ? <p>Analizando archivo local…</p> : null}
            {!summary && !isLoading ? <p>Sube tu diseño para activar checks, guías y confirmación.</p> : null}
            {summary ? (
              <div className="summary-list compact-summary">
                <div className="summary-row">
                  <span>Producto</span>
                  <strong>{rule.label}</strong>
                </div>
                <div className="summary-row">
                  <span>Formato</span>
                  <strong>{summary.formatLabel}</strong>
                </div>
                <div className="summary-row">
                  <span>Tamaño</span>
                  <strong>{summary.fileSizeLabel}</strong>
                </div>
                <div className="summary-row">
                  <span>Guía base</span>
                  <strong>{summary.estimatedPhysicalSizeLabel}</strong>
                </div>
              </div>
            ) : null}
          </article>

          {summary ? (
            <article className="content-card artwork-upload-flow__panel" data-cursor="interactive">
              <p className="section-label">ARTWORK_VALIDATION_RULES</p>
              <div className="admin-list-card">
                {summary.checks.map((check) => (
                  <article className="admin-list-row admin-list-row-block" key={check.id}>
                    <div>
                      <strong>{check.label}</strong>
                      <p>{check.message}</p>
                    </div>
                    <span className={`status-badge status-${check.status === 'blocked' ? 'danger' : check.status === 'needs_review' ? 'warning' : check.status === 'warning' ? 'warning' : 'success'}`}>
                      {getStatusLabel(check.status)}
                    </span>
                  </article>
                ))}
              </div>
            </article>
          ) : null}
        </div>
      </div>

      {summary ? (
        <article className="content-card artwork-upload-flow__panel" data-cursor="interactive">
          <p className="section-label">ARTWORK_RECOMMENDATIONS</p>
          <ul className="hint-list">
            {summary.recommendations.map((recommendation) => (
              <li key={recommendation.id}>{recommendation.message}</li>
            ))}
          </ul>
          <div className="catalog-card-actions">
            <button
              className="action-button"
              disabled={summary.workflowStatus === 'blocked'}
              onClick={() => setConfirmed(true)}
              type="button"
            >
              Confirmar archivo
            </button>
            <button
              className="action-button action-button-muted"
              onClick={() => setConfirmed(false)}
              type="button"
            >
              Revisar de nuevo
            </button>
          </div>
          {confirmed ? (
            <p className="inline-notice">Archivo confirmado para seguir con el flujo mock.</p>
          ) : (
            <p className="inline-notice">Confirma el archivo cuando hayas revisado guías, warnings y escala.</p>
          )}
        </article>
      ) : null}
    </article>
  )
}
