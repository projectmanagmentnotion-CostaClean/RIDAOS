import { publicRoutes } from '../lib/navigation'
import { useMemo } from 'react'
import { useOrderStore } from '../store/useOrderStore'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))

function MisPedidos() {
  const orders = useOrderStore((state) => state.orders)
  const sortedOrders = useMemo(
    () => [...orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [orders],
  )

  return (
    <section className="page account-page">
      <div className="page-hero account-hero">
        <p className="eyebrow">Pedidos</p>
        <h1>Seguimiento del trabajo en curso y del historico reciente.</h1>
        <p>
          Consulta el estado, la fecha y el importe de tus pedidos en un solo vistazo.
        </p>
      </div>

      <div className="account-dashboard-grid order-grid">
        {sortedOrders.map((order) => (
          <article className="content-card order-card" key={order.id}>
            <div className="order-card-head">
              <div>
                <p className="section-label">{order.id}</p>
                <h3>{order.items[0]?.productName ?? 'Pedido'}</h3>
              </div>
              <span className={`status-badge status-${order.status}`}>{order.status}</span>
            </div>
            <div className="order-meta-grid">
              <p>Fecha: {formatDate(order.createdAt)}</p>
              <p>Total: {formatCurrency(order.total)}</p>
            </div>
            <a className="action-button action-link-button" href={publicRoutes.detallePedido}>
              Ver pedido
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MisPedidos
