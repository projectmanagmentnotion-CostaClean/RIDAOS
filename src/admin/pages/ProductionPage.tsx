import AdminStatCard from '../components/AdminStatCard'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import AdminShell from '../layouts/AdminShell'
import { patchAdminOrderDispatch } from '../services/orderAdminService'
import { productionStageDefinitions, shippingStatusLabels } from '../../features/operations/mock/operationsMockData'
import ProductionStageSummary from '../../features/operations/production/ProductionStageSummary'
import DispatchBoard from '../../features/operations/delivery/DispatchBoard'
import SchedulingBoard from '../../features/operations/scheduling/SchedulingBoard'
import { useOperationsCapacity } from '../../features/operations/hooks/useOperationsCapacity'
import ProductionPipelineTimeline from '../../features/operations/timeline/ProductionPipelineTimeline'
import { getOperationsDispatchBoard, getProductionOperations } from '../../features/operations/services/operationsService'
import type { DispatchBoardColumns, OperationsOrderRecord } from '../../features/operations/types/operations'
import { useEffect, useState } from 'react'
import { getNextShippingStatus } from '../../features/operations/dispatch/dispatchService'
import { resolveMockUser } from '../../features/admin-accounts/services/adminAccountsService'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

/**
 * Editable Zones:
 * - ADMIN_PRODUCTION_PIPELINE
 * - ADMIN_SCHEDULING_BOARD
 * - ADMIN_MACHINE_SLOTS
 * - ADMIN_DELIVERY_BOARD
 * - ADMIN_PICKUP_QUEUE
 * Content: src/features/operations/mock/operationsMockData.ts
 * Visual component: src/admin/pages/ProductionPage.tsx
 */
function ProductionPage() {
  const [orders, setOrders] = useState<OperationsOrderRecord[]>([])
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getProductionOperations>>['stats'] | null>(null)
  const [dispatchBoard, setDispatchBoard] = useState<DispatchBoardColumns | null>(null)
  const { schedule } = useOperationsCapacity()

  useEffect(() => {
    let cancelled = false

    void Promise.all([getProductionOperations(), getOperationsDispatchBoard()]).then(([data, board]) => {
      if (!cancelled) {
        setOrders(data.orders)
        setStats(data.stats)
        setDispatchBoard(board)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminShell
      description="Pipeline operativo mock desde triage, impresion y control de calidad hasta salida."
      title="Produccion y pipeline"
    >
      <div className="admin-stat-grid">
        <AdminStatCard label="Revision arte" note="Pedidos bloqueados por archivo o aprobacion." value={stats?.artworkPending ?? '...'} />
        <AdminStatCard label="Label pendiente" note="Pedidos listos sin expedicion cerrada." value={stats?.labelPending ?? '...'} />
        <AdminStatCard label="Vencidos" note="Pedidos que ya superan la fecha objetivo mock." value={stats?.overdue ?? '...'} />
        <AdminStatCard label="En impresion" note="Trabajos activos en cola productiva." value={stats?.byStage.printing ?? '...'} />
      </div>

      <AdminSection
        description="Lectura rapida de la distribucion de pedidos por etapa del pipeline."
        title="Resumen por etapa"
      >
        <ProductionStageSummary
          items={[
            { label: 'Nuevo', value: stats?.byStage.new ?? 0 },
            { label: 'Revision arte', value: stats?.byStage.reviewing_artwork ?? 0 },
            { label: 'Preparacion', value: stats?.byStage.preparing ?? 0 },
            { label: 'Impresion', value: stats?.byStage.printing ?? 0 },
            { label: 'QC', value: stats?.byStage.quality_control ?? 0 },
            { label: 'Packaging', value: stats?.byStage.packaging ?? 0 },
          ]}
        />
      </AdminSection>

      <AdminSection
        description="Cada tarjeta deja visible etapa, responsable, salida y bloqueos del pedido."
        title="Cola de produccion"
      >
        {orders.length === 0 ? (
          <EmptyAdminState description="Los pedidos aprobados o en Fabricacion apareceran aqui." title="No hay cola de Fabricacion" />
        ) : (
          <div className="admin-production-grid">
            {orders.map((order) => {
              return (
                <article className="content-card admin-production-card" key={order.id}>
                  <div className="order-card-head">
                    <div>
                      <p className="section-label">{order.id}</p>
                      <h3>{order.customer}</h3>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="summary-list">
                    <div className="summary-row">
                      <span>Etapa</span>
                      <strong>{order.queueStage}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Operador</span>
                      <strong>{order.operator.name}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Owner</span>
                      <strong>{resolveMockUser(order.ownerUserId)?.name ?? order.ownerUserId}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Salida</span>
                      <strong>{shippingStatusLabels[order.shippingStatus]}</strong>
                    </div>
                  </div>
                  <ProductionPipelineTimeline order={order} stages={productionStageDefinitions} />
                  <p className="admin-inline-note">{order.productionNotes || 'Sin notas de fabricacion registradas todavia.'}</p>
                  <p className="admin-inline-note">Approval chain: {order.requiredApprovalChainKeys.join(' · ')}</p>
                  <p>{formatCurrency(order.total)} · vence {new Date(order.dueDate).toLocaleDateString('es-ES')}</p>
                  <a className="action-button action-link-button" href={`#/admin/orders/${order.id}`}>
                    Abrir flujo
                  </a>
                </article>
              )
            })}
          </div>
        )}
      </AdminSection>

      {schedule ? (
        <AdminSection
          description="Board semanal mock con slots por maquina, entregas previstas y conflictos de capacidad."
          title="Scheduling board"
        >
          <SchedulingBoard board={schedule} />
        </AdminSection>
      ) : null}

      {dispatchBoard ? (
        <AdminSection
          description="Board de packing, pickup, entrega e incidencias con acciones mock de handoff."
          title="Dispatch board"
        >
          <DispatchBoard
            board={dispatchBoard}
            onAdvanceStatus={async (orderId) => {
              const order = orders.find((item) => item.id === orderId)
              if (!order) return
              await patchAdminOrderDispatch(orderId, {
                shippingStatus: getNextShippingStatus(order.shippingStatus),
              })
              const [next, nextBoard] = await Promise.all([getProductionOperations(), getOperationsDispatchBoard()])
              setOrders(next.orders)
              setStats(next.stats)
              setDispatchBoard(nextBoard)
            }}
            onMarkPacked={async (orderId) => {
              await patchAdminOrderDispatch(orderId, { packingStatus: 'packed', shippingStatus: 'ready_for_dispatch' })
              const [next, nextBoard] = await Promise.all([getProductionOperations(), getOperationsDispatchBoard()])
              setOrders(next.orders)
              setStats(next.stats)
              setDispatchBoard(nextBoard)
            }}
            onRegisterIncident={async (orderId) => {
              await patchAdminOrderDispatch(orderId, { deliveryIncident: 'Incidencia mock pendiente de resolver con cliente.' })
              const [next, nextBoard] = await Promise.all([getProductionOperations(), getOperationsDispatchBoard()])
              setOrders(next.orders)
              setStats(next.stats)
              setDispatchBoard(nextBoard)
            }}
          />
        </AdminSection>
      ) : null}
    </AdminShell>
  )
}

export default ProductionPage
