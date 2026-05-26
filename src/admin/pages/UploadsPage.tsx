import { useState } from 'react'
import AdminSearchInput from '../components/AdminSearchInput'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import AdminShell from '../layouts/AdminShell'
import { listAdminUploads, updateAdminUploadNotes, updateAdminUploadStatus } from '../services/orderAdminService'
import type { OperationsUploadRecord } from '../../features/operations/types/operations'
import { useOperationsUploads } from '../../features/operations/hooks/useOperationsUploads'
import ArtworkReviewCard from '../../features/operations/uploads/ArtworkReviewCard'
import { useLiveToast } from '../../features/live-feedback'
import { ReportPreviewPanel, buildArtworkReviewReport, buildPrepressCheckReport } from '../../features/reporting'

/**
 * Editable Zone: ADMIN_UPLOAD_REVIEW
 * Content: src/features/operations/mock/operationsMockData.ts
 * Visual component: src/admin/pages/UploadsPage.tsx
 * Artwork system:
 * - ARTWORK_PREVIEW_CANVAS
 * - ARTWORK_VALIDATION_RULES
 * - ARTWORK_RECOMMENDATIONS
 */
function UploadsPage() {
  const { uploads, setUploads } = useOperationsUploads()
  const [search, setSearch] = useState('')
  const { success, warning } = useLiveToast()
  const firstUpload = uploads[0]

  const refreshUploads = async () => {
    const next = await listAdminUploads()
    setUploads((current) =>
      next.map((upload) => {
        const currentUpload = current.find((item) => item.id === upload.id)
        return currentUpload
          ? {
              ...currentUpload,
              ...upload,
            }
          : ({
              ...upload,
              productType: 'dtf',
              artworkStatus: 'pending_review',
              operator: { id: 'operator-generic', name: 'Equipo Ridaos', role: 'Revision' },
              validationState: upload.status === 'needs_fix' ? 'blocked' : upload.status === 'pending' ? 'warning' : 'ready',
            } as OperationsUploadRecord)
      }),
    )
  }

  const filteredUploads = uploads.filter((upload) => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return true
    }

    return (
      upload.fileName.toLowerCase().includes(query) ||
      upload.customer.toLowerCase().includes(query) ||
      upload.orderId.toLowerCase().includes(query)
    )
  })

  return (
    <AdminShell
      description="Mesa de artwork con metadata, estados de validacion y acceso rapido al pedido."
      title="Revision de archivos"
    >
      <AdminSection
        description="Cada tarjeta resume metadata, operador, vista previa y estado de validacion."
        title="Archivos recibidos"
        actions={<AdminSearchInput onChange={setSearch} value={search} />}
      >
        {filteredUploads.length === 0 ? (
          <EmptyAdminState
            description="Los archivos vinculados a pedidos apareceran aqui cuando entren nuevos encargos."
            title="No hay uploads disponibles"
          />
        ) : (
          <div className="admin-upload-grid">
            {filteredUploads.map((upload) => (
              <ArtworkReviewCard
                key={upload.id}
                onNotesChange={async (reviewNotes) => {
                  await updateAdminUploadNotes(upload.id, reviewNotes)
                  await refreshUploads()
                  success('Notas guardadas', 'La revision del archivo ya refleja tu comentario.')
                }}
                onStatusChange={async (status) => {
                  await updateAdminUploadStatus(upload.id, status)
                  await refreshUploads()
                  if (status === 'approved') {
                    success('Archivo aprobado', 'El pedido ya puede seguir hacia produccion.')
                    return
                  }

                  if (status === 'needs_fix') {
                    warning('Correccion solicitada', 'El cliente ya queda pendiente de una nueva version del archivo.')
                    return
                  }

                  success('Estado actualizado', 'La cola de revision ya refleja el nuevo estado.')
                }}
                upload={upload}
              />
            ))}
          </div>
        )}
      </AdminSection>

      {firstUpload ? (
        <div className="admin-two-column">
          <AdminSection
            description="Exportacion de la ficha de revision del primer archivo activo."
            title="Artwork review report"
          >
            <ReportPreviewPanel report={buildArtworkReviewReport(firstUpload)} title="REPORT_EXPORTS" />
          </AdminSection>
          <AdminSection
            description="Reporte tecnico de prepress, score y checks clave del upload seleccionado."
            title="Prepress check report"
          >
            <ReportPreviewPanel report={buildPrepressCheckReport(firstUpload)} title="REPORT_PREPRESS_CHECKS" />
          </AdminSection>
        </div>
      ) : null}
    </AdminShell>
  )
}

export default UploadsPage
