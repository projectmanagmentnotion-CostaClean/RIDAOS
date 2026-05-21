import { useEffect, useMemo, useState } from 'react'
import { getOrderItemSummary } from '../../lib/products'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import TimelineBlock from '../components/TimelineBlock'
import { orderStatusOptions } from '../config/orderStatuses'
import AdminShell from '../layouts/AdminShell'
import { artworkStatusLabels, productionStageDefinitions, shippingStatusLabels } from '../../features/operations/mock/operationsMockData'
import InternalNotesComposer from '../../features/operations/notes/InternalNotesComposer'
import ProductionPipelineTimeline from '../../features/operations/timeline/ProductionPipelineTimeline'
import { getOperationsOrderDetail } from '../../features/operations/services/operationsService'
import type { OperationsOrderRecord } from '../../features/operations/types/operations'
import {
  addAdminInternalComment,
  saveAdminOrderNotes,
  saveAdminProductionNotes,
  updateAdminOrderPriority,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  updateAdminProductionStatus,
} from '../services/orderAdminService'
import type {
  AdminOrder,
  AdminOrderPriority,
  AdminPaymentStatus,
  AdminProductionStatus,
} from '../types/adminModels'
import { getLifecycleDescriptorFromAdminStatus } from '../utils/adminLifecycle'

const priorityOptions: AdminOrderPriority[] = ['low', 'normal', 'high', 'urgent']
const paymentStatusOptions: AdminPaymentStatus[] = ['pending', 'awaiting_payment', 'paid', 'not_required']
const productionStatusOptions: AdminProductionStatus[] = [
  'not_started',
  'queued',
  'printing',
  'finishing',
  'quality_check',
  'ready',
  'completed',
]

const paymentStatusLabels: Record<AdminPaymentStatus, string> = {
  pending: 'Pendiente de definicion',
  awaiting_payment: 'Pendiente de cobro',
  paid: 'Cobro confirmado',
  not_required: 'No requiere cobro',
}

const productionStatusLabels: Record<AdminProductionStatus, string> = {
  not_started: 'Sin lanzar',
  queued: 'En cola',
  printing: 'Produccion en curso',
  finishing: 'Acabado y remate',
  quality_check: 'Control de calidad',
  ready: 'Listo para salida',
  completed: 'Salida cerrada',
}

const priorityLabels: Record<AdminOrderPriority, string> = {
  low: 'Baja',
  normal: 'Normal',
  high: 'Alta',
  urgent: 'Urgente',
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

/**
 * Editable Zones:
 * - ADMIN_ORDER_DETAIL
 * - ADMIN_INTERNAL_NOTES
 * Content: src/features/operations/mock/operationsMockData.ts
 * Store: src/admin/store/useAdminUiStore.ts
 * Visual component: src/admin/pages/OrderDetailPage.tsx
 */
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
  const [order, setOrder] = useState<OperationsOrderRecord | null>(null)
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

    void getOperationsOrderDetail(orderId).then((data) => {
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
  const lifecycle = order ? getLifecycleDescriptorFromAdminStatus(order.status) : null

  if (!orderId || !order) {
    return (
      <AdminShell description="Detalle interno del pedido y sus acciones internas." title="Pedido">
        <EmptyAdminState
          description="Revisa el identificador o vuelve al tablero de pedidos."
          title="Pedido no encontrado"
        />
      </AdminShell>
    )
  }

  const refreshOrder = async () => {
    const next = await getOperationsOrderDetail(order.id)
    setOrder(next)
  }

  return (
    <AdminShell
      description="Resumen interno preparado para revisar archivos, mover estados y dejar trazabilidad clara."
      title={`Pedido ${order.id}`}
    >
      <div className="admin-detail-grid">
        <div className="summary-stack">
          <AdminSection title="Resumen del pedido">
            <article className="content-card admin-detail-card">
              {lifecycle ? (
                <div className="admin-lifecycle-spotlight">
                  <div>
                    <p className="section-label">Lectura publica</p>
                    <h3>{lifecycle.publicLabel}</h3>
                    <p>{lifecycle.customerExplanation}</p>
                  </div>
                  <div>
                    <p className="section-label">Siguiente accion interna</p>
                    <strong>{lifecycle.nextAction.admin}</strong>
                    <p>{lifecycle.adminExplanation}</p>
                  </div>
                </div>
              ) : null}
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
                  <span>Prioridad</span>
                  <strong>{priorityLabels[order.priority]}</strong>
                </div>
                <div className="summary-row">
                  <span>Vencimiento</span>
                  <strong>{new Date(order.dueDate).toLocaleDateString('es-ES')}</strong>
                </div>
                <div className="summary-row">
                  <span>Pago</span>
                  <strong>{paymentStatusLabels[order.paymentStatus]}</strong>
                </div>
                <div className="summary-row">
                  <span>Produccion</span>
                  <strong>{productionStatusLabels[order.productionStatus]}</strong>
                </div>
                <div className="summary-row">
                  <span>Artwork</span>
                  <strong>{artworkStatusLabels[order.artworkStatus]}</strong>
                </div>
                <div className="summary-row">
                  <span>Salida</span>
                  <strong>{shippingStatusLabels[order.shippingStatus]}</strong>
                </div>
                <div className="summary-row">
                  <span>Operador</span>
                  <strong>{order.operator.name}</strong>
                </div>
              </div>
            </article>
          </AdminSection>

          <AdminSection
            description="Lectura del pedido, archivo asociado y orientacion para comprobacion o fabricacion."
            title="Items y archivos"
          >
            <div className="admin-list-card">
              {order.items.map((item) => (
                <article className="admin-list-row admin-list-row-block" key={item.id}>
                  <div>
                    <strong>{item.productName}</strong>
                    <p>{getOrderItemSummary(item).join(' · ')}</p>
                    <small>{item.artwork.fileName}</small>
                    <p className="admin-inline-note">
                      Archivo recibido para comprobacion. {item.artwork.notes || 'Pendiente de dejar comentario interno.'}
                    </p>
                  </div>
                  <strong>{formatCurrency(item.pricing.total)}</strong>
                </article>
              ))}
            </div>
          </AdminSection>

          <AdminSection
            description="Trazabilidad interna del pedido desde entrada hasta salida."
            title="Timeline del pedido"
          >
            <article className="content-card admin-detail-card">
              <TimelineBlock items={order.timeline} />
            </article>
          </AdminSection>

          <AdminSection
            description="Pipeline visual reusable para mover el pedido por arte, produccion y salida."
            title="Pipeline de produccion"
          >
            <article className="content-card admin-detail-card">
              <ProductionPipelineTimeline order={order} stages={productionStageDefinitions} />
            </article>
          </AdminSection>
        </div>

        <div className="summary-stack">
          <AdminSection
            description="Ajusta estado, prioridad, cobro o fabricacion sin salir del detalle."
            title="Cambiar estado"
          >
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
                        {priorityLabels[priority]}
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
                        {paymentStatusLabels[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Fabricacion</span>
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
                        {productionStatusLabels[status]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          </AdminSection>

          <AdminSection
            description="Notas operativas del pedido visibles solo dentro del panel interno."
            title="Notas de seguimiento"
          >
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
                Guardar seguimiento
              </button>
            </article>
          </AdminSection>

          <AdminSection
            description="Instrucciones de taller, acabados y salida preparadas para futura capa real."
            title="Notas de fabricacion"
          >
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
                Guardar fabricacion
              </button>
            </article>
          </AdminSection>

          <AdminSection
            description="Historial breve de decisiones o incidencias internas asociadas al pedido."
            title="Comentarios internos"
          >
            <article className="content-card admin-detail-card">
              <div className="admin-comment-list">
                {order.internalComments.map((item) => (
                  <article className="admin-comment-item" key={item.id}>
                    <strong>{item.author} · {item.category ?? 'internal'}</strong>
                    <p>{item.body}</p>
                    <span>{new Date(item.createdAt).toLocaleString('es-ES')}</span>
                  </article>
                ))}
              </div>
              <InternalNotesComposer
                onSubmit={async ({ body, category }) => {
                  await addAdminInternalComment(order.id, body, category)
                  await refreshOrder()
                }}
              />
            </article>
          </AdminSection>

          <AdminSection
            description="Accesos directos para continuar con revision de archivos o cola productiva."
            title="Acciones rapidas"
          >
            <div className="catalog-card-actions">
              <a className="action-button action-link-button" href="#/admin/uploads">
                Revisar archivos
              </a>
              <a className="action-button action-button-muted action-link-button" href="#/admin/production">
                Ver fabricacion
              </a>
            </div>
            {currentUploads.length > 0 ? (
              <p className="inline-notice">Archivos vinculados al pedido: {currentUploads.length}</p>
            ) : null}
          </AdminSection>
        </div>
      </div>
    </AdminShell>
  )
}

export default OrderDetailPage
