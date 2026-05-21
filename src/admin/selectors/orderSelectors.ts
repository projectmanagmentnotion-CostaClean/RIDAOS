import type { Order } from '../../types/backend'
import type {
  AdminArtworkStatus,
  AdminCustomerSummary,
  AdminDeliveryMethod,
  AdminDeliveryWindow,
  AdminDashboardStats,
  AdminMachineAssignment,
  AdminOrder,
  AdminOrderFilters,
  AdminOrderOverride,
  AdminOperator,
  AdminPackingStatus,
  AdminSchedulingWindow,
  AdminShippingStatus,
  AdminTimelineItem,
  AdminUploadOverride,
  AdminUploadRecord,
} from '../types/adminModels'
import { getLifecycleDescriptorFromAdminStatus, getLifecycleStatusFromAdminStatus } from '../utils/adminLifecycle'
import { operationsRosterByProductType } from '../../features/operations/mock/operationsMockData'
import { capacityMachines, capacityOperators, capacityWindows, defaultMachineByProductType } from '../../features/operations/capacity/capacityMockData'

const previewableTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']

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

function getArtworkStatus(order: Order, status: AdminOrder['status']): AdminArtworkStatus {
  if (!order.items.length) {
    return 'missing'
  }

  if (status === 'needs_changes') {
    return 'needs_fix'
  }

  if (status === 'pending_review') {
    return 'pending_review'
  }

  if (status === 'approved' || status === 'awaiting_payment' || status === 'paid') {
    return 'approved'
  }

  return 'ready_for_production'
}

function getShippingStatus(status: AdminOrder['status'], productionStatus: AdminOrder['productionStatus']): AdminShippingStatus {
  if (status === 'completed') {
    return 'delivered'
  }
  if (status === 'ready') {
    return 'ready_for_dispatch'
  }
  if (productionStatus === 'ready' || productionStatus === 'completed') {
    return 'label_pending'
  }
  return 'not_ready'
}

function getDeliveryMethod(productType: Order['items'][number]['productType']): AdminDeliveryMethod {
  if (productType === 'dtf' || productType === 'textile') {
    return 'courier'
  }
  if (productType === 'material') {
    return 'own_route'
  }
  return 'pickup'
}

function getPackingStatus(shippingStatus: AdminShippingStatus): AdminPackingStatus {
  if (shippingStatus === 'delivered') {
    return 'handoff_ready'
  }
  if (shippingStatus === 'shipped' || shippingStatus === 'ready_for_dispatch') {
    return 'packed'
  }
  if (shippingStatus === 'label_pending') {
    return 'packing'
  }
  return 'not_packed'
}

function getDeliveryWindow(method: AdminDeliveryMethod): AdminDeliveryWindow {
  if (method === 'pickup') return '17-20'
  if (method === 'own_route') return '13-17'
  return '09-13'
}

function getCarrierLabel(method: AdminDeliveryMethod) {
  switch (method) {
    case 'pickup':
      return 'Desk pickup'
    case 'local_delivery':
      return 'Rider local'
    case 'own_route':
      return 'Ruta propia'
    case 'courier':
    default:
      return 'Courier mock'
  }
}

function getTrackingCode(orderId: string, shippingStatus: AdminShippingStatus) {
  if (shippingStatus === 'not_ready') {
    return ''
  }
  return `RDS-${orderId.replace(/[^0-9]/g, '') || '0000'}`
}

function getDueDate(order: Order, priority: AdminOrder['priority']) {
  const days = priority === 'urgent' ? 1 : priority === 'high' ? 2 : order.items[0]?.productType === 'dtf' ? 3 : 5
  return addBusinessDays(order.createdAt, days)
}

function getOperator(productType: Order['items'][number]['productType']): AdminOperator {
  return (
    operationsRosterByProductType[productType]?.operator ?? {
      id: 'operator-generic',
      name: 'Equipo Ridaos',
      role: 'Operacion interna',
    }
  )
}

function getMachine(productType: Order['items'][number]['productType'], override?: AdminOrderOverride): AdminMachineAssignment {
  const preferredType = defaultMachineByProductType[productType]
  const machine =
    (override?.machineId ? capacityMachines.find((item) => item.id === override.machineId) : null) ??
    capacityMachines.find((item) => item.type === preferredType) ??
    capacityMachines[0]

  return {
    id: machine.id,
    label: machine.label,
    type: machine.type,
  }
}

function getSchedulingWindow(productType: Order['items'][number]['productType'], override?: AdminOrderOverride): AdminSchedulingWindow {
  if (override?.scheduledWindow) {
    return override.scheduledWindow
  }

  return productType === 'dtf' || productType === 'textile' ? 'midday' : productType === 'accessory' ? 'afternoon' : 'morning'
}

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
      detail: 'Comprobacion interna completada.',
      timestamp: order.createdAt,
      tone: 'success',
    })
  }

  if (override?.productionStatus === 'printing' || override?.status === 'in_production') {
    timeline.push({
      id: `${order.id}-production`,
      label: 'En Fabricacion',
      detail: override?.productionNotes || 'Pedido lanzado a cola de Fabricacion.',
      timestamp: order.createdAt,
      tone: 'default',
    })
  }

  if (override?.productionStatus === 'quality_check' || override?.status === 'quality_check') {
    timeline.push({
      id: `${order.id}-quality`,
      label: 'Control de calidad',
      detail: 'Comprobacion final antes de marcar el pedido como listo.',
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

function buildHandoffTimeline(
  order: Order,
  shippingStatus: AdminShippingStatus,
  deliveryMethod: AdminDeliveryMethod,
  override?: AdminOrderOverride,
): AdminTimelineItem[] {
  if (override?.handoffTimeline?.length) {
    return override.handoffTimeline
  }

  const items: AdminTimelineItem[] = [
    {
      id: `${order.id}-handoff-plan`,
      label: 'Plan de salida creado',
      detail: `Metodo previsto: ${deliveryMethod}.`,
      timestamp: order.createdAt,
      tone: 'default',
    },
  ]

  if (shippingStatus === 'ready_for_dispatch' || shippingStatus === 'shipped' || shippingStatus === 'delivered') {
    items.push({
      id: `${order.id}-handoff-ready`,
      label: 'Handoff preparado',
      detail: 'Pedido listo para pickup, rider o mensajeria.',
      timestamp: order.createdAt,
      tone: 'success',
    })
  }

  if (shippingStatus === 'shipped' || shippingStatus === 'delivered') {
    items.push({
      id: `${order.id}-handoff-shipped`,
      label: 'Salida confirmada',
      detail: 'Tracking mock y ventana de entrega preparados.',
      timestamp: order.createdAt,
      tone: 'default',
    })
  }

  if (shippingStatus === 'delivered') {
    items.push({
      id: `${order.id}-handoff-delivered`,
      label: 'Entrega cerrada',
      detail: 'Pedido marcado como entregado en el panel interno.',
      timestamp: order.createdAt,
      tone: 'success',
    })
  }

  return items
}

export function mapOrderToAdminOrder(order: Order, override?: AdminOrderOverride): AdminOrder {
  const status = override?.status ?? order.status
  const priority = override?.priority ?? 'normal'
  const productionStatus =
    override?.productionStatus ?? (order.status === 'completed' ? 'completed' : order.status === 'ready' ? 'ready' : order.status === 'in_production' ? 'printing' : 'not_started')
  const artworkStatus = getArtworkStatus(order, status)
  const shippingStatus = override?.shippingStatus ?? getShippingStatus(status, productionStatus)
  const productType = order.items[0]?.productType ?? 'dtf'
  const scheduledWindow = getSchedulingWindow(productType, override)
  const scheduledDate = override?.scheduledDate ?? getDueDate(order, priority).slice(0, 10)
  const deliveryMethod = override?.deliveryMethod ?? getDeliveryMethod(productType)
  const deliveryWindow = override?.deliveryWindow ?? getDeliveryWindow(deliveryMethod)
  const packingStatus = override?.packingStatus ?? getPackingStatus(shippingStatus)

  return {
    id: order.id,
    customer: order.customer.name,
    email: order.customer.email,
    phone: order.customer.phone,
    createdAt: order.createdAt,
    dueDate: getDueDate(order, priority),
    items: order.items,
    productType,
    total: order.total,
    status,
    lifecycleStatus: getLifecycleStatusFromAdminStatus(status),
    priority,
    paymentStatus: override?.paymentStatus ?? (order.paymentStatus === 'paid' ? 'paid' : order.paymentStatus === 'disabled' ? 'not_required' : 'pending'),
    productionStatus,
    artworkStatus,
    shippingStatus,
    operator:
      (override?.operatorId ? capacityOperators.find((operator) => operator.id === override.operatorId) : null) ??
      getOperator(productType),
    machine: getMachine(productType, override),
    scheduledDate,
    scheduledWindow,
    deliveryMethod,
    packingStatus,
    carrierLabel: override?.carrierLabel ?? getCarrierLabel(deliveryMethod),
    trackingCode: override?.trackingCode ?? getTrackingCode(order.id, shippingStatus),
    deliveryWindow,
    customerContactPreference: override?.customerContactPreference ?? 'email',
    deliveryIncident: override?.deliveryIncident,
    handoffTimeline: buildHandoffTimeline(order, shippingStatus, deliveryMethod, override),
    tags: Array.from(
      new Set([
        ...(operationsRosterByProductType[productType]?.fallbackTags ?? [productType]),
        ...(priority === 'urgent' ? ['24h'] : []),
        ...(order.items.some((item) => item.artwork.fileType === 'application/pdf') ? ['pdf'] : []),
        ...(deliveryMethod === 'pickup' ? ['pickup'] : []),
        ...((capacityWindows.find((window) => window.key === scheduledWindow)?.label ? [capacityWindows.find((window) => window.key === scheduledWindow)!.label.toLowerCase()] : [])),
      ]),
    ),
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
        productType: order.productType,
        fileName: item.artwork.fileName,
        fileType: item.artwork.fileType,
        fileSize: item.artwork.fileSize,
        formatLabel: item.artwork.formatLabel,
        uploadedAt: item.artwork.uploadedAt,
        status: override?.status ?? 'pending',
        artworkStatus: order.artworkStatus,
        operator: order.operator,
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
    revenueHint: orders.reduce((sum, order) => sum + order.total, 0),
    urgentOrders: orders.filter((order) => order.priority === 'urgent').length,
    artworkQueue: uploads.filter((upload) => upload.artworkStatus === 'pending_review' || upload.artworkStatus === 'needs_fix').length,
    deliveryReady: orders.filter((order) => order.shippingStatus === 'ready_for_dispatch' || order.shippingStatus === 'label_pending').length,
    productionToday: orders.filter((order) => ['printing', 'quality_check'].includes(order.productionStatus)).length,
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

export function getNextAdminAction(order: AdminOrder) {
  return getLifecycleDescriptorFromAdminStatus(order.status).nextAction.admin
}

export function getPublicStatusLabel(order: AdminOrder) {
  return getLifecycleDescriptorFromAdminStatus(order.status).publicLabel
}
