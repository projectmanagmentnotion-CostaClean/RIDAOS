import { useEffect, useState } from 'react'
import { getArtworkHistory } from '../services/uploadService'
import { useUIStore } from '../store/useUIStore'
import type { ArtworkUpload } from '../types/backend'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))

function HistorialArchivos() {
  const [files, setFiles] = useState<ArtworkUpload[]>([])
  const loading = useUIStore((state) => state.loadingScopes.files ?? false)
  const uiError = useUIStore((state) => state.errorScopes.files)
  const setLoading = useUIStore((state) => state.setLoading)
  const setError = useUIStore((state) => state.setError)
  const clearError = useUIStore((state) => state.clearError)

  useEffect(() => {
    const loadFiles = async () => {
      setLoading('files', true)
      clearError('files')

      try {
        const uploads = await getArtworkHistory()
        setFiles(uploads)
      } catch {
        setError('files', 'No se pudo cargar el historial de archivos.')
      } finally {
        setLoading('files', false)
      }
    }

    void loadFiles()
  }, [clearError, setError, setLoading])

  return (
    <section className="page account-page">
      <div className="page-hero account-hero">
        <p className="eyebrow">Historial de archivos</p>
        <h1>Repositorio visual mock para arte vinculado a pedidos.</h1>
        <p>
          Este modulo ya lee archivos vinculados a pedidos estructurados para que la capa real solo cambie el origen de datos.
        </p>
      </div>

      {loading ? <p className="inline-notice">Cargando historial de archivos...</p> : null}
      {uiError ? <p className="field-error">{uiError}</p> : null}

      <div className="file-history-list">
        {files.map((file) => (
          <article className="content-card file-history-card" key={file.id}>
            <div className="file-history-head">
              <div>
                <p className="section-label">{file.formatLabel}</p>
                <h3>{file.fileName}</h3>
              </div>
              <span className={`status-badge status-${file.status}`}>{file.status}</span>
            </div>
            <div className="file-history-grid">
              <p>Subida: {formatDate(file.uploadedAt)}</p>
              <p>Pedido: {file.orderId || 'Pendiente'}</p>
              <p>Estado: {file.status}</p>
            </div>
            <a className="card-link" href="#/mi-cuenta/pedidos/demo">
              Ver pedido relacionado
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HistorialArchivos
