import { useEffect, useState } from 'react'
import AdminSection from '../components/AdminSection'
import AdminStatCard from '../components/AdminStatCard'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { uploadReviewStatusConfig } from '../config/uploadReviewStatuses'
import AdminShell from '../layouts/AdminShell'
import { getNextAdminAction, getPublicStatusLabel } from '../selectors/orderSelectors'
import { getAdminDashboardOverview } from '../services/orderAdminService'
import { demoProductionQuickActions } from '../services/demoAdminData'
import type { AdminCustomerSummary, AdminDashboardStats, AdminOrder, AdminUploadRecord } from '../types/adminModels'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

/**
 * Editable Zone: ADMIN_DASHBOARD
 * Content: src/content/adminMockContent.ts
 * Visual component: src/admin/pages/DashboardPage.tsx
 */
function DashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [uploads, setUploads] = useState<AdminUploadRecord[]>([])
  const [customers, setCustomers] = useState<AdminCustomerSummary[]>([])

  useEffect(() => {
    let cancelled = false

    void getAdminDashboardOverview().then((data) => {
      if (cancelled) {
        return
      }

      setStats(data.stats)
      setOrders(data.orders)
      setUploads(data.uploads)
      setCustomers(data.customers)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminShell
      description="Vision rapida de comprobacion, fabricacion, archivos y clientes activos desde el panel interno preparado."
      title="Resumen interno"
    >
      <div className="admin-stat-grid">
        <AdminStatCard label="Comprobaciones pendientes" note="Pedidos que requieren decision interna inmediata" value={stats?.pendingReviews ?? '...'} />
        <AdminStatCard label="Cola de fabricacion" note="Pedidos en curso o listos para entrar en maquinas" value={stats?.productionQueue ?? '...'} />
        <AdminStatCard label="Archivos por revisar" note="Uploads esperando validacion, correccion o nueva version" value={stats?.latestUploads ?? '...'} />
        <AdminStatCard label="Valor gestionado" note="Referencia operativa del panel mock preparado" value={stats ? formatCurrency(stats.revenueHint) : '...'} />
      </div>

      <div className="admin-overview-strip">
        <article className="content-card admin-overview-card">
          <p className="section-label">Estado del panel</p>
          <h3>Operaciones internas listas para trabajar en modo preparado.</h3>
          <p>La estructura ya separa revision, pago, produccion y salida sin afirmar conexiones reales.</p>
        </article>
        <article className="content-card admin-overview-card">
          <p className="section-label">Proximo salto</p>
          <h3>Roles, datos reales y storage quedan desacoplados.</h3>
          <p>Este panel ya puede absorber la capa real sin cambiar la lectura operativa principal.</p>
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
          title="Pedidos recientes"
        >
          <div className="admin-list-card">
            {orders.length === 0 ? (
              <EmptyAdminState description="Cuando entren pedidos apareceran aqui." title="No hay pedidos recientes" />
            ) : (
              orders.map((order) => (
                <a className="admin-list-row" href={`#/admin/orders/${order.id}`} key={order.id}>
                  <div>
                    <strong>{order.id}</strong>
                    <p>{order.customer}</p>
                    <small>{getPublicStatusLabel(order)}</small>
                  </div>
                  <div className="admin-list-row-meta">
                    <span>{formatCurrency(order.total)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="admin-inline-note">{getNextAdminAction(order)}</p>
                </a>
              ))
            )}
          </div>
        </AdminSection>

        <AdminSection
          description="Atajos internos para mover revision, archivos y cola productiva."
          title="Acciones rapidas"
        >
          <div className="admin-quick-actions">
            {demoProductionQuickActions.map((action) => (
              <a className="content-card admin-quick-action" href={action.href} key={action.href}>
                <strong>{action.label}</strong>
              </a>
            ))}
          </div>
        </AdminSection>
      </div>

      <div className="admin-two-column">
        <AdminSection description="Ultimos archivos ligados a pedidos y pendientes de lectura." title="Ultimos uploads">
          <div className="admin-list-card">
            {uploads.map((upload) => (
              <a className="admin-list-row" href="#/admin/uploads" key={upload.id}>
                <div>
                  <strong>{upload.fileName}</strong>
                  <p>{upload.customer}</p>
                  <small>{upload.product}</small>
                </div>
                <div className="admin-list-row-meta">
                  <span>{upload.formatLabel}</span>
                  <span className={`status-badge status-${uploadReviewStatusConfig[upload.status].colorClass}`}>
                    {uploadReviewStatusConfig[upload.status].label}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </AdminSection>

        <AdminSection description="Clientes con actividad reciente y volumen acumulado." title="Clientes recientes">
          <div className="admin-list-card">
            {customers.map((customer) => (
              <article className="admin-list-row" key={customer.id}>
                <div>
                  <strong>{customer.name}</strong>
                  <p>{customer.email}</p>
                </div>
                <div className="admin-list-row-meta">
                  <span>{customer.totalOrders} pedidos</span>
                  <span>{formatCurrency(customer.totalValue)}</span>
                </div>
              </article>
            ))}
          </div>
        </AdminSection>
      </div>
    </AdminShell>
  )
}

export default DashboardPage
