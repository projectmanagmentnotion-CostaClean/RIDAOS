import { useEffect, useState } from 'react'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import AdminShell from '../layouts/AdminShell'
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
      description="Cola flujo para aprobar, producir, revisar calidad y marcar listos."
      title="Fabricacion"
    >
      <AdminSection title="Cola de Fabricacion">
        {orders.length === 0 ? (
          <EmptyAdminState description="Los pedidos aprobados o en Fabricacion apareceran aqui." title="No hay cola de Fabricacion" />
        ) : (
          <div className="admin-production-grid">
            {orders.map((order) => (
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
                    <span>Fabricacion</span>
                    <strong>{order.productionStatus}</strong>
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
                <p>{order.productionNotes || 'Sin notas de Fabricacion registradas.'}</p>
                <a className="action-button action-link-button" href={`#/admin/orders/${order.id}`}>
                  Abrir flujo
                </a>
              </article>
            ))}
          </div>
        )}
      </AdminSection>
    </AdminShell>
  )
}

export default ProductionPage
