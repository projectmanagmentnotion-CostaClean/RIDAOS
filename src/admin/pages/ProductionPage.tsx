import { useEffect, useState } from 'react'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import AdminShell from '../layouts/AdminShell'
import { getLifecycleDescriptorFromAdminStatus } from '../utils/adminLifecycle'
import { listProductionQueue } from '../services/orderAdminService'
import type { AdminOrder } from '../types/adminModels'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

function ProductionPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])

  useEffect(() => {
    let cancelled = false

    void listProductionQueue().then((data) => {
      if (!cancelled) {
        setOrders(data)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminShell
      description="Cola interna preparada para lanzamiento, fabricacion, control de calidad y salida."
      title="Fabricacion"
    >
      <AdminSection
        description="Cada tarjeta deja visible prioridad, lectura publica y siguiente accion operativa."
        title="Cola de fabricacion"
      >
        {orders.length === 0 ? (
          <EmptyAdminState description="Los pedidos aprobados o en Fabricacion apareceran aqui." title="No hay cola de Fabricacion" />
        ) : (
          <div className="admin-production-grid">
            {orders.map((order) => {
              const lifecycle = getLifecycleDescriptorFromAdminStatus(order.status)

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
                      <span>Lectura publica</span>
                      <strong>{lifecycle.publicLabel}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Prioridad</span>
                      <strong>{order.priority}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Total</span>
                      <strong>{formatCurrency(order.total)}</strong>
                    </div>
                  </div>
                  <p className="admin-inline-note">{lifecycle.nextAction.admin}</p>
                  <p>{order.productionNotes || 'Sin notas de fabricacion registradas todavia.'}</p>
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
