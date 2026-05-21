import { useEffect, useMemo, useState } from 'react'
import { getOrderItemSummary } from '../../lib/products'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import TimelineBlock from '../components/TimelineBlock'
import { orderStatusOptions } from '../config/orderStatuses'
import AdminShell from '../layouts/AdminShell'
import { artworkStatusLabels, productionStageDefinitions, shippingStatusLabels } from '../../features/operations/mock/operationsMockData'
import { capacityWindows } from '../../features/operations/capacity/capacityMockData'
import { getCapacityMeta, recommendSchedulingSlot } from '../../features/operations/capacity/capacitySelectors'
import { deliveryMethodLabels, deliveryWindowLabels, packingStatusLabels } from '../../features/operations/dispatch/dispatchMockData'
import { buildDeliveryMessagePreviews, getNextShippingStatus } from '../../features/operations/dispatch/dispatchService'
import DeliveryMessagePreviewCard from '../../features/operations/delivery/DeliveryMessagePreviewCard'
import ClientServiceTemplatePreviewList from '../../features/operations/client-service/components/ClientServiceTemplatePreviewList'
import { getNextApprovalState } from '../../features/operations/client-service/approvals/approvalFlow'
import { approvalStateLabels, escalationLevelLabels, incidentTypeLabels, slaStatusLabels, ticketStatusLabels } from '../../features/operations/client-service/mock/clientServiceMockData'
import { getClientServiceSummaryMeta, getClientServiceTemplatePreviewData } from '../../features/operations/client-service/services/clientServiceService'
import InternalNotesComposer from '../../features/operations/notes/InternalNotesComposer'
import ProductionPipelineTimeline from '../../features/operations/timeline/ProductionPipelineTimeline'
import { getOperationsOrderDetail, getOperationsOrders } from '../../features/operations/services/operationsService'
import type { OperationsFilters, OperationsOrderRecord } from '../../features/operations/types/operations'
import {
  addAdminInternalComment,
  patchAdminOrderClientService,
  patchAdminOrderDispatch,
  patchAdminOrderSchedule,
  saveAdminOrderNotes,
  saveAdminProductionNotes,
  saveAdminServiceNotes,
  updateAdminOrderPriority,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  updateAdminProductionStatus,
} from '../services/orderAdminService'
import type {
  AdminApprovalState,
  AdminEscalationLevel,
  AdminIncidentType,
  AdminOrder,
  AdminOrderPriority,
  AdminPaymentStatus,
  AdminProductionStatus,
  AdminSlaStatus,
  AdminTicketStatus,
  AdminTimelineItem,
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
 * - ADMIN_ORDER_HANDOFF
 * - ADMIN_DELIVERY_MESSAGES
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
  const [allOrders, setAllOrders] = useState<OperationsOrderRecord[]>([])
  const [notesDraft, setNotesDraft] = useState('')
  const [productionNotesDraft, setProductionNotesDraft] = useState('')
  const [serviceNotesDraft, setServiceNotesDraft] = useState('')
  const capacityMeta = useMemo(() => getCapacityMeta(), [])

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

    void Promise.all([
      getOperationsOrderDetail(orderId),
      getOperationsOrders({
        search: '',
        status: 'all',
        priority: 'all',
        category: 'all',
        artworkStatus: 'all',
        shippingStatus: 'all',
        stage: 'all',
        sort: 'newest',
      } as OperationsFilters),
    ]).then(([data, orders]) => {
      if (!cancelled) {
        setOrder(data)
        setAllOrders(orders)
        setNotesDraft(data?.notes ?? '')
        setProductionNotesDraft(data?.productionNotes ?? '')
        setServiceNotesDraft(data?.serviceNotes ?? '')
      }
    })

    return () => {
      cancelled = true
    }
  }, [orderId])

  const currentUploads = useMemo(() => order?.items.map((item) => item.artwork) ?? [], [order])
  const lifecycle = order ? getLifecycleDescriptorFromAdminStatus(order.status) : null
  const slotRecommendation = useMemo(
    () => (order ? recommendSchedulingSlot(order, allOrders.filter((item) => item.id !== order.id)) : null),
    [allOrders, order],
  )
  const deliveryMessages = useMemo(() => (order ? buildDeliveryMessagePreviews(order) : []), [order])
  const clientServiceMeta = useMemo(() => (order ? getClientServiceSummaryMeta(order) : null), [order])
  const clientServiceTemplates = useMemo(() => (order ? getClientServiceTemplatePreviewData(order) : []), [order])

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
    const [next, orders] = await Promise.all([
      getOperationsOrderDetail(order.id),
      getOperationsOrders({
        search: '',
        status: 'all',
        priority: 'all',
        category: 'all',
        artworkStatus: 'all',
        shippingStatus: 'all',
        stage: 'all',
        sort: 'newest',
      } as OperationsFilters),
    ])
    setOrder(next)
    setAllOrders(orders)
    setServiceNotesDraft(next?.serviceNotes ?? '')
  }

  const appendServiceTimelineEntry = async (
    label: string,
    detail: string,
    tone: AdminTimelineItem['tone'] = 'default',
  ) => {
    await patchAdminOrderClientService(order.id, {
      serviceTimeline: [
        ...order.serviceTimeline,
        {
          id: `${order.id}-service-${Date.now()}`,
          label,
          detail,
          timestamp: new Date().toISOString(),
          tone,
        },
      ],
    })
    await refreshOrder()
  }

  const appendApprovalTimelineEntry = async (
    label: string,
    detail: string,
    tone: AdminTimelineItem['tone'] = 'default',
  ) => {
    await patchAdminOrderClientService(order.id, {
      approvalTimeline: [
        ...order.approvalTimeline,
        {
          id: `${order.id}-approval-${Date.now()}`,
          label,
          detail,
          timestamp: new Date().toISOString(),
          tone,
        },
      ],
    })
    await refreshOrder()
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
                <div className="summary-row">
                  <span>Maquina</span>
                  <strong>{order.machine.label}</strong>
                </div>
                <div className="summary-row">
                  <span>Slot</span>
                  <strong>
                    {new Date(order.scheduledDate).toLocaleDateString('es-ES')} · {capacityWindows.find((item) => item.key === order.scheduledWindow)?.label ?? order.scheduledWindow}
                  </strong>
                </div>
                <div className="summary-row">
                  <span>Entrega</span>
                  <strong>{deliveryMethodLabels[order.deliveryMethod]}</strong>
                </div>
                <div className="summary-row">
                  <span>Tracking</span>
                  <strong>{order.trackingCode || 'Sin tracking mock'}</strong>
                </div>
                <div className="summary-row">
                  <span>Ticket</span>
                  <strong>{clientServiceMeta?.ticketLabel}</strong>
                </div>
                <div className="summary-row">
                  <span>SLA</span>
                  <strong>{clientServiceMeta?.slaLabel}</strong>
                </div>
                <div className="summary-row">
                  <span>Approval</span>
                  <strong>{clientServiceMeta?.approvalLabel}</strong>
                </div>
                <div className="summary-row">
                  <span>Escalado</span>
                  <strong>{clientServiceMeta?.escalationLabel}</strong>
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
            description="Asigna operador, maquina y ventana mock con persistencia local para preparar el salto a scheduling real."
            title="Asignacion operativa"
          >
            <article className="content-card admin-detail-card">
              <div className="configurator-form">
                <label className="field-group">
                  <span className="field-label">Operador</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderSchedule(order.id, { operatorId: event.target.value })
                      await refreshOrder()
                    }}
                    value={order.operator.id}
                  >
                    {capacityMeta.operators.map((operator) => (
                      <option key={operator.id} value={operator.id}>
                        {operator.name} · {operator.role}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Maquina</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderSchedule(order.id, { machineId: event.target.value })
                      await refreshOrder()
                    }}
                    value={order.machine.id}
                  >
                    {capacityMeta.machines.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Fecha planificada</span>
                  <input
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderSchedule(order.id, { scheduledDate: event.target.value })
                      await refreshOrder()
                    }}
                    type="date"
                    value={order.scheduledDate.slice(0, 10)}
                  />
                </label>
                <label className="field-group">
                  <span className="field-label">Ventana</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderSchedule(order.id, { scheduledWindow: event.target.value as typeof order.scheduledWindow })
                      await refreshOrder()
                    }}
                    value={order.scheduledWindow}
                  >
                    {capacityMeta.windows.map((window) => (
                      <option key={window.key} value={window.key}>
                        {window.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {slotRecommendation ? (
                <div className="admin-upload-note">
                  <strong>Slot recomendado</strong>
                  <p>
                    {new Date(slotRecommendation.date).toLocaleDateString('es-ES')} · {capacityMeta.windows.find((item) => item.key === slotRecommendation.window)?.label} · {slotRecommendation.machine.label}
                  </p>
                  <p>{slotRecommendation.note}</p>
                  <button
                    className="action-button action-button-muted"
                    onClick={async () => {
                      await patchAdminOrderSchedule(order.id, {
                        operatorId: slotRecommendation.operator.id,
                        machineId: slotRecommendation.machine.id,
                        scheduledDate: slotRecommendation.date,
                        scheduledWindow: slotRecommendation.window,
                      })
                      await refreshOrder()
                    }}
                    type="button"
                  >
                    Aplicar recomendacion
                  </button>
                </div>
              ) : null}
            </article>
          </AdminSection>

          <AdminSection
            description="Panel premium de atencion al cliente, approvals, SLA e incidencias listo para migrar a datos reales."
            title="Client service panel"
          >
            <article className="content-card admin-detail-card">
              <div className="configurator-form">
                <label className="field-group">
                  <span className="field-label">Ticket status</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderClientService(order.id, { ticketStatus: event.target.value as AdminTicketStatus })
                      await refreshOrder()
                    }}
                    value={order.ticketStatus}
                  >
                    {Object.entries(ticketStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">SLA</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderClientService(order.id, { slaStatus: event.target.value as AdminSlaStatus })
                      await refreshOrder()
                    }}
                    value={order.slaStatus}
                  >
                    {Object.entries(slaStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Approval state</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderClientService(order.id, { approvalState: event.target.value as AdminApprovalState })
                      await refreshOrder()
                    }}
                    value={order.approvalState}
                  >
                    {Object.entries(approvalStateLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Escalation</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderClientService(order.id, { escalationLevel: event.target.value as AdminEscalationLevel })
                      await refreshOrder()
                    }}
                    value={order.escalationLevel}
                  >
                    {Object.entries(escalationLevelLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Incident type</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderClientService(order.id, { incidentType: event.target.value as AdminIncidentType })
                      await refreshOrder()
                    }}
                    value={order.incidentType}
                  >
                    {Object.entries(incidentTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="field-group">
                <span className="field-label">Seguimiento service</span>
                <textarea
                  className="form-input form-textarea"
                  onChange={(event) => setServiceNotesDraft(event.target.value)}
                  rows={3}
                  value={serviceNotesDraft}
                />
              </label>
              <div className="catalog-card-actions">
                <button
                  className="action-button"
                  onClick={async () => {
                    await saveAdminServiceNotes(order.id, serviceNotesDraft)
                    await refreshOrder()
                  }}
                  type="button"
                >
                  Guardar service notes
                </button>
                <button
                  className="action-button action-button-muted"
                  onClick={async () => {
                    const nextApproval = getNextApprovalState(order.approvalState)
                    await patchAdminOrderClientService(order.id, { approvalState: nextApproval })
                    await appendApprovalTimelineEntry('Approval actualizada', `El artwork pasa a ${approvalStateLabels[nextApproval]}.`, 'success')
                  }}
                  type="button"
                >
                  Avanzar approval
                </button>
                <button
                  className="action-button action-button-muted"
                  onClick={async () => {
                    await patchAdminOrderClientService(order.id, {
                      approvalState: 'changes_requested',
                      ticketStatus: 'waiting_customer',
                    })
                    await appendApprovalTimelineEntry('Cambios solicitados', 'Se ha pedido una nueva version del archivo al cliente.', 'warning')
                  }}
                  type="button"
                >
                  Pedir cambios
                </button>
                <button
                  className="action-button action-button-muted"
                  onClick={async () => {
                    await patchAdminOrderClientService(order.id, {
                      ticketStatus: 'escalated',
                      escalationLevel: 'urgent',
                    })
                    await appendServiceTimelineEntry('Caso escalado', 'Se ha marcado el pedido como escalado para revision prioritaria.', 'warning')
                  }}
                  type="button"
                >
                  Escalar caso
                </button>
              </div>
              <div className="admin-upload-note">
                <strong>Recommendation</strong>
                <p>{clientServiceMeta?.escalationRecommendation}</p>
              </div>
            </article>
          </AdminSection>

          <AdminSection
            description="Historial mock de approval e incidencia para mantener trazabilidad operativa."
            title="Approvals e incident timeline"
          >
            <article className="content-card admin-detail-card">
              <div className="summary-stack">
                <div className="admin-upload-note">
                  <strong>Approval history</strong>
                  <TimelineBlock items={order.approvalTimeline} />
                </div>
                <div className="admin-upload-note">
                  <strong>Incident timeline</strong>
                  <TimelineBlock items={order.serviceTimeline} />
                </div>
              </div>
            </article>
          </AdminSection>

          <AdminSection
            description="Templates premium de respuesta al cliente. Solo preview local, sin envios reales."
            title="Response templates"
          >
            <ClientServiceTemplatePreviewList items={clientServiceTemplates} />
          </AdminSection>

          <AdminSection
            description="Prepara embalaje, pickup, salida y handoff con persistencia local mock."
            title="Despacho y entrega"
          >
            <article className="content-card admin-detail-card">
              <div className="configurator-form">
                <label className="field-group">
                  <span className="field-label">Shipping status</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderDispatch(order.id, { shippingStatus: event.target.value as typeof order.shippingStatus })
                      await refreshOrder()
                    }}
                    value={order.shippingStatus}
                  >
                    {Object.entries(shippingStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Metodo de entrega</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderDispatch(order.id, { deliveryMethod: event.target.value as typeof order.deliveryMethod })
                      await refreshOrder()
                    }}
                    value={order.deliveryMethod}
                  >
                    {Object.entries(deliveryMethodLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Estado de embalaje</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderDispatch(order.id, { packingStatus: event.target.value as typeof order.packingStatus })
                      await refreshOrder()
                    }}
                    value={order.packingStatus}
                  >
                    {Object.entries(packingStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Ventana de entrega</span>
                  <select
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderDispatch(order.id, { deliveryWindow: event.target.value as typeof order.deliveryWindow })
                      await refreshOrder()
                    }}
                    value={order.deliveryWindow}
                  >
                    {Object.entries(deliveryWindowLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-group">
                  <span className="field-label">Tracking mock</span>
                  <input
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderDispatch(order.id, { trackingCode: event.target.value })
                      await refreshOrder()
                    }}
                    value={order.trackingCode}
                  />
                </label>
                <label className="field-group">
                  <span className="field-label">Carrier</span>
                  <input
                    className="form-input"
                    onChange={async (event) => {
                      await patchAdminOrderDispatch(order.id, { carrierLabel: event.target.value })
                      await refreshOrder()
                    }}
                    value={order.carrierLabel}
                  />
                </label>
              </div>
              <div className="catalog-card-actions">
                <button
                  className="action-button action-button-muted"
                  onClick={async () => {
                    await patchAdminOrderDispatch(order.id, { packingStatus: 'packed', shippingStatus: 'ready_for_dispatch' })
                    await refreshOrder()
                  }}
                  type="button"
                >
                  Marcar embalado
                </button>
                <button
                  className="action-button"
                  onClick={async () => {
                    await patchAdminOrderDispatch(order.id, { shippingStatus: getNextShippingStatus(order.shippingStatus) })
                    await refreshOrder()
                  }}
                  type="button"
                >
                  Avanzar salida
                </button>
                <button
                  className="action-button action-button-muted"
                  onClick={async () => {
                    await patchAdminOrderDispatch(order.id, { deliveryIncident: 'Incidencia mock registrada en handoff.' })
                    await refreshOrder()
                  }}
                  type="button"
                >
                  Registrar incidencia
                </button>
              </div>
              <div className="admin-upload-note">
                <strong>Handoff timeline</strong>
                <TimelineBlock items={order.handoffTimeline} />
              </div>
            </article>
          </AdminSection>

          <AdminSection
            description="Preview local de mensajes al cliente. No envia email ni WhatsApp reales."
            title="Mensajes al cliente"
          >
            <DeliveryMessagePreviewCard items={deliveryMessages} />
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
