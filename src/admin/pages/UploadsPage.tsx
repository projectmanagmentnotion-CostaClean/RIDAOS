import { useEffect, useState } from 'react'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import AdminShell from '../layouts/AdminShell'
import { uploadReviewStatusOptions } from '../config/uploadReviewStatuses'
import { listAdminUploads, updateAdminUploadNotes, updateAdminUploadStatus } from '../services/orderAdminService'
import type { AdminUploadRecord, AdminUploadReviewStatus } from '../types/adminModels'

function UploadsPage() {
  const [uploads, setUploads] = useState<AdminUploadRecord[]>([])

  useEffect(() => {
    let cancelled = false

    void listAdminUploads().then((data) => {
      if (!cancelled) {
        setUploads(data)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const refreshUploads = async () => {
    setUploads(await listAdminUploads())
  }

  return (
    <AdminShell
      description="Cola de archivos con estado de Comprobacion, notas y acceso al pedido relacionado."
      title="Comprobacion de uploads"
    >
      <AdminSection title="Archivos recibidos">
        {uploads.length === 0 ? (
          <EmptyAdminState description="Los archivos vinculados a pedidos apareceran aqui." title="No hay uploads disponibles" />
        ) : (
          <div className="admin-upload-grid">
            {uploads.map((upload) => (
              <article className="content-card admin-upload-card" key={upload.id}>
                <div className="order-card-head">
                  <div>
                    <p className="section-label">{upload.formatLabel}</p>
                    <h3>{upload.fileName}</h3>
                  </div>
                  <span className={`status-badge status-${upload.status === 'approved' ? 'success' : upload.status === 'needs_fix' ? 'danger' : 'warning'}`}>
                    {upload.status}
                  </span>
                </div>
                <div className="summary-list">
                  <div className="summary-row">
                    <span>Pedido</span>
                    <strong>{upload.orderId}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Cliente</span>
                    <strong>{upload.customer}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Producto</span>
                    <strong>{upload.product}</strong>
                  </div>
                </div>
                <div className="admin-upload-preview">
                  {upload.previewable ? (
                    <div className="image-hint image-hint-dtf-sheet">
                      <span className="image-hint-label">Preview disponible al conectar storage</span>
                    </div>
                  ) : (
                    <div className="premium-file-card">
                      <span className="premium-file-format">{upload.formatLabel}</span>
                      <h3>{upload.fileName}</h3>
                      <p>Vista previa pendiente de integracion real con storage.</p>
                    </div>
                  )}
                </div>
                <label className="field-group">
                  <span className="field-label">Estado de Comprobacion</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await updateAdminUploadStatus(upload.id, event.target.value as AdminUploadReviewStatus)
                      await refreshUploads()
                    }}
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
                  <span className="field-label">Notas de Comprobacion</span>
                  <textarea
                    className="form-input form-textarea"
                    onBlur={async (event) => {
                      await updateAdminUploadNotes(upload.id, event.target.value)
                      await refreshUploads()
                    }}
                    defaultValue={upload.reviewNotes}
                    rows={3}
                  />
                </label>
                <div className="catalog-card-actions">
                  <a className="action-button action-link-button" href={`#/admin/orders/${upload.orderId}`}>
                    Abrir pedido
                  </a>
                  <button className="action-button action-button-muted" disabled type="button">
                    Descarga al conectar storage
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminSection>
    </AdminShell>
  )
}

export default UploadsPage
