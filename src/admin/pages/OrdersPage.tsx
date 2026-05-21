import { useState } from 'react'
import AdminFilterBar from '../components/AdminFilterBar'
import AdminSearchInput from '../components/AdminSearchInput'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import AdminShell from '../layouts/AdminShell'
import { orderStatusOptions } from '../config/orderStatuses'
import OperationsOrderTable from '../../features/operations/orders/OperationsOrderTable'
import { defaultOperationsFilters } from '../../features/operations/filters/operationsFilterOptions'
import { useOperationsOrders } from '../../features/operations/hooks/useOperationsOrders'
import type { OperationsFilters } from '../../features/operations/types/operations'
import { artworkStatusLabels, shippingStatusLabels } from '../../features/operations/mock/operationsMockData'
import type { AdminOrderPriority } from '../types/adminModels'

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

function getInitialOperationsFilters(): OperationsFilters {
  const base = { ...defaultOperationsFilters }

  if (typeof window === 'undefined') {
    return base
  }

  const hash = window.location.hash
  const [, queryString = ''] = hash.split('?')
  const params = new URLSearchParams(queryString)
  const priority = params.get('priority')
  const status = params.get('status')

  if (priority === 'urgent' || priority === 'high' || priority === 'normal' || priority === 'low') {
    base.priority = priority
  }

  if (status) {
    base.status = status as OperationsFilters['status']
  }

  return base
}

function OrdersPage() {
  const [filters, setFilters] = useState<OperationsFilters>(getInitialOperationsFilters)
  const orders = useOperationsOrders(filters)

  return (
    <AdminShell
      description="Board operativo para buscar, priorizar y ordenar pedidos por arte, urgencia, categoria y salida."
      title="Pedidos y operaciones"
    >
      <AdminSection
        description="Cruza estado, prioridad, categoria y arte para mover la cola sin perder contexto operativo."
        title="Filtros operativos"
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
                  status: event.target.value as OperationsFilters['status'],
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
                  priority: event.target.value as OperationsFilters['priority'],
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
          <label className="field-group">
            <span className="field-label">Categoria</span>
            <select
              className="form-input"
              onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value as OperationsFilters['category'] }))}
              value={filters.category}
            >
              <option value="all">Todas las categorias</option>
              <option value="dtf">DTF</option>
              <option value="textile">Textil</option>
              <option value="paper">Papel</option>
              <option value="material">Material rigido</option>
              <option value="accessory">Accesorio</option>
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Artwork</span>
            <select
              className="form-input"
              onChange={(event) => setFilters((current) => ({ ...current, artworkStatus: event.target.value as OperationsFilters['artworkStatus'] }))}
              value={filters.artworkStatus}
            >
              <option value="all">Todos los estados de arte</option>
              {Object.entries(artworkStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Salida</span>
            <select
              className="form-input"
              onChange={(event) => setFilters((current) => ({ ...current, shippingStatus: event.target.value as OperationsFilters['shippingStatus'] }))}
              value={filters.shippingStatus}
            >
              <option value="all">Todas las salidas</option>
              {Object.entries(shippingStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Ordenar por</span>
            <select
              className="form-input"
              onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value as OperationsFilters['sort'] }))}
              value={filters.sort}
            >
              <option value="newest">Mas recientes</option>
              <option value="dueDate">Vencimiento</option>
              <option value="priority">Prioridad</option>
              <option value="customer">Cliente</option>
            </select>
          </label>
        </AdminFilterBar>
      </AdminSection>

      <AdminSection
        description="Cada fila muestra flujo, arte, salida, operador y fecha objetivo del pedido."
        title="Listado operativo"
      >
        {orders.length === 0 ? (
          <EmptyAdminState
            description="Prueba otra combinacion de filtros para recuperar la cola operativa preparada."
            title="No hay pedidos para estos filtros"
          />
        ) : (
          <OperationsOrderTable formatCurrency={formatCurrency} orders={orders} />
        )}
      </AdminSection>
    </AdminShell>
  )
}

export default OrdersPage
