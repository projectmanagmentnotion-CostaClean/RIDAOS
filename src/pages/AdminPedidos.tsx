const orders = [
  {
    number: 'RP-24031',
    product: 'DTF por metro',
    date: '2026-04-22',
    total: '68,30 EUR',
    status: 'pending_review',
  },
  {
    number: 'RP-24018',
    product: 'Lonas publicitarias',
    date: '2026-04-18',
    total: '245,00 EUR',
    status: 'approved',
  },
  {
    number: 'RP-24007',
    product: 'Vinilos decorativos',
    date: '2026-04-15',
    total: '124,00 EUR',
    status: 'rejected',
  },
  {
    number: 'RP-23994',
    product: 'Textil personalizado',
    date: '2026-04-11',
    total: '182,50 EUR',
    status: 'in_production',
  },
  {
    number: 'RP-23970',
    product: 'Rotulacion de vehiculos',
    date: '2026-04-04',
    total: '540,00 EUR',
    status: 'ready',
  },
  {
    number: 'RP-23921',
    product: 'Pegatinas personalizadas',
    date: '2026-03-27',
    total: '96,00 EUR',
    status: 'completed',
  },
]

function AdminPedidos() {
  return (
    <section className="page admin-page">
      <div className="page-hero admin-hero">
        <p className="eyebrow">Admin pedidos</p>
        <h1>Board operativo para revisar y mover pedidos sin backend.</h1>
        <p>
          La pantalla centraliza estados consistentes para el equipo interno y
          deja una lectura clara antes de conectar datos reales.
        </p>
      </div>

      <div className="admin-order-grid">
        {orders.map((order) => (
          <article className="content-card order-card admin-order-card" key={order.number}>
            <div className="order-card-head">
              <div>
                <p className="section-label">{order.number}</p>
                <h3>{order.product}</h3>
              </div>
              <span className={`status-badge status-${order.status}`}>{order.status}</span>
            </div>
            <div className="order-meta-grid">
              <p>Fecha: {order.date}</p>
              <p>Total: {order.total}</p>
            </div>
            <div className="catalog-card-actions">
              <a className="action-button action-link-button" href="#/admin/pedidos/demo">
                Ver pedido
              </a>
              <a className="card-link" href="#/admin/archivos">
                Ir a archivos
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminPedidos
