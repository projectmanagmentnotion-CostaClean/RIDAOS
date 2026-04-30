const queue = [
  {
    name: 'drop-mayo-espalda.png',
    type: 'PNG',
    order: 'RP-24031',
    uploaded: '2026-04-22',
    status: 'pending_review',
  },
  {
    name: 'lonas-feria-principal.pdf',
    type: 'PDF',
    order: 'RP-24018',
    uploaded: '2026-04-18',
    status: 'approved',
  },
  {
    name: 'vinilo-escaparate-baja.ai',
    type: 'AI',
    order: 'RP-24007',
    uploaded: '2026-04-15',
    status: 'rejected',
  },
  {
    name: 'flota-lateral-final.eps',
    type: 'EPS',
    order: 'RP-23970',
    uploaded: '2026-04-04',
    status: 'ready',
  },
]

function AdminArchivos() {
  return (
    <section className="page admin-page">
      <div className="page-hero admin-hero">
        <p className="eyebrow">Admin archivos</p>
        <h1>Cola de revision para artes vinculadas a pedidos y produccion.</h1>
        <p>
          Este panel organiza archivos pendientes, aprobados o rechazados para
          que el futuro backend solo tenga que alimentar la misma estructura.
        </p>
      </div>

      <div className="admin-file-queue">
        {queue.map((file) => (
          <article className="content-card admin-file-card" key={file.name}>
            <div className="file-history-head">
              <div>
                <p className="section-label">{file.type}</p>
                <h3>{file.name}</h3>
              </div>
              <span className={`status-badge status-${file.status}`}>{file.status}</span>
            </div>
            <div className="file-history-grid">
              <p>Pedido: {file.order}</p>
              <p>Subida: {file.uploaded}</p>
              <p>Produccion: {file.status}</p>
            </div>
            <div className="catalog-card-actions">
              <a className="action-button action-link-button" href="#/admin/pedidos/demo">
                Revisar pedido
              </a>
              <a className="card-link" href="#/admin/pedidos">
                Ver tablero
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminArchivos
