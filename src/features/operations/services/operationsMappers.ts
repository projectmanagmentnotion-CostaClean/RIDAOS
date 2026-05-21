import type {
  AdminArtworkStatus,
  AdminComment,
  AdminOrder,
  AdminProductionStatus,
  AdminShippingStatus,
  AdminUploadRecord,
} from '../../../admin/types/adminModels'
import {
  artworkStatusLabels,
  operationsQuickActions,
  operationsRosterByProductType,
} from '../mock/operationsMockData'
import type {
  OperationsActivityItem,
  OperationsDashboardData,
  OperationsFilters,
  OperationsOrderRecord,
  OperationsQueueStage,
  OperationsUploadRecord,
} from '../types/operations'

function addBusinessDays(isoDate: string, days: number) {
  const date = new Date(isoDate)
  let remaining = days

  while (remaining > 0) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) {
      remaining -= 1
    }
  }

  return date.toISOString()
}

function getArtworkStatus(order: AdminOrder): AdminArtworkStatus {
  if (!order.uploadIds.length) {
    return 'missing'
  }

  if (order.status === 'needs_changes') {
    return 'needs_fix'
  }

  if (order.status === 'pending_review') {
    return 'pending_review'
  }

  if (order.status === 'approved' || order.status === 'awaiting_payment' || order.status === 'paid') {
    return 'approved'
  }

  return 'ready_for_production'
}

function getShippingStatus(order: AdminOrder): AdminShippingStatus {
  if (order.status === 'completed') {
    return 'delivered'
  }

  if (order.status === 'ready') {
    return 'ready_for_dispatch'
  }

  if (order.productionStatus === 'ready' || order.productionStatus === 'completed') {
    return 'label_pending'
  }

  return 'not_ready'
}

function getQueueStage(order: AdminOrder): OperationsQueueStage {
  if (order.status === 'completed') {
    return 'delivered'
  }
  if (order.status === 'ready') {
    return 'shipped'
  }
  if (order.productionStatus === 'ready') {
    return 'packaging'
  }
  if (order.productionStatus === 'quality_check' || order.status === 'quality_check') {
    return 'quality_control'
  }
  if (order.productionStatus === 'printing' || order.status === 'in_production') {
    return 'printing'
  }
  if (order.productionStatus === 'queued' || order.status === 'approved' || order.status === 'awaiting_payment' || order.status === 'paid') {
    return 'preparing'
  }
  if (order.status === 'pending_review' || order.status === 'needs_changes') {
    return 'reviewing_artwork'
  }
  return 'new'
}

function getDueDate(order: AdminOrder) {
  const days =
    order.priority === 'urgent'
      ? 1
      : order.priority === 'high'
        ? 2
        : order.productType === 'dtf'
          ? 3
          : 5

  return addBusinessDays(order.createdAt, days)
}

function getTags(order: AdminOrder) {
  const roster = operationsRosterByProductType[order.productType]
  const tags = new Set<string>(roster?.fallbackTags ?? [order.productType])

  if (order.priority === 'urgent') {
    tags.add('24h')
  }
  if (order.paymentStatus === 'awaiting_payment') {
    tags.add('cobro pendiente')
  }
  if (order.items.some((item) => item.artwork.fileType === 'application/pdf')) {
    tags.add('pdf')
  }

  return Array.from(tags)
}

function mapCommentToActivity(order: OperationsOrderRecord, comment: AdminComment): OperationsActivityItem {
  return {
    id: `${order.id}-${comment.id}`,
    title:
      comment.category === 'production'
        ? `Nota de produccion en ${order.id}`
        : comment.category === 'qa'
          ? `Nota QA en ${order.id}`
          : `Comentario interno en ${order.id}`,
    detail: comment.body,
    timestamp: comment.createdAt,
    tone: comment.category === 'production' ? 'success' : comment.category === 'qa' ? 'warning' : 'default',
    href: `#/admin/orders/${order.id}`,
  }
}

export function enrichOperationsOrder(order: AdminOrder): OperationsOrderRecord {
  const roster = operationsRosterByProductType[order.productType]
  const artworkStatus = order.artworkStatus ?? getArtworkStatus(order)
  const shippingStatus = order.shippingStatus ?? getShippingStatus(order)
  const queueStage = getQueueStage(order)

  return {
    ...order,
    dueDate: order.dueDate || getDueDate(order),
    artworkStatus,
    shippingStatus,
    queueStage,
    operator:
      order.operator ??
      roster?.operator ?? {
        id: 'operator-generic',
        name: 'Equipo Ridaos',
        role: 'Operacion interna',
      },
    tags: order.tags?.length ? order.tags : getTags(order),
  }
}

export function enrichOperationsUpload(upload: AdminUploadRecord, ordersById: Map<string, OperationsOrderRecord>): OperationsUploadRecord {
  const order = ordersById.get(upload.orderId)
  const validationState =
    upload.status === 'needs_fix' ? 'blocked' : upload.status === 'pending' ? 'warning' : 'ready'

  return {
    ...upload,
    productType: upload.productType ?? order?.productType ?? 'dtf',
    artworkStatus: upload.artworkStatus ?? order?.artworkStatus ?? 'pending_review',
    operator:
      upload.operator ??
      order?.operator ?? {
        id: 'operator-generic',
        name: 'Equipo Ridaos',
        role: 'Revision',
      },
    validationState,
  }
}

export function filterOperationsOrders(orders: OperationsOrderRecord[], filters: OperationsFilters) {
  const search = filters.search.trim().toLowerCase()

  const sorted = orders.filter((order) => {
    const matchesSearch =
      !search ||
      order.id.toLowerCase().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      order.email.toLowerCase().includes(search) ||
      order.tags.some((tag) => tag.toLowerCase().includes(search))

    return (
      matchesSearch &&
      (filters.status === 'all' || order.status === filters.status) &&
      (filters.priority === 'all' || order.priority === filters.priority) &&
      (filters.category === 'all' || order.productType === filters.category) &&
      (filters.artworkStatus === 'all' || order.artworkStatus === filters.artworkStatus) &&
      (filters.shippingStatus === 'all' || order.shippingStatus === filters.shippingStatus) &&
      (filters.stage === 'all' || order.queueStage === filters.stage)
    )
  })

  return sorted.sort((left, right) => {
    switch (filters.sort) {
      case 'priority': {
        const weight = { urgent: 4, high: 3, normal: 2, low: 1 }
        return weight[right.priority] - weight[left.priority]
      }
      case 'dueDate':
        return left.dueDate.localeCompare(right.dueDate)
      case 'customer':
        return left.customer.localeCompare(right.customer)
      case 'newest':
      default:
        return right.createdAt.localeCompare(left.createdAt)
    }
  })
}

export function buildOperationsDashboard(
  orders: OperationsOrderRecord[],
  uploads: OperationsUploadRecord[],
): OperationsDashboardData {
  const nowIso = new Date().toISOString()
  const activityFeed = orders
    .flatMap((order) => order.internalComments.map((comment) => mapCommentToActivity(order, comment)))
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
    .slice(0, 6)

  return {
    kpis: [
      {
        key: 'active-orders',
        label: 'Pedidos activos',
        value: orders.filter((order) => !['completed', 'cancelled'].includes(order.status)).length,
        note: 'Cola viva entre arte, produccion y salida.',
      },
      {
        key: 'urgent-orders',
        label: 'Urgentes',
        value: orders.filter((order) => order.priority === 'urgent').length,
        note: 'Pedidos con ventana operativa corta.',
      },
      {
        key: 'artwork-queue',
        label: 'Revision de arte',
        value: uploads.filter((upload) => upload.artworkStatus === 'pending_review' || upload.artworkStatus === 'needs_fix').length,
        note: 'Archivos bloqueando entrada a cola.',
      },
      {
        key: 'dispatch-ready',
        label: 'Listos para salida',
        value: orders.filter((order) => order.shippingStatus === 'ready_for_dispatch').length,
        note: 'Pedidos esperando etiqueta o expedicion.',
      },
    ],
    urgentOrders: orders.filter((order) => order.priority === 'urgent').slice(0, 4),
    artworkQueue: uploads.filter((upload) => upload.validationState !== 'ready').slice(0, 5),
    productionQueue: orders.filter((order) => ['preparing', 'printing', 'quality_control', 'packaging'].includes(order.queueStage)).slice(0, 6),
    readyForDispatch: orders.filter((order) => order.shippingStatus === 'ready_for_dispatch' || order.shippingStatus === 'label_pending').slice(0, 4),
    activityFeed:
      activityFeed.length > 0
        ? activityFeed
        : [
            {
              id: 'ops-seed',
              title: 'Sistema operativo listo',
              detail: 'No hay incidencias nuevas. La capa mock sigue preparada para datos reales.',
              timestamp: nowIso,
              tone: 'default',
            },
          ],
    quickActions: operationsQuickActions,
  }
}

export function getProductionStats(orders: OperationsOrderRecord[]) {
  return {
    byStage: {
      new: orders.filter((order) => order.queueStage === 'new').length,
      reviewing_artwork: orders.filter((order) => order.queueStage === 'reviewing_artwork').length,
      preparing: orders.filter((order) => order.queueStage === 'preparing').length,
      printing: orders.filter((order) => order.queueStage === 'printing').length,
      quality_control: orders.filter((order) => order.queueStage === 'quality_control').length,
      packaging: orders.filter((order) => order.queueStage === 'packaging').length,
      shipped: orders.filter((order) => order.queueStage === 'shipped').length,
      delivered: orders.filter((order) => order.queueStage === 'delivered').length,
    },
    artworkPending: orders.filter((order) => order.artworkStatus === 'pending_review' || order.artworkStatus === 'needs_fix').length,
    labelPending: orders.filter((order) => order.shippingStatus === 'label_pending').length,
    overdue: orders.filter((order) => order.dueDate < new Date().toISOString() && !['delivered', 'shipped'].includes(order.queueStage)).length,
  }
}

export function getArtworkStatusLabel(status: AdminArtworkStatus) {
  return artworkStatusLabels[status]
}

export function getProductionStatusTone(status: AdminProductionStatus | OperationsQueueStage) {
  if (status === 'quality_control' || status === 'quality_check' || status === 'reviewing_artwork') {
    return 'warning'
  }

  if (status === 'packaging' || status === 'shipped' || status === 'delivered' || status === 'completed' || status === 'ready') {
    return 'success'
  }

  return 'default'
}
