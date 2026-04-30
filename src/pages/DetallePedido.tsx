import { useMemo } from 'react'
import { getOrderItemSummary } from '../lib/products'
import { useOrderStore } from '../store/useOrderStore'

const timeline = [
  'Pedido recibido',
  'Archivo en revision',
  'Archivo aprobado',
  'En produccion',
  'Listo para recoger/enviar',
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

function DetallePedido() {
  const orders = useOrderStore((state) => state.orders)
  const order = useMemo(
    () => [...orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0],
    [orders],
  )

  if (!order || order.items.length === 0) {
    return (
      <section className="page account-page">
        <div className="page-hero account-hero">
          <p className="eyebrow">Detalle de pedido</p>
          <h1>No hay pedidos disponibles todavia.</h1>
        </div>
      </section>
    )
  }

  const item = order.items[0]
  const completeSteps =
    order.status === 'pending_review'
      ? 2
      : order.status === 'approved'
        ? 3
        : order.status === 'in_production'
          ? 4
          : order.status === 'ready' || order.status === 'completed'
            ? 5
            : 2

  return (
    <section className="page account-page">
      <div className="page-hero account-hero">
        <p className="eyebrow">Detalle de pedido</p>
        <h1>Vista completa del pedido y su avance interno.</h1>
        <p>
          Esta ficha prioriza estado, configuracion y archivo vinculado para que el cliente tenga una lectura directa antes de activar pago o revision real.
        </p>
      </div>

      <div className="split-grid account-layout">
        <article className="content-card">
          <p className="section-label">Pedido {order.id}</p>
          <div className="summary-list">
            <div className="summary-row">
              <span>Producto</span>
              <strong>{item.productName}</strong>
            </div>
            {getOrderItemSummary(item).map((line) => (
              <div className="summary-row" key={`${order.id}-${line}`}>
                <span>Configuracion</span>
                <strong>{line}</strong>
              </div>
            ))}
            <div className="summary-row">
              <span>Estado</span>
              <strong>{order.status}</strong>
            </div>
            <div className="summary-row summary-row-total">
              <span>Estado de pago</span>
              <strong>Pendiente de activar</strong>
            </div>
          </div>
          <div className="form-actions">
            <button className="action-button" disabled type="button">
              Pagar pedido
            </button>
          </div>
        </article>

        <article className="content-card premium-file-panel">
          <p className="section-label">Archivo vinculado</p>
          <div className="premium-file-card">
            <span className="premium-file-format">{item.artwork.formatLabel}</span>
            <h3>{item.artwork.fileName}</h3>
            <p>{item.artwork.notes || 'Archivo principal asociado al pedido para revision y aprobacion tecnica.'}</p>
          </div>
          <div className="summary-list">
            <div className="summary-row">
              <span>Tipo</span>
              <strong>{item.artwork.fileType || item.artwork.formatLabel}</strong>
            </div>
            <div className="summary-row">
              <span>Total</span>
              <strong>{formatCurrency(order.total)}</strong>
            </div>
            <div className="summary-row summary-row-total">
              <span>Pago</span>
              <strong>{order.paymentStatus}</strong>
            </div>
          </div>
        </article>
      </div>

      <article className="content-card timeline-card">
        <p className="section-label">Timeline del pedido</p>
        <div className="order-timeline">
          {timeline.map((step, index) => (
            <div className="timeline-step" key={step}>
              <div className={`timeline-marker${index < completeSteps ? ' is-complete' : ''}`} />
              <div>
                <h3>{step}</h3>
                <p>
                  {index < completeSteps
                    ? 'Paso registrado en esta simulacion del area cliente.'
                    : 'Pendiente de actualizar cuando el pedido avance en produccion.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default DetallePedido
