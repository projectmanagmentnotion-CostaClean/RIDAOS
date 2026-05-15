import { useEffect, useState } from 'react'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import { uploadReviewStatusConfig, uploadReviewStatusOptions } from '../config/uploadReviewStatuses'
import AdminShell from '../layouts/AdminShell'
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
      description="Cola interna de archivos preparada para comprobacion tecnica, correcciones y paso a produccion."
      title="Comprobacion de uploads"
    >
      <AdminSection
        description="Cada tarjeta resume pedido, producto, estado y comentario de revision."
        title="Archivos recibidos"
      >
        {uploads.length === 0 ? (
          <EmptyAdminState
            description="Los archivos vinculados a pedidos apareceran aqui cuando entren nuevos encargos."
            title="No hay uploads disponibles"
          />
        ) : (
          <div className="admin-upload-grid">
            {uploads.map((upload) => (
              <article className="content-card admin-upload-card" key={upload.id}>
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
                      <span className="image-hint-label">Vista previa preparada para futura conexion de storage</span>
                    </div>
                  ) : (
                    <div className="premium-file-card">
                      <span className="premium-file-format">{upload.formatLabel}</span>
                      <h3>{upload.fileName}</h3>
                      <p>El panel deja el hueco listo para previsualizacion cuando entre la capa real de almacenamiento.</p>
                    </div>
                  )}
                </div>
                <div className="admin-upload-note">
                  <p className="section-label">Siguiente accion sugerida</p>
                  <p>
                    {upload.status === 'approved'
                      ? 'Pasar el pedido al siguiente paso comercial o productivo.'
                      : upload.status === 'needs_fix'
                        ? 'Documentar la incidencia y esperar nueva version.'
                        : 'Completar la comprobacion tecnica y dejar observacion clara.'}
                  </p>
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
