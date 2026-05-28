import { useEffect, useMemo, useRef, useState } from 'react'
import { useLiveToast } from '../../live-feedback'
import { PrepressSummaryPanel } from '../../prepress'
import { ProductTemplateDownloads } from '../../print-templates'
import { useArtworkUploadFlow } from '../hooks/useArtworkUploadFlow'
import { PrintPreviewCanvas } from '../preview/PrintPreviewCanvas'
import type {
  ArtworkPreviewSummary,
  ArtworkProductRuleKey,
  ArtworkUploadFlowState,
  ArtworkValidationContext,
} from '../types/artworkUpload'
import { ArtworkIssueModal } from './ArtworkIssueModal'
import { ArtworkReferenceApprovalCard } from './ArtworkReferenceApprovalCard'

type SummaryItem = {
  label: string
  value: string
}

type ArtworkUploadFlowProps = {
  file: File | null
  onFileChange: (file: File | null) => void
  ruleKey: ArtworkProductRuleKey
  title?: string
  description?: string
  showUploadField?: boolean
  acceptedFormats?: string
  validationContext?: ArtworkValidationContext
  summaryItems?: SummaryItem[]
  onStateChange?: (state: {
    metadata: ArtworkUploadFlowState['metadata']
    summary: ArtworkPreviewSummary | null
    acceptance: ArtworkUploadFlowState['acceptance']
    confirmed: boolean
  }) => void
}

function getStatusTone(summary: ArtworkPreviewSummary | null) {
  if (!summary) {
    return 'info'
  }

  if (summary.workflowStatus === 'blocked') {
    return 'danger'
  }

  if (summary.workflowStatus === 'warning' || summary.workflowStatus === 'needs_review') {
    return 'warning'
  }

  return 'success'
}

function getStatusLabel(summary: ArtworkPreviewSummary | null) {
  if (!summary) {
    return 'Por revisar'
  }

  switch (summary.workflowStatus) {
    case 'blocked':
      return 'Corregir'
    case 'needs_review':
      return 'Revision manual'
    case 'warning':
      return 'Advertencias'
    case 'ready':
    default:
      return 'Listo para revisar'
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
  validationContext,
  summaryItems = [],
  onStateChange,
}: ArtworkUploadFlowProps) {
  const [approvalChecked, setApprovalChecked] = useState(false)
  const [issueModalOpen, setIssueModalOpen] = useState(false)
  const lastIssueTokenRef = useRef<string | null>(null)
  const {
    rule,
    metadata,
    summary,
    acceptance,
    confirmed,
    setConfirmed,
    requestDesignerHelp,
    isLoading,
    steps,
  } = useArtworkUploadFlow(ruleKey, file, validationContext)
  const { error, info, success, warning } = useLiveToast()
  const fileToken = useMemo(
    () => (file ? `${file.name}-${file.size}-${file.lastModified}` : null),
    [file],
  )

  useEffect(() => {
    onStateChange?.({ metadata, summary, acceptance, confirmed })
  }, [acceptance, confirmed, metadata, onStateChange, summary])

  useEffect(() => {
    if (!metadata?.fileName) {
      return
    }

    info('Archivo recibido', `${metadata.fileName} ya esta listo para la comprobacion inicial.`, 2200)
  }, [info, metadata?.fileName])

  useEffect(() => {
    if (!summary || !acceptance) {
      return
    }

    if (acceptance.status === 'needs-correction') {
      warning('El archivo necesita revision', acceptance.guidanceLabel, 3200)
      return
    }

    if (acceptance.status === 'ready-for-approval') {
      success('Archivo listo para revisar', 'Ya puedes validar la referencia final antes de continuar.', 2200)
    }
  }, [acceptance, success, summary, warning])

  useEffect(() => {
    if (!acceptance || !fileToken) {
      return
    }

    if (acceptance.status !== 'needs-correction' || acceptance.designerHelpRequested || acceptance.issues.length === 0) {
      return
    }

    if (lastIssueTokenRef.current === fileToken) {
      return
    }

    lastIssueTokenRef.current = fileToken
    queueMicrotask(() => {
      setIssueModalOpen(true)
    })
    error('Tu archivo necesita un ajuste', 'Hemos abierto una revision con las correcciones recomendadas.', 3200)
  }, [acceptance, error, fileToken])

  const handleApprove = () => {
    setConfirmed(true)
    setApprovalChecked(false)
    success('Archivo aceptado para revision', 'Usaremos esta version como referencia para preparar la impresion.', 2400)
  }

  const handleReset = () => {
    setConfirmed(false)
    setApprovalChecked(false)
    requestDesignerHelp(false)
    setIssueModalOpen(false)
  }

  const handleDesignerHelp = () => {
    requestDesignerHelp(true)
    setApprovalChecked(false)
    setIssueModalOpen(false)
    info(
      'Ayuda de diseno Ridaos solicitada',
      'Seguiremos la solicitud contigo antes de preparar la impresion.',
      2600,
    )
  }

  const handleFileSelection = (nextFile: File | null) => {
    setApprovalChecked(false)
    setIssueModalOpen(false)
    onFileChange(nextFile)
  }

  return (
    <>
      <article className="content-card artwork-upload-flow" data-cursor="interest">
        <div className="premium-panel-header">
          <div>
            <p className="section-label">Subida de archivo</p>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <span className={`status-badge status-${getStatusTone(summary)}`}>{acceptance?.statusLabel ?? getStatusLabel(summary)}</span>
        </div>

        <ol className="artwork-upload-flow__steps">
          {steps.map((step, index) => {
            const isComplete =
              (metadata && index < 5) ||
              ((acceptance?.clientAccepted || acceptance?.designerHelpRequested) && index >= 5)

            return (
              <li className={`artwork-upload-flow__step${isComplete ? ' is-complete' : ''}`} key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </li>
            )
          })}
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
              onChange={(event) => handleFileSelection(event.target.files?.[0] ?? null)}
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
              <p className="section-label">Comprobacion inicial</p>
              {isLoading ? <p>Comprobando archivo...</p> : null}
              {!summary && !isLoading ? <p>Sube tu diseno para activar la vista previa, las guias y la aceptacion final.</p> : null}
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
                    <span>Peso</span>
                    <strong>{summary.fileSizeLabel}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Guia base</span>
                    <strong>{summary.estimatedPhysicalSizeLabel}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Estado</span>
                    <strong>{acceptance?.statusLabel ?? getStatusLabel(summary)}</strong>
                  </div>
                </div>
              ) : null}
            </article>

            {summary ? <PrepressSummaryPanel summary={summary} /> : null}

            {summary ? (
              <article className="content-card artwork-upload-flow__panel" data-cursor="interactive">
                <p className="section-label">Requisitos detectados</p>
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
            {summary.templateRecommendation ? (
              <p className="inline-notice">Plantilla recomendada: {summary.templateRecommendation}</p>
            ) : null}
            {acceptance ? (
              <p className="inline-notice">
                {acceptance.guidanceLabel}
                {!acceptance.formatRecommended ? ` Formatos recomendados: ${acceptance.preferredFormats.join(', ')}.` : ''}
              </p>
            ) : null}
          </article>
        ) : null}

        {acceptance ? (
          <ArtworkReferenceApprovalCard
            acceptance={acceptance}
            approvalChecked={approvalChecked}
            metadata={metadata}
            onApprovalCheckedChange={setApprovalChecked}
            onApprove={handleApprove}
            onRequestDesignerHelp={handleDesignerHelp}
            onReset={handleReset}
            productLabel={validationContext?.productName ?? rule.label}
            summaryItems={summaryItems}
          />
        ) : null}
      </article>

      <ArtworkIssueModal
        issues={acceptance?.issues ?? []}
        onClose={() => setIssueModalOpen(false)}
        onRequestDesignerHelp={handleDesignerHelp}
        open={issueModalOpen}
      />
    </>
  )
}
