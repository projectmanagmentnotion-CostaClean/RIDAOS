import { useEffect, useState } from 'react'
import AdminFilterBar from '../components/AdminFilterBar'
import AdminSearchInput from '../components/AdminSearchInput'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import AdminShell from '../layouts/AdminShell'
import { orderStatusOptions } from '../config/orderStatuses'
import { listAdminOrders } from '../services/orderAdminService'
import type { AdminOrder, AdminOrderFilters, AdminOrderPriority } from '../types/adminModels'

const priorityOptions: Array<{ value: AdminOrderPriority | 'all'; label: string }> = [
  { value: 'all', label: 'Todas las prioridades' },
  { value: 'low', label: 'Baja' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

function OrdersPage() {
  const [filters, setFilters] = useState<AdminOrderFilters>({
    search: '',
    status: 'all',
    priority: 'all',
  })
  const [orders, setOrders] = useState<AdminOrder[]>([])

  useEffect(() => {
    let cancelled = false

    void listAdminOrders(filters).then((data) => {
      if (!cancelled) {
        setOrders(data)
      }
    })

    return () => {
      cancelled = true
    }
  }, [filters])

  return (
    <AdminShell
      description="Busqueda y filtros para trabajar pedidos por estado, prioridad o cliente."
      title="Pedidos"
    >
      <AdminSection title="Filtros internos">
        <AdminFilterBar>
          <AdminSearchInput
            onChange={(value) => setFilters((current) => ({ ...current, search: value }))}
            value={filters.search}
          />
          <label className="field-group">
            <span className="field-label">Estado</span>
            <select
              className="form-input"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.target.value as AdminOrderFilters['status'],
                }))
              }
              value={filters.status}
            >
              <option value="all">Todos los estados</option>
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
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  priority: event.target.value as AdminOrderFilters['priority'],
                }))
              }
              value={filters.priority}
            >
              {priorityOptions.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </label>
        </AdminFilterBar>
      </AdminSection>

      <AdminSection description="Lista filtrable con foco en lectura rapida." title="Listado de pedidos">
        {orders.length === 0 ? (
          <EmptyAdminState
            description="Prueba otro estado, prioridad o termino de busqueda."
            title="No hay pedidos para estos filtros"
          />
        ) : (
          <div className="admin-data-table">
            <div className="admin-data-row admin-data-row-head">
              <span>Pedido</span>
              <span>Cliente</span>
              <span>Estado</span>
              <span>Prioridad</span>
              <span>Total</span>
              <span>Uploads</span>
              <span />
            </div>
            {orders.map((order) => (
              <div className="admin-data-row" key={order.id}>
                <span>{order.id}</span>
                <span>
                  <strong>{order.customer}</strong>
                  <small>{order.email}</small>
                </span>
                <span><OrderStatusBadge status={order.status} /></span>
                <span className={`priority-pill priority-${order.priority}`}>{order.priority}</span>
                <span>{formatCurrency(order.total)}</span>
                <span>{order.uploadIds.length}</span>
                <span>
                  <a className="action-button action-link-button" href={`#/admin/orders/${order.id}`}>
                    Ver pedido
                  </a>
                </span>
              </div>
            ))}
          </div>
        )}
      </AdminSection>
    </AdminShell>
  )
}

export default OrdersPage
