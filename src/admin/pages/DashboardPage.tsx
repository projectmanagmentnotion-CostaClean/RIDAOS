import { useEffect, useState } from 'react'
import AdminSection from '../components/AdminSection'
import AdminStatCard from '../components/AdminStatCard'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import AdminShell from '../layouts/AdminShell'
import { getAdminDashboardOverview } from '../services/orderAdminService'
import { demoProductionQuickActions } from '../services/demoAdminData'
import type { AdminCustomerSummary, AdminDashboardStats, AdminOrder, AdminUploadRecord } from '../types/adminModels'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

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
      description="Vision rapida de Comprobacion, Fabricacion, archivos y clientes activos."
      title="Resumen interno"
    >
      <div className="admin-stat-grid">
        <AdminStatCard label="Comprobaciones pendientes" note="Pedidos que requieren decision interna" value={stats?.pendingReviews ?? '...'} />
        <AdminStatCard label="Cola de Fabricacion" note="Pedidos en curso o a punto de entrar" value={stats?.productionQueue ?? '...'} />
        <AdminStatCard label="Ultimos uploads" note="Archivos esperando lectura o ajuste" value={stats?.latestUploads ?? '...'} />
        <AdminStatCard label="Ingresos demo" note="hint para futura capa real" value={stats ? formatCurrency(stats.revenueHint) : '...'} />
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
          description="Los ultimos pedidos y su estado actual."
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
                  </div>
                  <div className="admin-list-row-meta">
                    <span>{formatCurrency(order.total)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </a>
              ))
            )}
          </div>
        </AdminSection>

        <AdminSection
          description="Atajos internos para mover la flujo."
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
        <AdminSection description="Ultimos archivos ligados a pedidos." title="Ultimos uploads">
          <div className="admin-list-card">
            {uploads.map((upload) => (
              <a className="admin-list-row" href="#/admin/uploads" key={upload.id}>
                <div>
                  <strong>{upload.fileName}</strong>
                  <p>{upload.customer}</p>
                </div>
                <div className="admin-list-row-meta">
                  <span>{upload.formatLabel}</span>
                  <span className={`status-badge status-${upload.status === 'approved' ? 'success' : upload.status === 'needs_fix' ? 'danger' : 'warning'}`}>
                    {upload.status}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </AdminSection>

        <AdminSection description="Clientes con actividad reciente." title="Clientes recientes">
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
