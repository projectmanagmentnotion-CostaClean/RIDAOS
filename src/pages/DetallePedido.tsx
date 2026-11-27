import { useMemo } from 'react'
import { OrderLifecycleTimeline } from '../features/orders/components/OrderLifecycleTimeline'
import { getMockLifecycleLabel } from '../features/orders/utils/orderLifecycle'
import { publicRoutes } from '../lib/navigation'
import { getOrderItemSummary } from '../lib/products'
import { useOrderStore } from '../store/useOrderStore'
import { dtiCustomerStatusLabels, useDtiGuestOrder } from '../features/dtf/useDtiGuestOrder'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

function DetallePedido() {
  const dti = useDtiGuestOrder()
  const orders = useOrderStore((state) => state.orders)
  const order = useMemo(
    () => [...orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0],
    [orders],
  )

  if (dti.access) {
    const remoteOrder = dti.order?.order
    return <section className="page account-page">
      <div className="page-hero account-hero"><p className="eyebrow">Seguimiento DTI</p><h1>Estado del pedido y del archivo.</h1>
        <p>Consulta la información actual del pedido guardada en este dispositivo.</p></div>
      <article className="content-card" aria-live="polite">
        <p className="section-label">Pedido {remoteOrder?.id ?? dti.access.orderId}</p>
        {dti.loading && !remoteOrder ? <p>Consultando estado…</p> : null}
        {dti.error ? <p className="field-error" role="alert">{dti.error}</p> : null}
        {remoteOrder ? <div className="summary-list">
          <div className="summary-row"><span>Producto</span><strong>DTI Innuro · {remoteOrder.meters} m · {remoteOrder.usefulWidthMm / 10} cm</strong></div>
          <div className="summary-row"><span>Estado</span><strong>{dtiCustomerStatusLabels[remoteOrder.status] ?? remoteOrder.status}</strong></div>
          <div className="summary-row"><span>Pago</span><strong>{remoteOrder.paymentStatus === 'paid' ? 'Confirmado por Stripe' : 'Pendiente de confirmación'}</strong></div>
          <div className="summary-row"><span>Total</span><strong>{formatCurrency(remoteOrder.totalCents / 100)}</strong></div>
          <div className="summary-row"><span>Entrega</span><strong>{remoteOrder.shippingMethod === 'pickup' ? 'Recogida en Barcelona' : 'Envío peninsular'}</strong></div>
          {remoteOrder.trackingReference ? <div className="summary-row"><span>Referencia de transporte</span><strong>{remoteOrder.trackingReference}</strong></div> : null}
          {remoteOrder.estimatedDispatchDate ? <div className="summary-row"><span>Despacho estimado</span><strong>{remoteOrder.estimatedDispatchDate}</strong></div> : null}
          {dti.order?.latestArtwork ? <div className="summary-row"><span>Archivo</span><strong>{dti.order.latestArtwork.fileName} · {dti.order.latestArtwork.validation}</strong></div> : null}
        </div> : null}
        <div className="form-actions"><button className="action-button action-button-muted" disabled={dti.loading} onClick={() => void dti.refresh()} type="button">{dti.loading ? 'Actualizando…' : 'Actualizar estado'}</button></div>
      </article>
      <p className="inline-notice" role="note">El seguimiento es real para este pedido DTI. El acceso de invitado está guardado solo en esta sesión del navegador.</p>
    </section>
  }

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
  return (
    <section className="page account-page">
      <div className="page-hero account-hero">
        <p className="eyebrow">Detalle de pedido</p>
        <h1>Vista completa del pedido y su estado actual.</h1>
        <p>
          Esta ficha prioriza estado, configuracion y archivo vinculado para que tengas una lectura clara del pedido.
        </p>
      </div>

      <p className="inline-notice" role="note">
        Datos de demostración: esta ficha, su archivo y su estado son ejemplos locales; no representan un pedido real ni autorizan producción o cobro.
      </p>

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
              <strong>{getMockLifecycleLabel(order.status)}</strong>
            </div>
            <div className="summary-row summary-row-total">
              <span>Estado de pago</span>
              <strong>Se confirmara en el siguiente paso</strong>
            </div>
          </div>
          <div className="form-actions">
            <button className="action-button" disabled type="button">
              Pagar pedido
            </button>
            <a className="action-button action-button-muted action-link-button" href={publicRoutes.contacto}>
              Contactar
            </a>
          </div>
        </article>

        <article className="content-card premium-file-panel">
          <p className="section-label">Archivo vinculado</p>
          <div className="premium-file-card">
            <span className="premium-file-format">{item.artwork.formatLabel}</span>
            <h3>{item.artwork.fileName}</h3>
            <p>{item.artwork.notes || 'Archivo principal asociado al pedido para su comprobacion tecnica.'}</p>
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
        <OrderLifecycleTimeline status={order.status} />
      </article>
    </section>
  )
}

export default DetallePedido
