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

const filterOptions: Array<{ value: CmsDocumentType | 'all'; label: string }> = [
  { value: 'all', label: 'Todo' },
  { value: 'section', label: 'Section' },
  { value: 'data', label: 'Data' },
  { value: 'config', label: 'Config' },
  { value: 'page', label: 'Page' },
  { value: 'admin', label: 'Admin' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'motion', label: 'Motion' },
]

/**
 * Editable Zone: ADMIN_CONTENT_STUDIO
 * Content: src/config/siteMap.ts
 * Visual component: src/admin/pages/ContentStudioPage.tsx
 */
function ContentStudioPage() {
  const { enabled: previewEnabled, setEnabled: setPreviewEnabled } = useCmsPreview()
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
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'No se pudo guardar el documento mock.')
    }
  }

  const handleReset = async () => {
    setLocalError('')
    try {
      await resetDocument()
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'No se pudo resetear el documento.')
    }
  }

  const handleResetAll = async () => {
    setLocalError('')
    try {
      await resetAll()
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'No se pudo resetear el snapshot mock.')
    }
  }

  const handleExport = async () => {
    setLocalError('')
    try {
      await exportSnapshot()
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'No se pudo exportar el snapshot mock.')
    }
  }

  const handleApplyJson = () => {
    setLocalError('')
    try {
      applyRawJson()
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
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'No se pudo importar el snapshot.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <AdminShell
      description="CMS interno mock/localStorage para simular edicion de zonas, pricing, catalogo, motion y contenido antes de conectar datos reales."
      title="Content Studio"
    >
      <CmsStudioSummary modifiedZones={modifiedZones} totalDocuments={documents.length} totalZones={allZones.length} />

      <div className="admin-overview-strip cms-studio-strip">
        <article className="content-card admin-overview-card cms-studio-banner">
          <p className="section-label">Mock / local only</p>
          <h3>Este panel no escribe en disco ni toca el storefront en vivo.</h3>
          <p>Guarda snapshots mock en localStorage y prepara la futura capa de repositorio real sin activar Supabase.</p>
          <div className="catalog-card-actions cms-preview-actions">
            <span className={`status-badge ${previewEnabled ? 'status-info' : 'status-muted'}`}>
              Preview {previewEnabled ? 'activo' : 'inactivo'}
            </span>
            <button
              className="action-button action-button-muted"
              onClick={() => setPreviewEnabled(true)}
              type="button"
            >
              Activar preview
            </button>
            <button
              className="action-button action-button-muted"
              onClick={() => setPreviewEnabled(false)}
              type="button"
            >
              Desactivar preview
            </button>
            <a className="action-button action-link-button" href="?cmsPreview=1#/">
              Abrir home en preview
            </a>
          </div>
        </article>
        <article className="content-card admin-overview-card cms-studio-banner">
          <p className="section-label">Seam futuro</p>
          <h3>Contrato listo para migrar a repositorio real.</h3>
          <p>La UI trabaja contra un repositorio desacoplado, no contra componentes ni archivos fuente.</p>
        </article>
      </div>

      <AdminSection
        actions={
          <div className="catalog-card-actions cms-studio-actions">
            <button className="action-button action-button-muted" onClick={handleExport} type="button">
              Exportar snapshot
            </button>
            <button className="action-button action-button-muted" onClick={() => importRef.current?.click()} type="button">
              Importar snapshot
            </button>
            <button className="action-button action-button-muted" onClick={handleResetAll} type="button">
              Reset total
            </button>
            <input accept="application/json" className="sr-only" onChange={handleImportChange} ref={importRef} type="file" />
          </div>
        }
        description="Filtra por tipo de zona, busca por ID y abre el documento mock asociado."
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
          <EmptyAdminState description="Cargando documentos y zonas del CMS mock." title="Preparando studio" />
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
                  Guardar mock
                </button>
                <button className="action-button action-button-muted" onClick={handleReset} type="button">
                  Reset documento
                </button>
              </div>
            ) : null
          }
          description="Editor visual del documento mock asociado a la zona seleccionada."
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
                    <strong>{selectedZone.status === 'modified' ? 'Mock editado' : 'Default local'}</strong>
                  </div>
                  <div>
                    <p className="section-label">Updated</p>
                    <strong>{selectedDocument.updatedAt ? new Date(selectedDocument.updatedAt).toLocaleString('es-ES') : 'Sin override'}</strong>
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
          description="Estado del studio, resumen del repositorio mock y ayudas para el siguiente paso."
          title="Estado y contrato"
        >
          <div className="admin-list-card cms-status-stack">
            <article className="admin-list-row">
              <div>
                <strong>Repositorio activo</strong>
                <p>MockContentRepository</p>
              </div>
              <div className="admin-list-row-meta">
                <span className="status-badge status-info">localStorage</span>
              </div>
            </article>
            <article className="admin-list-row">
              <div>
                <strong>Contrato futuro</strong>
                <p>FutureSupabaseContentRepository</p>
              </div>
              <div className="admin-list-row-meta">
                <span className="status-badge status-muted">placeholder</span>
              </div>
            </article>
            <article className="admin-list-row">
              <div>
                <strong>Mensaje del studio</strong>
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
                <li>Pricing mock, catalogo editable y experiencia de producto.</li>
                <li>Escenas cinematicas y contenido admin mock.</li>
              </ul>
            </article>
            <article className="content-card cms-status-note">
              <p className="section-label">Que no hace aun</p>
              <ul className="hint-list">
                <li>No aplica cambios al storefront en vivo.</li>
                <li>No escribe archivos fuente ni conecta con Supabase.</li>
                <li>No sustituye roles, auth ni storage real.</li>
              </ul>
            </article>
            <article className="content-card cms-status-note">
              <p className="section-label">Content publish mock</p>
              <p>La publicacion futura de contenido queda preparada como approval chain visual antes de conectar permisos reales.</p>
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
                        notes: 'Revisar copy, CTA y consistencia del snapshot antes de publicar.',
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
