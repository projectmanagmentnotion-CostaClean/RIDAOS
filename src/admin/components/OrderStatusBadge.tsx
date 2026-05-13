import { orderStatusConfig } from '../config/orderStatuses'
import type { AdminOrderStatus } from '../types/adminModels'

type OrderStatusBadgeProps = {
  status: AdminOrderStatus
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = orderStatusConfig[status]

  return (
    <span className={`status-badge status-${config.colorClass} admin-status-badge`}>
      {config.label}
    </span>
  )
}

export default OrderStatusBadge
