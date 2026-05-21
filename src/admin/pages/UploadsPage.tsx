import { useState } from 'react'
import AdminSearchInput from '../components/AdminSearchInput'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import AdminShell from '../layouts/AdminShell'
import { listAdminUploads, updateAdminUploadNotes, updateAdminUploadStatus } from '../services/orderAdminService'
import type { OperationsUploadRecord } from '../../features/operations/types/operations'
import { useOperationsUploads } from '../../features/operations/hooks/useOperationsUploads'
import ArtworkReviewCard from '../../features/operations/uploads/ArtworkReviewCard'

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
      description="Mesa de artwork mock con metadata, estados de validacion y acceso rapido al pedido."
      title="Artwork review"
    >
      <AdminSection
        description="Cada tarjeta resume metadata, operador, preview mock y estado de validacion."
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
                }}
                onStatusChange={async (status) => {
                  await updateAdminUploadStatus(upload.id, status)
                  await refreshUploads()
                }}
                upload={upload}
              />
            ))}
          </div>
        )}
      </AdminSection>
    </AdminShell>
  )
}

export default UploadsPage
