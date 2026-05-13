import { useEffect, useMemo, useState } from 'react'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import TimelineBlock from '../components/TimelineBlock'
import AdminShell from '../layouts/AdminShell'
import { orderStatusOptions } from '../config/orderStatuses'
import {
  addAdminInternalComment,
  getAdminOrderDetail,
  saveAdminOrderNotes,
  saveAdminProductionNotes,
  updateAdminOrderPriority,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  updateAdminProductionStatus,
} from '../services/orderAdminService'
import type { AdminOrder, AdminOrderPriority, AdminPaymentStatus, AdminProductionStatus } from '../types/adminModels'
import { getOrderItemSummary } from '../../lib/products'

const priorityOptions: AdminOrderPriority[] = ['low', 'normal', 'high', 'urgent']
const paymentStatusOptions: AdminPaymentStatus[] = ['pending', 'awaiting_payment', 'paid', 'not_required']
const productionStatusOptions: AdminProductionStatus[] = ['not_started', 'queued', 'printing', 'finishing', 'quality_check', 'ready', 'completed']

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

function getOrderIdFromHash(hash: string) {
  if (hash.startsWith('#/admin/orders/')) {
    return hash.replace('#/admin/orders/', '').split('?')[0]
  }

  if (hash === '#/admin/pedidos/demo') {
    return 'RP-24031'
  }

  return ''
}

function OrderDetailPage() {
  const [orderId, setOrderId] = useState(() => getOrderIdFromHash(window.location.hash))
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [comment, setComment] = useState('')
  const [notesDraft, setNotesDraft] = useState('')
  const [productionNotesDraft, setProductionNotesDraft] = useState('')

  useEffect(() => {
    const sync = () => setOrderId(getOrderIdFromHash(window.location.hash))

    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    let cancelled = false

    if (!orderId) {
      return
    }

    void getAdminOrderDetail(orderId).then((data) => {
      if (!cancelled) {
        setOrder(data)
        setNotesDraft(data?.notes ?? '')
        setProductionNotesDraft(data?.productionNotes ?? '')
      }
    })

    return () => {
      cancelled = true
    }
  }, [orderId])

  const currentUploads = useMemo(() => order?.items.map((item) => item.artwork) ?? [], [order])

  if (!orderId || !order) {
    return (
      <AdminShell description="Detalle operativo del pedido y sus acciones internas." title="Pedido">
        <EmptyAdminState description="Revisa el identificador o vuelve al tablero de pedidos." title="Pedido no encontrado" />
      </AdminShell>
    )
  }

  const refreshOrder = async () => {
    const next = await getAdminOrderDetail(order.id)
    setOrder(next)
  }

  return (
    <AdminShell
      description="Resumen, timeline, archivos y acciones internas para mover el pedido."
      title={`Pedido ${order.id}`}
    >
      <div className="admin-detail-grid">
        <div className="summary-stack">
          <AdminSection title="Resumen del pedido">
            <article className="content-card admin-detail-card">
              <div className="summary-list">
                <div className="summary-row">
                  <span>Cliente</span>
                  <strong>{order.customer}</strong>
                </div>
                <div className="summary-row">
                  <span>Email</span>
                  <strong>{order.email}</strong>
                </div>
                <div className="summary-row">
                  <span>Telefono</span>
                  <strong>{order.phone}</strong>
                </div>
                <div className="summary-row">
                  <span>Total</span>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>
                <div className="summary-row">
                  <span>Estado</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="summary-row">
                  <span>Pago</span>
                  <strong>{order.paymentStatus}</strong>
                </div>
              </div>
            </article>
          </AdminSection>

          <AdminSection title="Items y archivos">
            <div className="admin-list-card">
              {order.items.map((item) => (
                <article className="admin-list-row admin-list-row-block" key={item.id}>
                  <div>
                    <strong>{item.productName}</strong>
                    <p>{getOrderItemSummary(item).join(' · ')}</p>
                    <small>{item.artwork.fileName}</small>
                  </div>
                  <strong>{formatCurrency(item.pricing.total)}</strong>
                </article>
              ))}
            </div>
          </AdminSection>

          <AdminSection title="Timeline del pedido">
            <article className="content-card admin-detail-card">
              <TimelineBlock items={order.timeline} />
            </article>
          </AdminSection>
        </div>

        <div className="summary-stack">
          <AdminSection title="Cambiar estado">
            <article className="content-card admin-detail-card">
              <div className="configurator-form">
                <label className="field-group">
                  <span className="field-label">Estado del pedido</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await updateAdminOrderStatus(order.id, event.target.value as AdminOrder['status'])
                      await refreshOrder()
                    }}
                    value={order.status}
                  >
                    {orderStatusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Prioridad</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await updateAdminOrderPriority(order.id, event.target.value as AdminOrderPriority)
                      await refreshOrder()
                    }}
                    value={order.priority}
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Pago</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await updateAdminPaymentStatus(order.id, event.target.value as AdminPaymentStatus)
                      await refreshOrder()
                    }}
                    value={order.paymentStatus}
                  >
                    {paymentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Produccion</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await updateAdminProductionStatus(order.id, event.target.value as AdminProductionStatus)
                      await refreshOrder()
                    }}
                    value={order.productionStatus}
                  >
                    {productionStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          </AdminSection>

          <AdminSection title="Notas operativas">
            <article className="content-card admin-detail-card">
              <label className="field-group">
                <span className="field-label">Notas internas</span>
                <textarea
                  className="form-input form-textarea"
                  onChange={(event) => setNotesDraft(event.target.value)}
                  rows={4}
                  value={notesDraft}
                />
              </label>
              <button
                className="action-button"
                onClick={async () => {
                  await saveAdminOrderNotes(order.id, notesDraft)
                  await refreshOrder()
                }}
                type="button"
              >
                Guardar notas
              </button>
            </article>
          </AdminSection>

          <AdminSection title="Notas de produccion">
            <article className="content-card admin-detail-card">
              <label className="field-group">
                <span className="field-label">Instrucciones internas</span>
                <textarea
                  className="form-input form-textarea"
                  onChange={(event) => setProductionNotesDraft(event.target.value)}
                  rows={4}
                  value={productionNotesDraft}
                />
              </label>
              <button
                className="action-button"
                onClick={async () => {
                  await saveAdminProductionNotes(order.id, productionNotesDraft)
                  await refreshOrder()
                }}
                type="button"
              >
                Guardar produccion
              </button>
            </article>
          </AdminSection>

          <AdminSection title="Comentarios internos">
            <article className="content-card admin-detail-card">
              <div className="admin-comment-list">
                {order.internalComments.map((item) => (
                  <article className="admin-comment-item" key={item.id}>
                    <strong>{item.author}</strong>
                    <p>{item.body}</p>
                    <span>{new Date(item.createdAt).toLocaleString('es-ES')}</span>
                  </article>
                ))}
              </div>
              <label className="field-group">
                <span className="field-label">Nuevo comentario interno</span>
                <textarea
                  className="form-input form-textarea"
                  onChange={(event) => setComment(event.target.value)}
                  rows={3}
                  value={comment}
                />
              </label>
              <button
                className="action-button"
                onClick={async () => {
                  if (!comment.trim()) {
                    return
                  }

                  await addAdminInternalComment(order.id, comment.trim())
                  setComment('')
                  await refreshOrder()
                }}
                type="button"
              >
                Anadir comentario
              </button>
            </article>
          </AdminSection>

          <AdminSection title="Acciones rapidas">
            <div className="catalog-card-actions">
              <a className="action-button action-link-button" href="#/admin/uploads">
                Revisar archivos
              </a>
              <a className="action-button action-button-muted action-link-button" href="#/admin/production">
                Ver produccion
              </a>
            </div>
            {currentUploads.length > 0 ? (
              <p className="inline-notice">Archivos vinculados: {currentUploads.length}</p>
            ) : null}
          </AdminSection>
        </div>
      </div>
    </AdminShell>
  )
}

export default OrderDetailPage
