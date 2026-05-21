import { useEffect, useState } from 'react'
import AdminStatCard from '../components/AdminStatCard'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import AdminShell from '../layouts/AdminShell'
import { productionStageDefinitions, shippingStatusLabels } from '../../features/operations/mock/operationsMockData'
import ProductionStageSummary from '../../features/operations/production/ProductionStageSummary'
import ProductionPipelineTimeline from '../../features/operations/timeline/ProductionPipelineTimeline'
import { getProductionOperations } from '../../features/operations/services/operationsService'
import type { OperationsOrderRecord } from '../../features/operations/types/operations'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

/**
 * Editable Zone: ADMIN_PRODUCTION_PIPELINE
 * Content: src/features/operations/mock/operationsMockData.ts
 * Visual component: src/admin/pages/ProductionPage.tsx
 */
function ProductionPage() {
  const [orders, setOrders] = useState<OperationsOrderRecord[]>([])
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getProductionOperations>>['stats'] | null>(null)

  useEffect(() => {
    let cancelled = false

    void getProductionOperations().then((data) => {
      if (!cancelled) {
        setOrders(data.orders)
        setStats(data.stats)
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
                      <span>Salida</span>
                      <strong>{shippingStatusLabels[order.shippingStatus]}</strong>
                    </div>
                  </div>
                  <ProductionPipelineTimeline order={order} stages={productionStageDefinitions} />
                  <p className="admin-inline-note">{order.productionNotes || 'Sin notas de fabricacion registradas todavia.'}</p>
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
    </AdminShell>
  )
}

export default ProductionPage
