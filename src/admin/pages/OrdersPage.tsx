import { useEffect, useState } from 'react'
import AdminFilterBar from '../components/AdminFilterBar'
import AdminSearchInput from '../components/AdminSearchInput'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import AdminShell from '../layouts/AdminShell'
import { orderStatusOptions } from '../config/orderStatuses'
import { getNextAdminAction, getPublicStatusLabel } from '../selectors/orderSelectors'
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
      description="Busqueda interna preparada para priorizar pedidos por estado, urgencia, cliente y siguiente accion."
      title="Pedidos"
    >
      <AdminSection
        description="Acota la cola por prioridad, estado o cliente sin perder visibilidad del siguiente paso."
        title="Filtros internos"
      >
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

      <AdminSection
        description="Cada fila muestra estado interno, lectura publica y accion sugerida para el equipo."
        title="Listado de pedidos"
      >
        {orders.length === 0 ? (
          <EmptyAdminState
            description="Prueba otro estado, prioridad o termino de busqueda para recuperar la cola preparada."
            title="No hay pedidos para estos filtros"
          />
        ) : (
          <div className="admin-data-table">
            <div className="admin-data-row admin-data-row-head">
              <span>Pedido</span>
              <span>Cliente</span>
              <span>Estado interno</span>
              <span>Lectura publica</span>
              <span>Prioridad</span>
              <span>Total</span>
              <span>Siguiente accion</span>
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
                <span>{getPublicStatusLabel(order)}</span>
                <span className={`priority-pill priority-${order.priority}`}>{order.priority}</span>
                <span>{formatCurrency(order.total)}</span>
                <span>{getNextAdminAction(order)}</span>
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
