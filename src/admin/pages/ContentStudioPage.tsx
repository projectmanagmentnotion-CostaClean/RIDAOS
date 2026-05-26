import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import AdminFilterBar from '../components/AdminFilterBar'
import AdminSearchInput from '../components/AdminSearchInput'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import AdminShell from '../layouts/AdminShell'
import { CmsFieldEditor } from '../../features/cms/components/CmsFieldEditor'
import { CmsJsonEditor } from '../../features/cms/components/CmsJsonEditor'
import { CmsStudioSummary } from '../../features/cms/components/CmsStudioSummary'
import { CmsZoneList } from '../../features/cms/components/CmsZoneList'
import { useContentStudio } from '../../features/cms/hooks/useContentStudio'
import type { CmsDocumentType } from '../../features/cms/types/cms'
import AdminApprovalChainsPanel from '../../features/admin-accounts/components/AdminApprovalChainsPanel'
import { approvalChainBlueprints } from '../../features/admin-accounts/mock/adminAccountsMockData'
import { useCmsPreview } from '../../features/cms-preview'
import { useLiveToast } from '../../features/live-feedback'

const filterOptions: Array<{ value: CmsDocumentType | 'all'; label: string }> = [
  { value: 'all', label: 'Todo' },
  { value: 'section', label: 'Seccion' },
  { value: 'data', label: 'Datos' },
  { value: 'config', label: 'Configuracion' },
  { value: 'page', label: 'Pagina' },
  { value: 'admin', label: 'Administracion' },
  { value: 'commerce', label: 'Comercio' },
  { value: 'motion', label: 'Movimiento' },
]

/**
 * Editable Zone: ADMIN_CONTENT_STUDIO
 * Content: src/config/siteMap.ts
 * Visual component: src/admin/pages/ContentStudioPage.tsx
 */
function ContentStudioPage() {
  const { enabled: previewEnabled, setEnabled: setPreviewEnabled } = useCmsPreview()
  const { confirm, error: toastError, success } = useLiveToast()
  const {
    allZones,
    zones,
    documents,
    search,
    filter,
    selectedZoneId,
    selectedZone,
    selectedDocument,
    draftPayload,
    rawJson,
    statusMessage,
    isLoading,
    hasUnsavedChanges,
    setSearch,
    setFilter,
    setSelectedZoneId,
    setDraftPayload,
    setRawJson,
    saveDocument,
    resetDocument,
    resetAll,
    exportSnapshot,
    importSnapshot,
    applyRawJson,
  } = useContentStudio()

  const importRef = useRef<HTMLInputElement | null>(null)
  const [localError, setLocalError] = useState('')

  const modifiedZones = useMemo(() => allZones.filter((zone) => zone.status === 'modified').length, [allZones])

  const handleSave = async () => {
    setLocalError('')
    try {
      await saveDocument()
      success('Cambios guardados', 'La copia local ya refleja la ultima version del contenido.')
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'No se pudo guardar el documento.')
      toastError('No se pudo guardar', 'Revisa el contenido antes de intentarlo otra vez.')
    }
  }

  const handleReset = async () => {
    setLocalError('')
    confirm({
      title: 'Restablecer documento',
      description: 'Volveras a la version base de esta zona editable.',
      cancelLabel: 'Seguir editando',
      confirm: { label: 'Restablecer', intent: 'danger' },
      intent: 'danger',
      onConfirm: async () => {
        try {
          await resetDocument()
          success('Documento restablecido', 'La zona vuelve a su version base local.')
        } catch (error) {
          setLocalError(error instanceof Error ? error.message : 'No se pudo resetear el documento.')
        }
      },
    })
  }

  const handleResetAll = async () => {
    setLocalError('')
    confirm({
      title: 'Reiniciar el estudio',
      description: 'Se eliminaran todos los overrides guardados en este entorno local.',
      cancelLabel: 'Cancelar',
      confirm: { label: 'Reiniciar todo', intent: 'danger' },
      intent: 'danger',
      onConfirm: async () => {
        try {
          await resetAll()
          success('Estudio reiniciado', 'Los cambios locales se han limpiado.')
        } catch (error) {
          setLocalError(error instanceof Error ? error.message : 'No se pudo reiniciar la copia local.')
        }
      },
    })
  }

  const handleExport = async () => {
    setLocalError('')
    try {
      await exportSnapshot()
      success('Respaldo exportado', 'Ya tienes una copia local del estado actual del estudio.')
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'No se pudo exportar el respaldo.')
    }
  }

  const handleApplyJson = () => {
    setLocalError('')
    try {
      applyRawJson()
      success('JSON aplicado', 'El documento ya refleja la nueva estructura cargada.')
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'El JSON no es valido.')
    }
  }

  const handleImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setLocalError('')

    try {
      await importSnapshot(file)
      success('Respaldo importado', 'El estudio ya refleja el contenido del archivo cargado.')
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'No se pudo importar el respaldo.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <AdminShell
      description="Editor interno de contenido para revisar zonas, pricing, catalogo, motion y contenido desde una copia local."
      title="Estudio de contenido"
    >
      <CmsStudioSummary modifiedZones={modifiedZones} totalDocuments={documents.length} totalZones={allZones.length} />

      <div className="admin-overview-strip cms-studio-strip">
        <article className="content-card admin-overview-card cms-studio-banner">
          <p className="section-label">Edicion local</p>
          <h3>Este panel no escribe en disco ni toca el storefront en vivo.</h3>
          <p>Guarda respaldos locales y mantiene el contenido de trabajo separado del storefront publicado.</p>
          <div className="catalog-card-actions cms-preview-actions">
            <span className={`status-badge ${previewEnabled ? 'status-info' : 'status-muted'}`}>
              Vista previa {previewEnabled ? 'activo' : 'inactivo'}
            </span>
            <button
              className="action-button action-button-muted"
              onClick={() => {
                setPreviewEnabled(true)
                success('Vista previa activada', 'La navegacion publica ya puede leer los cambios guardados localmente.', 2200)
              }}
              type="button"
            >
              Activar vista previa
            </button>
            <button
              className="action-button action-button-muted"
              onClick={() => {
                setPreviewEnabled(false)
                success('Vista previa desactivada', 'La web vuelve a la version base visible.', 2200)
              }}
              type="button"
            >
              Desactivar vista previa
            </button>
            <a className="action-button action-link-button" href="?cmsPreview=1#/">
              Abrir home en vista previa
            </a>
          </div>
        </article>
        <article className="content-card admin-overview-card cms-studio-banner">
          <p className="section-label">Siguiente capa</p>
          <h3>Contrato listo para una capa de contenido conectada.</h3>
          <p>La UI trabaja contra un repositorio desacoplado, no contra componentes ni archivos fuente.</p>
        </article>
      </div>

      <AdminSection
        actions={
          <div className="catalog-card-actions cms-studio-actions">
            <button className="action-button action-button-muted" onClick={handleExport} type="button">
              Exportar respaldo
            </button>
            <button className="action-button action-button-muted" onClick={() => importRef.current?.click()} type="button">
              Importar respaldo
            </button>
            <button className="action-button action-button-muted" onClick={handleResetAll} type="button">
              Reiniciar todo
            </button>
            <input accept="application/json" className="sr-only" onChange={handleImportChange} ref={importRef} type="file" />
          </div>
        }
        description="Filtra por tipo de zona, busca por ID y abre el documento asociado."
        title="Zonas editables"
      >
        <AdminFilterBar>
          <AdminSearchInput label="Buscar zona editable" onChange={setSearch} value={search} />
          <div className="cms-filter-chips" role="group" aria-label="Filtrar zonas">
            {filterOptions.map((option) => (
              <button
                className={`status-badge cms-filter-chip${filter === option.value ? ' is-active' : ''}`}
                key={option.value}
                onClick={() => setFilter(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </AdminFilterBar>

        {isLoading ? (
          <EmptyAdminState description="Cargando documentos y zonas de contenido." title="Preparando estudio" />
        ) : zones.length === 0 ? (
          <EmptyAdminState description="No hay zonas que coincidan con el filtro actual." title="Sin resultados" />
        ) : (
          <CmsZoneList onSelect={setSelectedZoneId} selectedZoneId={selectedZoneId} zones={zones} />
        )}
      </AdminSection>

      <div className="admin-two-column cms-studio-layout">
        <AdminSection
          actions={
            selectedDocument ? (
              <div className="catalog-card-actions">
                <button className="action-button" disabled={!hasUnsavedChanges} onClick={handleSave} type="button">
                  Guardar cambios
                </button>
                <button className="action-button action-button-muted" onClick={handleReset} type="button">
                  Restablecer documento
                </button>
              </div>
            ) : null
          }
          description="Editor visual del documento asociado a la zona seleccionada."
          title={selectedZone ? selectedZone.label : 'Documento'}
        >
          {!selectedZone || !selectedDocument ? (
            <EmptyAdminState
              description="Selecciona una zona editable para abrir el documento asociado."
              title="Sin documento activo"
            />
          ) : (
            <div className="cms-document-editor">
              <article className="content-card cms-zone-meta">
                <div className="cms-zone-meta__grid">
                  <div>
                    <p className="section-label">Zona</p>
                    <strong>{selectedZone.id}</strong>
                  </div>
                  <div>
                    <p className="section-label">Tipo</p>
                    <strong>{selectedZone.type}</strong>
                  </div>
                  <div>
                    <p className="section-label">Estado</p>
                    <strong>{selectedZone.status === 'modified' ? 'Editado localmente' : 'Version base'}</strong>
                  </div>
                  <div>
                    <p className="section-label">Actualizado</p>
                    <strong>{selectedDocument.updatedAt ? new Date(selectedDocument.updatedAt).toLocaleString('es-ES') : 'Sin cambios guardados'}</strong>
                  </div>
                </div>
                <ul className="hint-list">
                  <li>Archivo visual: {selectedZone.filePath}</li>
                  <li>Contenido editable: {selectedZone.editableContentPath ?? selectedZone.filePath}</li>
                  <li>Documento CMS: {selectedDocument.sourcePath}</li>
                </ul>
              </article>

              <article className="content-card cms-document-form">
                <div className="cms-document-form__head">
                  <div>
                    <p className="section-label">Editor de campos</p>
                    <h3>{selectedDocument.label}</h3>
                    <p>{selectedDocument.description}</p>
                  </div>
                  <span className={`status-badge ${hasUnsavedChanges ? 'status-warning' : 'status-muted'}`}>
                    {hasUnsavedChanges ? 'Cambios pendientes' : 'Sin cambios'}
                  </span>
                </div>
                <CmsFieldEditor label="Contenido" onChange={setDraftPayload} value={draftPayload} />
              </article>

              <CmsJsonEditor onApply={handleApplyJson} onChange={setRawJson} value={rawJson} />
            </div>
          )}
        </AdminSection>

        <AdminSection
          description="Estado del estudio, resumen del repositorio activo y ayudas para el siguiente paso."
          title="Estado y contrato"
        >
          <div className="admin-list-card cms-status-stack">
            <article className="admin-list-row">
              <div>
                <strong>Repositorio activo</strong>
                <p>Repositorio local de contenido</p>
              </div>
              <div className="admin-list-row-meta">
                <span className="status-badge status-info">Local</span>
              </div>
            </article>
            <article className="admin-list-row">
              <div>
                <strong>Contrato futuro</strong>
                <p>Repositorio conectado futuro</p>
              </div>
              <div className="admin-list-row-meta">
                <span className="status-badge status-muted">Reservado</span>
              </div>
            </article>
            <article className="admin-list-row">
              <div>
                <strong>Mensaje del estudio</strong>
                <p>{statusMessage}</p>
              </div>
            </article>
            {localError ? (
              <article className="admin-list-row">
                <div>
                  <strong>Error</strong>
                  <p>{localError}</p>
                </div>
              </article>
            ) : null}
            <article className="content-card cms-status-note">
              <p className="section-label">Que edita</p>
              <ul className="hint-list">
                <li>Contenido de home, nav, footer, banners y FAQ.</li>
                <li>Pricing, catalogo editable y experiencia de producto.</li>
                <li>Escenas cinematicas y contenido interno.</li>
              </ul>
            </article>
            <article className="content-card cms-status-note">
              <p className="section-label">Limites actuales</p>
              <ul className="hint-list">
                <li>No aplica cambios al storefront en vivo.</li>
                <li>No escribe archivos fuente ni publica cambios automaticamente.</li>
                <li>No sustituye permisos, revisiones ni repositorios conectados.</li>
              </ul>
            </article>
            <article className="content-card cms-status-note">
              <p className="section-label">Publicacion de contenido</p>
              <p>La publicacion de contenido sigue un flujo de aprobacion visual antes de consolidar cambios.</p>
              <AdminApprovalChainsPanel
                chains={[
                  {
                    ...approvalChainBlueprints.content_publish_mock,
                    steps: [
                      {
                        id: 'content-publish-admin',
                        label: 'Validacion editorial',
                        requiredRole: 'admin',
                        assignedUserId: 'user-admin-marco',
                        status: 'active',
                        notes: 'Revisar copy, CTA y consistencia del respaldo antes de publicar.',
                        timestamp: new Date().toISOString(),
                      },
                    ],
                  },
                ]}
              />
            </article>
          </div>
        </AdminSection>
      </div>
    </AdminShell>
  )
}

export default ContentStudioPage

