import { useId } from 'react'
import type { ArtworkPreview, ArtworkReferenceAcceptance } from '../../../domain/storage'
import { getArtworkAcceptanceDisplayStatus } from '../utils/formatArtworkAcceptance'

type SummaryItem = {
  label: string
  value: string
}

type ArtworkReferenceApprovalCardProps = {
  acceptance: ArtworkReferenceAcceptance
  metadata: ArtworkPreview | null
  productLabel: string
  summaryItems?: SummaryItem[]
  approvalChecked: boolean
  onApprovalCheckedChange: (checked: boolean) => void
  onApprove: () => void
  onReset: () => void
  onRequestDesignerHelp: () => void
}

function formatTimestamp(value?: string) {
  if (!value) {
    return null
  }

  return new Date(value).toLocaleString('es-ES')
}

export function ArtworkReferenceApprovalCard({
  acceptance,
  metadata,
  productLabel,
  summaryItems = [],
  approvalChecked,
  onApprovalCheckedChange,
  onApprove,
  onReset,
  onRequestDesignerHelp,
}: ArtworkReferenceApprovalCardProps) {
  const checkboxId = useId()
  const canAccept = acceptance.status === 'ready-for-approval' && approvalChecked
  const reviewTimestamp = formatTimestamp(acceptance.lastCheckedAt)
  const acceptedTimestamp = formatTimestamp(acceptance.acceptedAt)

  return (
    <article className="content-card artwork-upload-flow__panel" data-cursor="interactive">
      <p className="section-label">Referencia final de impresion</p>
      <div className="summary-list compact-summary">
        <div className="summary-row">
          <span>Archivo</span>
          <strong>{metadata?.fileName ?? 'Archivo pendiente'}</strong>
        </div>
        <div className="summary-row">
          <span>Formato</span>
          <strong>{metadata?.formatLabel ?? 'Por confirmar'}</strong>
        </div>
        <div className="summary-row">
          <span>Peso del archivo</span>
          <strong>{metadata?.fileSizeLabel ?? 'Por confirmar'}</strong>
        </div>
        <div className="summary-row">
          <span>Producto</span>
          <strong>{productLabel}</strong>
        </div>
        <div className="summary-row">
          <span>Estado</span>
          <strong>{getArtworkAcceptanceDisplayStatus(acceptance)}</strong>
        </div>
        {reviewTimestamp ? (
          <div className="summary-row">
            <span>Revision visible</span>
            <strong>{reviewTimestamp}</strong>
          </div>
        ) : null}
        {acceptedTimestamp ? (
          <div className="summary-row">
            <span>Aceptado</span>
            <strong>{acceptedTimestamp}</strong>
          </div>
        ) : null}
      </div>

      {summaryItems.length ? (
        <>
          <p className="section-label">Configuracion asociada</p>
          <div className="summary-list compact-summary">
            {summaryItems.slice(0, 4).map((item) => (
              <div className="summary-row" key={`${item.label}-${item.value}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <p className="inline-notice">
        Revisa este archivo antes de continuar. Esta version se usara como referencia para preparar la impresion.
      </p>

      {acceptance.issues.length ? (
        <>
          <p className="section-label">Advertencias</p>
          <ul className="hint-list">
            {acceptance.issues.slice(0, 3).map((issue) => (
              <li key={issue.id}>{issue.correctionHint}</li>
            ))}
          </ul>
        </>
      ) : acceptance.warnings.length ? (
        <ul className="hint-list">
          {acceptance.warnings.slice(0, 3).map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}

      {acceptance.acceptanceRequired && !acceptance.clientAccepted && !acceptance.designerHelpRequested ? (
        <label className="field-group" htmlFor={checkboxId}>
          <span className="field-label">Aceptacion explicita</span>
          <div className="checkbox-row">
            <input
              checked={approvalChecked}
              id={checkboxId}
              onChange={(event) => onApprovalCheckedChange(event.target.checked)}
              type="checkbox"
            />
            <span>He revisado el archivo y acepto que esta es la version que se usara para preparar la impresion.</span>
          </div>
        </label>
      ) : null}

      <div className="catalog-cta-row">
        {!acceptance.designerHelpRequested ? (
          <button className="action-button" disabled={!canAccept} onClick={onApprove} type="button">
            Aceptar archivo
          </button>
        ) : null}
        <button className="action-button action-button-muted" onClick={onReset} type="button">
          Revisar de nuevo
        </button>
        <button className="action-button action-button-muted" onClick={onRequestDesignerHelp} type="button">
          Solicitar ayuda de diseno Ridaos
        </button>
      </div>

      {acceptance.clientAccepted ? (
        <p className="inline-notice">Archivo aceptado. Usaremos esta version como referencia para preparar la impresion.</p>
      ) : null}
      {acceptance.designerHelpRequested ? (
        <p className="inline-notice">
          Ayuda de diseno solicitada. Puedes continuar como solicitud mientras revisamos el archivo contigo.
        </p>
      ) : null}
    </article>
  )
}
