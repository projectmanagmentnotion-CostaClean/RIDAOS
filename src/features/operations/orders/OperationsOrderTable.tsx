import OrderStatusBadge from '../../../admin/components/OrderStatusBadge'
import type { OperationsOrderRecord } from '../types/operations'

type OperationsOrderTableProps = {
  orders: OperationsOrderRecord[]
  formatCurrency: (value: number) => string
}

function OperationsOrderTable({ orders, formatCurrency }: OperationsOrderTableProps) {
  return (
    <div className="admin-data-table">
      <div className="admin-data-row admin-data-row-head">
        <span>Pedido</span>
        <span>Cliente</span>
        <span>Flujo</span>
        <span>Arte</span>
        <span>Salida</span>
        <span>Operador</span>
        <span>Total</span>
        <span />
      </div>
      {orders.map((order) => (
        <div className="admin-data-row" key={order.id}>
          <span>
            <strong>{order.id}</strong>
            <small>{new Date(order.dueDate).toLocaleDateString('es-ES')}</small>
          </span>
          <span>
            <strong>{order.customer}</strong>
            <small>{order.email}</small>
          </span>
          <span>
            <OrderStatusBadge status={order.status} />
            <small>{order.queueStage}</small>
          </span>
          <span>{order.artworkStatus}</span>
          <span>{order.shippingStatus}</span>
          <span>
            <strong>{order.operator.name}</strong>
            <small>{order.operator.role}</small>
          </span>
          <span>{formatCurrency(order.total)}</span>
          <span>
            <a className="action-button action-link-button" href={`#/admin/orders/${order.id}`}>
              Ver pedido
            </a>
          </span>
        </div>
      ))}
    </div>
  )
}

export default OperationsOrderTable
