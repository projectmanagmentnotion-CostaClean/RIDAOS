import { uploadReviewStatusConfig, uploadReviewStatusOptions } from '../../../admin/config/uploadReviewStatuses'
import type { AdminUploadReviewStatus } from '../../../admin/types/adminModels'
import { artworkReviewChecklist } from '../../artwork-upload'
import { PrepressAdminReviewPanel } from '../../prepress'
import { ProductTemplateDownloads } from '../../print-templates'
import { getArtworkStatusLabel } from '../services/operationsMappers'
import type { OperationsUploadRecord } from '../types/operations'

type ArtworkReviewCardProps = {
  upload: OperationsUploadRecord
  onStatusChange: (status: AdminUploadReviewStatus) => Promise<void>
  onNotesChange: (reviewNotes: string) => Promise<void>
}

function ArtworkReviewCard({ upload, onStatusChange, onNotesChange }: ArtworkReviewCardProps) {
  return (
    <article className="content-card admin-upload-card">
      <div className="order-card-head">
        <div>
          <p className="section-label">{upload.formatLabel}</p>
          <h3>{upload.fileName}</h3>
        </div>
        <span className={`status-badge status-${uploadReviewStatusConfig[upload.status].colorClass}`}>
          {uploadReviewStatusConfig[upload.status].label}
        </span>
      </div>
      <div className="summary-list">
        <div className="summary-row">
          <span>Pedido</span>
          <strong>{upload.orderId}</strong>
        </div>
        <div className="summary-row">
          <span>Categoria</span>
          <strong>{upload.product}</strong>
        </div>
        <div className="summary-row">
          <span>Artwork</span>
          <strong>{getArtworkStatusLabel(upload.artworkStatus)}</strong>
        </div>
        <div className="summary-row">
          <span>Operador</span>
          <strong>{upload.operator.name}</strong>
        </div>
      </div>
      <div className="admin-upload-preview">
        {upload.previewable ? (
          <div className="image-hint image-hint-dtf-sheet">
            <span className="image-hint-label">Vista previa lista para validacion tecnica</span>
          </div>
        ) : (
          <div className="premium-file-card">
            <span className="premium-file-format">{upload.formatLabel}</span>
            <h3>{upload.fileName}</h3>
            <p>La tarjeta deja lista la metadata, la validacion y el comentario operativo del archivo.</p>
          </div>
        )}
      </div>
      {upload.previewSummary ? <PrepressAdminReviewPanel summary={upload.previewSummary} /> : null}
      {upload.previewSummary ? (
        <ProductTemplateDownloads
          compact
          description="Referencia tecnica para revisar la plantilla recomendada durante la validacion."
          ruleKey={upload.previewSummary.ruleKey}
          title="Plantilla tecnica"
        />
      ) : null}
      <label className="field-group">
        <span className="field-label">Estado de revision</span>
        <select
          className="form-input"
          onChange={(event) => void onStatusChange(event.target.value as AdminUploadReviewStatus)}
          value={upload.status}
        >
          {uploadReviewStatusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>
      <label className="field-group">
        <span className="field-label">Notas de revision</span>
        <textarea
          className="form-input form-textarea"
          defaultValue={upload.reviewNotes}
          onBlur={(event) => void onNotesChange(event.target.value)}
          rows={3}
        />
      </label>
      <div className="admin-upload-note">
        <strong>Checklist de produccion</strong>
        <ul className="hint-list">
          {artworkReviewChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="catalog-card-actions">
        <a className="action-button action-link-button" href={`#/admin/orders/${upload.orderId}`}>
          Abrir pedido
        </a>
        <button className="action-button action-button-muted" onClick={() => void onStatusChange('approved')} type="button">
          Aprobar archivo
        </button>
        <button className="action-button action-button-muted" onClick={() => void onStatusChange('needs_fix')} type="button">
          Solicitar correccion
        </button>
        <span className={`status-badge status-${upload.validationState === 'blocked' ? 'danger' : upload.validationState === 'warning' ? 'warning' : 'success'}`}>
          {upload.validationState === 'blocked' ? 'Bloqueado' : upload.validationState === 'warning' ? 'Pendiente' : 'Listo'}
        </span>
      </div>
    </article>
  )
}

export default ArtworkReviewCard
