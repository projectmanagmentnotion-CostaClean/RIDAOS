import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import AdminShell from '../layouts/AdminShell'
import OperationsActivityFeed from '../../features/operations/dashboard/OperationsActivityFeed'
import OperationsKpiGrid from '../../features/operations/dashboard/OperationsKpiGrid'
import { useOperationsDashboard } from '../../features/operations/hooks/useOperationsDashboard'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

/**
 * Editable Zones:
 * - ADMIN_DASHBOARD
 * - ADMIN_OPERATIONS_DASHBOARD
 * Content: src/content/adminMockContent.ts
 * Operations: src/features/operations/mock/operationsMockData.ts
 * Visual component: src/admin/pages/DashboardPage.tsx
 */
function DashboardPage() {
  const dashboard = useOperationsDashboard()

  return (
    <AdminShell
      description="Centro operativo mock para pedidos activos, revision de arte, cola de produccion y salida."
      title="Operations dashboard"
    >
      <OperationsKpiGrid
        items={
          dashboard?.kpis ?? [
            { key: 'loading-orders', label: 'Pedidos activos', value: '...', note: 'Cargando estado operativo.' },
            { key: 'loading-urgent', label: 'Urgentes', value: '...', note: 'Cargando prioridad.' },
            { key: 'loading-art', label: 'Revision de arte', value: '...', note: 'Cargando validaciones.' },
            { key: 'loading-dispatch', label: 'Listos para salida', value: '...', note: 'Cargando expediciones.' },
          ]
        }
      />

      <div className="admin-overview-strip">
        <article className="content-card admin-overview-card">
          <p className="section-label">Estado operativo</p>
          <h3>Revision, produccion y salida ya viven como workflows separados.</h3>
          <p>La cola mock deja claro que bloquea arte, que esta en maquina y que esta listo para expedir.</p>
        </article>
        <article className="content-card admin-overview-card">
          <p className="section-label">Escalado futuro</p>
          <h3>Operadores, notas y pipeline quedan listos para persistencia real.</h3>
          <p>La lectura del panel ya es operativa sin conectar Supabase, sockets ni storage externo.</p>
        </article>
      </div>

      <div className="admin-two-column">
        <AdminSection
          actions={
            <div className="catalog-card-actions">
              <a className="action-button action-link-button" href="#/admin/orders">
                Abrir pedidos
              </a>
            </div>
          }
          description="Pedidos recientes con estado interno, lectura publica y siguiente accion."
          title="Urgentes y bloqueos"
        >
          <div className="admin-list-card">
            {!dashboard || dashboard.urgentOrders.length === 0 ? (
              <EmptyAdminState description="Cuando existan urgentes o pedidos bloqueados apareceran aqui." title="Sin urgentes activos" />
            ) : (
              dashboard.urgentOrders.map((order) => (
                <a className="admin-list-row" href={`#/admin/orders/${order.id}`} key={order.id}>
                  <div>
                    <strong>{order.id}</strong>
                    <p>{order.customer}</p>
                    <small>{order.operator.name} · vence {new Date(order.dueDate).toLocaleDateString('es-ES')}</small>
                  </div>
                  <div className="admin-list-row-meta">
                    <span>{formatCurrency(order.total)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="admin-inline-note">{order.tags.join(' · ')}</p>
                </a>
              ))
            )}
          </div>
        </AdminSection>

        <AdminSection
          description="Atajos internos para mover revision, cola productiva y salida desde un solo panel."
          title="Acciones rapidas"
        >
          <div className="admin-quick-actions">
            {dashboard?.quickActions.map((action) => (
              <a className="content-card admin-quick-action" href={action.href} key={action.href}>
                <strong>{action.label}</strong>
              </a>
            ))}
          </div>
        </AdminSection>
      </div>

      <div className="admin-two-column">
        <AdminSection description="Revision tecnica pendiente o reuploads listos para volver a comprobar." title="Revision de artwork">
          <div className="admin-list-card">
            {dashboard?.artworkQueue.map((upload) => (
              <a className="admin-list-row" href="#/admin/uploads" key={upload.id}>
                <div>
                  <strong>{upload.fileName}</strong>
                  <p>{upload.customer}</p>
                  <small>{upload.operator.name} · {upload.product}</small>
                </div>
                <div className="admin-list-row-meta">
                  <span>{upload.formatLabel}</span>
                  <span className={`priority-pill priority-${upload.validationState === 'blocked' ? 'urgent' : upload.validationState === 'warning' ? 'high' : 'low'}`}>
                    {upload.validationState === 'blocked' ? 'Bloqueado' : upload.validationState === 'warning' ? 'Pendiente' : 'Listo'}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </AdminSection>

        <AdminSection description="Actividad operativa reciente: QA, produccion e incidencias registradas en local." title="Activity feed">
          <OperationsActivityFeed items={dashboard?.activityFeed ?? []} />
        </AdminSection>
      </div>
    </AdminShell>
  )
}

export default DashboardPage
