import { useEffect } from 'react'
import { useLiveToast } from '../../live-feedback'
import { PrepressSummaryPanel } from '../../prepress'
import { ProductTemplateDownloads } from '../../print-templates'
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
      return 'Revision manual'
    case 'warning':
      return 'Advertencias'
    case 'ready':
    default:
      return 'Listo'
  }
}

function getCheckStatusLabel(status: ArtworkPreviewSummary['advancedChecks'][number]['status']) {
  switch (status) {
    case 'fail':
      return 'Corregir'
    case 'warning':
      return 'Revisar'
    case 'pass':
      return 'Correcto'
    default:
      return 'Info'
  }
}

export function ArtworkUploadFlow({
  file,
  onFileChange,
  ruleKey,
  title = 'Sube tu archivo',
  description = 'Sube el archivo, revisa las guias y confirma la pieza antes de continuar.',
  showUploadField = true,
  acceptedFormats,
  onStateChange,
}: ArtworkUploadFlowProps) {
  const { rule, metadata, summary, confirmed, setConfirmed, isLoading, steps } = useArtworkUploadFlow(ruleKey, file)
  const { info, success, warning } = useLiveToast()

  useEffect(() => {
    onStateChange?.({ metadata, summary, confirmed })
  }, [confirmed, metadata, onStateChange, summary])

  useEffect(() => {
    if (!metadata?.fileName) {
      return
    }

    info('Archivo recibido', `${metadata.fileName} ya esta listo para revisar.`, 2000)
  }, [info, metadata?.fileName])

  useEffect(() => {
    if (!summary) {
      return
    }

    if (summary.workflowStatus === 'warning' || summary.workflowStatus === 'needs_review') {
      warning('Revision recomendada', 'Hemos detectado puntos a revisar antes de producir.', 2600)
      return
    }

    if (summary.workflowStatus === 'ready') {
      success('Vista previa lista', 'La pieza ya se puede validar con sus guias de impresion.', 2200)
    }
  }, [success, summary, warning])

  return (
    <article className="content-card artwork-upload-flow" data-cursor="interest">
      <div className="premium-panel-header">
        <div>
          <p className="section-label">Subida de archivo</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span
          className={`status-badge status-${summary?.workflowStatus === 'blocked' ? 'danger' : summary?.workflowStatus === 'needs_review' ? 'warning' : summary?.workflowStatus === 'warning' ? 'warning' : 'success'}`}
        >
          {summary ? getStatusLabel(summary.workflowStatus) : 'Por revisar'}
        </span>
      </div>

      <ol className="artwork-upload-flow__steps">
        {steps.map((step, index) => (
          <li
            className={`artwork-upload-flow__step${metadata && index < 5 ? ' is-complete' : ''}${confirmed && index === 5 ? ' is-complete' : ''}`}
            key={step}
          >
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>

      <ProductTemplateDownloads
        compact
        description="Prepara tu archivo con una base clara de sangrado, corte y zona segura antes de exportarlo."
        ruleKey={ruleKey}
        title="Plantilla recomendada antes de subir el archivo"
      />

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
          <span className="file-meta">{metadata?.fileName ?? 'Todavia no has cargado un archivo.'}</span>
          <span className="file-meta">{rule.helperCopy}</span>
        </label>
      ) : null}

      <div className="artwork-upload-flow__grid">
        <div className="artwork-upload-flow__preview">
          <PrintPreviewCanvas metadata={metadata} ruleKey={ruleKey} />
        </div>

        <div className="summary-stack">
          <article className="content-card artwork-upload-flow__panel">
            <p className="section-label">Revision automatica</p>
            {isLoading ? <p>Analizando archivo...</p> : null}
            {!summary && !isLoading ? <p>Sube tu diseno para activar checks, guias y confirmacion.</p> : null}
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
                  <span>Tamano</span>
                  <strong>{summary.fileSizeLabel}</strong>
                </div>
                <div className="summary-row">
                  <span>Guia base</span>
                  <strong>{summary.estimatedPhysicalSizeLabel}</strong>
                </div>
              </div>
            ) : null}
          </article>

          {summary ? <PrepressSummaryPanel summary={summary} /> : null}

          {summary ? (
            <article className="content-card artwork-upload-flow__panel" data-cursor="interactive">
              <p className="section-label">Revision tecnica</p>
              <div className="admin-list-card">
                {summary.advancedChecks.map((check) => (
                  <article className="admin-list-row admin-list-row-block" key={check.id}>
                    <div>
                      <strong>{check.title}</strong>
                      <p>{check.description}</p>
                      <small>{check.productionImpact}</small>
                    </div>
                    <span
                      className={`status-badge status-${check.status === 'fail' ? 'danger' : check.status === 'warning' ? 'warning' : check.status === 'pass' ? 'success' : 'info'}`}
                    >
                      {getCheckStatusLabel(check.status)}
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
          <p className="section-label">Recomendaciones</p>
          <ul className="hint-list">
            {summary.recommendations.map((recommendation) => (
              <li key={recommendation.id}>{recommendation.message}</li>
            ))}
          </ul>
          {summary.templateRecommendation ? <p className="inline-notice">Plantilla recomendada: {summary.templateRecommendation}</p> : null}
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
            <p className="inline-notice">Archivo confirmado para seguir con tu pedido.</p>
          ) : (
            <p className="inline-notice">{summary.suggestedActionLabel}. Revisa score, guias y correcciones antes de confirmar.</p>
          )}
        </article>
      ) : null}
    </article>
  )
}
