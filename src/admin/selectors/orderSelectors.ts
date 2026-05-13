import type { Order } from '../../types/backend'
import type {
  AdminCustomerSummary,
  AdminDashboardStats,
  AdminOrder,
  AdminOrderFilters,
  AdminOrderOverride,
  AdminTimelineItem,
  AdminUploadOverride,
  AdminUploadRecord,
} from '../types/adminModels'

const previewableTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']

function buildTimeline(order: Order, override?: AdminOrderOverride): AdminTimelineItem[] {
  const timeline: AdminTimelineItem[] = [
    {
      id: `${order.id}-received`,
      label: 'Pedido recibido',
      detail: 'El pedido entro en el sistema interno.',
      timestamp: order.createdAt,
      tone: 'default',
    },
  ]

  if (order.items.some((item) => item.artwork.fileName)) {
    timeline.push({
      id: `${order.id}-upload`,
      label: 'Archivo vinculado',
      detail: 'Hay al menos un archivo asociado al pedido.',
      timestamp: order.items[0]?.artwork.uploadedAt ?? order.createdAt,
      tone: 'default',
    })
  }

  if (override?.status === 'approved' || override?.status === 'in_production' || override?.status === 'ready' || override?.status === 'completed') {
    timeline.push({
      id: `${order.id}-approved`,
      label: 'Pedido aprobado',
      detail: 'Revision interna completada.',
      timestamp: order.createdAt,
      tone: 'success',
    })
  }

  if (override?.productionStatus === 'printing' || override?.status === 'in_production') {
    timeline.push({
      id: `${order.id}-production`,
      label: 'En produccion',
      detail: override?.productionNotes || 'Pedido lanzado a cola de produccion.',
      timestamp: order.createdAt,
      tone: 'default',
    })
  }

  if (override?.productionStatus === 'quality_check' || override?.status === 'quality_check') {
    timeline.push({
      id: `${order.id}-quality`,
      label: 'Control de calidad',
      detail: 'Revision final antes de marcar el pedido como listo.',
      timestamp: order.createdAt,
      tone: 'warning',
    })
  }

  if (override?.status === 'ready' || override?.status === 'completed') {
    timeline.push({
      id: `${order.id}-ready`,
      label: 'Listo para entregar',
      detail: 'El pedido puede pasar a recogida o envio.',
      timestamp: order.createdAt,
      tone: 'success',
    })
  }

  return timeline
}

export function mapOrderToAdminOrder(order: Order, override?: AdminOrderOverride): AdminOrder {
  return {
    id: order.id,
    customer: order.customer.name,
    email: order.customer.email,
    phone: order.customer.phone,
    createdAt: order.createdAt,
    items: order.items,
    total: order.total,
    status: override?.status ?? order.status,
    priority: override?.priority ?? 'normal',
    paymentStatus: override?.paymentStatus ?? (order.paymentStatus === 'paid' ? 'paid' : order.paymentStatus === 'disabled' ? 'not_required' : 'pending'),
    productionStatus: override?.productionStatus ?? (order.status === 'completed' ? 'completed' : order.status === 'ready' ? 'ready' : order.status === 'in_production' ? 'printing' : 'not_started'),
    notes: override?.notes ?? '',
    uploadIds: order.items.map((item) => item.artwork.id),
    productionNotes: override?.productionNotes ?? '',
    internalComments: override?.internalComments ?? [],
    timeline: buildTimeline(order, override),
  }
}

export function filterAdminOrders(orders: AdminOrder[], filters: AdminOrderFilters) {
  const search = filters.search.trim().toLowerCase()

  return orders.filter((order) => {
    const matchesSearch =
      !search ||
      order.id.toLowerCase().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      order.email.toLowerCase().includes(search) ||
      order.items.some((item) => item.productName.toLowerCase().includes(search))

    const matchesStatus = filters.status === 'all' || order.status === filters.status
    const matchesPriority = filters.priority === 'all' || order.priority === filters.priority

    return matchesSearch && matchesStatus && matchesPriority
  })
}

export function sortOrdersByNewest(orders: AdminOrder[]) {
  return [...orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

export function mapOrdersToUploads(
  orders: AdminOrder[],
  uploadOverrides: Record<string, AdminUploadOverride>,
): AdminUploadRecord[] {
  return orders.flatMap((order) =>
    order.items.map((item) => {
      const override = uploadOverrides[item.artwork.id]
      return {
        id: item.artwork.id,
        orderId: order.id,
        customer: order.customer,
        product: item.productName,
        fileName: item.artwork.fileName,
        fileType: item.artwork.fileType,
        fileSize: item.artwork.fileSize,
        formatLabel: item.artwork.formatLabel,
        uploadedAt: item.artwork.uploadedAt,
        status: override?.status ?? 'pending',
        previewable: previewableTypes.includes(item.artwork.fileType),
        reviewNotes: override?.reviewNotes ?? item.artwork.notes ?? '',
      }
    }),
  )
}

export function getAdminCustomerSummaries(orders: AdminOrder[]): AdminCustomerSummary[] {
  const customerMap = new Map<string, AdminCustomerSummary>()

  for (const order of orders) {
    const existing = customerMap.get(order.email)

    if (!existing) {
      customerMap.set(order.email, {
        id: order.email,
        name: order.customer,
        email: order.email,
        phone: order.phone,
        totalOrders: 1,
        totalValue: order.total,
        lastOrderAt: order.createdAt,
      })
      continue
    }

    existing.totalOrders += 1
    existing.totalValue += order.total
    if (order.createdAt > existing.lastOrderAt) {
      existing.lastOrderAt = order.createdAt
    }
  }

  return Array.from(customerMap.values()).sort((left, right) => right.lastOrderAt.localeCompare(left.lastOrderAt))
}

export function getAdminDashboardStats(orders: AdminOrder[], uploads: AdminUploadRecord[]): AdminDashboardStats {
  return {
    pendingReviews: orders.filter((order) => order.status === 'pending_review' || order.status === 'needs_changes').length,
    productionQueue: orders.filter((order) => order.status === 'in_production' || order.status === 'quality_check').length,
    latestUploads: uploads.filter((upload) => upload.status === 'pending' || upload.status === 'reuploaded').length,
    recentCustomers: getAdminCustomerSummaries(orders).slice(0, 5).length,
    revenuePlaceholder: orders.reduce((sum, order) => sum + order.total, 0),
    orderCounters: [
      { key: 'total', label: 'Pedidos totales', value: orders.length },
      { key: 'ready', label: 'Listos', value: orders.filter((order) => order.status === 'ready').length },
      { key: 'completed', label: 'Completados', value: orders.filter((order) => order.status === 'completed').length },
    ],
  }
}

export function getProductionOrders(orders: AdminOrder[]) {
  return orders.filter((order) =>
    ['approved', 'awaiting_payment', 'paid', 'in_production', 'quality_check', 'ready'].includes(order.status),
  )
}
