type CmsStudioSummaryProps = {
  totalZones: number
  modifiedZones: number
  totalDocuments: number
}

export function CmsStudioSummary({ totalZones, modifiedZones, totalDocuments }: CmsStudioSummaryProps) {
  return (
    <div className="admin-stat-grid cms-studio-summary">
      <article className="content-card admin-stat-card">
        <span className="section-label">Zonas</span>
        <strong>{totalZones}</strong>
        <p>IDs disponibles en el mapa maestro.</p>
      </article>
      <article className="content-card admin-stat-card">
        <span className="section-label">Editado local</span>
        <strong>{modifiedZones}</strong>
        <p>Zonas ligadas a documentos con override en localStorage.</p>
      </article>
      <article className="content-card admin-stat-card">
        <span className="section-label">Documentos</span>
        <strong>{totalDocuments}</strong>
        <p>Fuentes agrupadas para contenido, pricing, catalogo, motion y admin.</p>
      </article>
    </div>
  )
}
