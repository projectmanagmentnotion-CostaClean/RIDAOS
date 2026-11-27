import { publicRoutes } from '../lib/navigation'
import { getMockLifecycleLabel } from '../features/orders/utils/orderLifecycle'
import { useMemo } from 'react'
import { useOrderStore } from '../store/useOrderStore'
import { dtiCustomerStatusLabels, useDtiGuestOrder } from '../features/dtf/useDtiGuestOrder'

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
  const dti = useDtiGuestOrder()

  return (
    <section className="page account-page">
      <div className="page-hero account-hero">
        <p className="eyebrow">Pedidos</p>
        <h1>Seguimiento del trabajo en curso y del historico reciente.</h1>
        <p>
          Consulta el estado, la fecha y el importe de tus pedidos en un solo vistazo.
        </p>
      </div>

      {dti.access ? <article className="content-card order-card" aria-live="polite">
        <div className="order-card-head"><div>
          <p className="section-label">Seguimiento DTI conectado</p>
          <h3>{dti.order?.order.id ?? dti.access.orderId}</h3>
        </div><span className="status-badge">{dti.order ? dtiCustomerStatusLabels[dti.order.order.status] ?? dti.order.order.status : dti.loading ? 'Consultando' : 'No disponible'}</span></div>
        {dti.order ? <div className="order-meta-grid">
          <p>DTI Innuro · {dti.order.order.meters} m · ancho útil {dti.order.order.usefulWidthMm / 10} cm</p>
          <p>Pago: {dti.order.order.paymentStatus === 'paid' ? 'Confirmado' : 'Pendiente de confirmación'}</p>
          <p>Total: {formatCurrency(dti.order.order.totalCents / 100)}</p>
          <p>Entrega: {dti.order.order.shippingMethod === 'pickup' ? 'Recogida en Ridaos Print BCN' : 'Envío peninsular'}</p>
          {dti.order.order.trackingReference ? <p>Seguimiento: {dti.order.order.trackingReference}</p> : null}
          {dti.order.order.estimatedDispatchDate ? <p>Despacho estimado: {dti.order.order.estimatedDispatchDate}</p> : null}
        </div> : null}
        {dti.error ? <p className="field-error" role="alert">{dti.error}</p> : null}
        <div className="form-actions">
          <button className="action-button action-button-muted" disabled={dti.loading} onClick={() => void dti.refresh()} type="button">{dti.loading ? 'Actualizando…' : 'Actualizar estado'}</button>
          <a className="action-button action-link-button" href={publicRoutes.detallePedido}>Ver detalle DTI</a>
        </div>
      </article> : null}

      <p className="inline-notice" role="note">
        Los pedidos locales que aparecen a continuación son solo demostraciones; no representan operaciones reales.
      </p>

      <div className="account-dashboard-grid order-grid">
        {sortedOrders.map((order) => (
          <article className="content-card order-card" key={order.id}>
            <div className="order-card-head">
              <div>
                <p className="section-label">{order.id}</p>
                <h3>{order.items[0]?.productName ?? 'Pedido'}</h3>
              </div>
              <span className={`status-badge status-${order.status}`}>{getMockLifecycleLabel(order.status)}</span>
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
