import type { AdminRepository } from '../../domain/admin/admin.repository'
import type { AdminDashboardOverview, AdminOrderLifecyclePatch, AdminOrderListFilters, AdminUploadReviewPatch } from '../../domain/admin/admin.types'
import type {
  AdminComment,
  AdminOrderFilters,
  AdminOrderPriority,
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminProductionStatus,
  AdminUploadReviewStatus,
} from '../../admin/types/adminModels'
import { useOrderStore } from '../../store/useOrderStore'
import { useAdminUiStore } from '../../admin/store/useAdminUiStore'
import {
  filterAdminOrders,
  getAdminCustomerSummaries,
  getAdminDashboardStats,
  getProductionOrders,
  mapOrdersToUploads,
  mapOrderToAdminOrder,
  sortOrdersByNewest,
} from '../../admin/selectors/orderSelectors'

const wait = (delay = 100) => new Promise((resolve) => window.setTimeout(resolve, delay))

function readAdminOrders() {
  const orders = useOrderStore.getState().orders
  const overrides = useAdminUiStore.getState().orderOverrides

  return sortOrdersByNewest(
    orders.map((order) => mapOrderToAdminOrder(order, overrides[order.id])),
  )
}

function readAdminUploads() {
  const orders = readAdminOrders()
  const uploadOverrides = useAdminUiStore.getState().uploadOverrides
  return mapOrdersToUploads(orders, uploadOverrides).sort((left, right) =>
    right.uploadedAt.localeCompare(left.uploadedAt),
  )
}

function buildFilters(filters?: AdminOrderListFilters): AdminOrderFilters {
  return {
    search: filters?.search ?? '',
    status: filters?.status ?? 'all',
    priority: filters?.priority ?? 'all',
  }
}

async function getOrderDetail(orderId: string) {
  await wait()
  return readAdminOrders().find((order) => order.id === orderId) ?? null
}

async function getUploadDetail(uploadId: string) {
  await wait()
  return readAdminUploads().find((upload) => upload.id === uploadId) ?? null
}

export const mockAdminRepository: AdminRepository = {
  async listOrders(filters) {
    await wait()
    return filterAdminOrders(readAdminOrders(), buildFilters(filters))
  },
  getOrderDetail,
  async updateOrderStatus(orderId: string, status: AdminOrderStatus) {
    useAdminUiStore.getState().setOrderStatus(orderId, status)
    return getOrderDetail(orderId)
  },
  async updateOrderPriority(orderId: string, priority: AdminOrderPriority) {
    useAdminUiStore.getState().setOrderPriority(orderId, priority)
    return getOrderDetail(orderId)
  },
  async updatePaymentStatus(orderId: string, paymentStatus: AdminPaymentStatus) {
    useAdminUiStore.getState().setPaymentStatus(orderId, paymentStatus)
    return getOrderDetail(orderId)
  },
  async updateProductionStatus(orderId: string, productionStatus: AdminProductionStatus) {
    useAdminUiStore.getState().setProductionStatus(orderId, productionStatus)
    return getOrderDetail(orderId)
  },
  async saveOrderNotes(orderId: string, notes: string) {
    useAdminUiStore.getState().setOrderNotes(orderId, notes)
    return getOrderDetail(orderId)
  },
  async saveProductionNotes(orderId: string, notes: string) {
    useAdminUiStore.getState().setProductionNotes(orderId, notes)
    return getOrderDetail(orderId)
  },
  async listUploads() {
    await wait()
    return readAdminUploads()
  },
  async updateUploadStatus(uploadId: string, status: AdminUploadReviewStatus) {
    useAdminUiStore.getState().setUploadStatus(uploadId, status)
    return getUploadDetail(uploadId)
  },
  async updateUploadNotes(uploadId: string, reviewNotes: string) {
    useAdminUiStore.getState().setUploadReviewNotes(uploadId, reviewNotes)
    return getUploadDetail(uploadId)
  },
  async listCustomers() {
    await wait()
    return getAdminCustomerSummaries(readAdminOrders())
  },
  async listProductionQueue() {
    await wait()
    return getProductionOrders(readAdminOrders())
  },
  async getDashboardOverview(): Promise<AdminDashboardOverview> {
    await wait()
    const orders = readAdminOrders()
    const uploads = readAdminUploads()
    const customers = getAdminCustomerSummaries(orders)

    return {
      stats: getAdminDashboardStats(orders, uploads),
      orders: orders.slice(0, 5),
      uploads: uploads.slice(0, 5),
      customers: customers.slice(0, 5),
    }
  },
  async addInternalComment(orderId: string, body: string, category = 'internal') {
    const comment: AdminComment = {
      id: `comment-${orderId}-${Date.now()}`,
      author: 'Equipo Ridaos',
      body,
      createdAt: new Date().toISOString(),
      category,
    }

    useAdminUiStore.getState().addInternalComment(orderId, comment)
    return getOrderDetail(orderId)
  },
  async patchOrder(orderId: string, patch: AdminOrderLifecyclePatch) {
    const adminStore = useAdminUiStore.getState()
    if (patch.status) {
      adminStore.setOrderStatus(orderId, patch.status)
    }
    if (patch.priority) {
      adminStore.setOrderPriority(orderId, patch.priority)
    }
    if (patch.paymentStatus) {
      adminStore.setPaymentStatus(orderId, patch.paymentStatus)
    }
    if (patch.productionStatus) {
      adminStore.setProductionStatus(orderId, patch.productionStatus)
    }
    if (patch.shippingStatus) {
      adminStore.updateOrderOverride(orderId, { shippingStatus: patch.shippingStatus })
    }
    if (typeof patch.notes === 'string') {
      adminStore.setOrderNotes(orderId, patch.notes)
    }
    if (typeof patch.productionNotes === 'string') {
      adminStore.setProductionNotes(orderId, patch.productionNotes)
    }
    if (
      patch.operatorId ||
      patch.machineId ||
      typeof patch.scheduledDate === 'string' ||
      patch.scheduledWindow ||
      patch.deliveryMethod ||
      patch.packingStatus ||
      typeof patch.carrierLabel === 'string' ||
      typeof patch.trackingCode === 'string' ||
      patch.deliveryWindow ||
      patch.customerContactPreference ||
      typeof patch.deliveryIncident === 'string' ||
      patch.handoffTimeline ||
      patch.ticketStatus ||
      patch.slaStatus ||
      patch.approvalState ||
      patch.escalationLevel ||
      patch.incidentType ||
      typeof patch.serviceNotes === 'string' ||
      patch.approvalTimeline ||
      patch.serviceTimeline ||
      patch.ownerUserId ||
      patch.serviceOwnerUserId ||
      patch.requiredApprovalChainKeys ||
      patch.approvalChains ||
      patch.auditTrail
    ) {
      adminStore.updateOrderOverride(orderId, {
        operatorId: patch.operatorId,
        machineId: patch.machineId,
        scheduledDate: patch.scheduledDate,
        scheduledWindow: patch.scheduledWindow,
        deliveryMethod: patch.deliveryMethod,
        packingStatus: patch.packingStatus,
        carrierLabel: patch.carrierLabel,
        trackingCode: patch.trackingCode,
        deliveryWindow: patch.deliveryWindow,
        customerContactPreference: patch.customerContactPreference,
        deliveryIncident: patch.deliveryIncident,
        handoffTimeline: patch.handoffTimeline,
        ticketStatus: patch.ticketStatus,
        slaStatus: patch.slaStatus,
        approvalState: patch.approvalState,
        escalationLevel: patch.escalationLevel,
        incidentType: patch.incidentType,
        serviceNotes: patch.serviceNotes,
        approvalTimeline: patch.approvalTimeline,
        serviceTimeline: patch.serviceTimeline,
        ownerUserId: patch.ownerUserId,
        serviceOwnerUserId: patch.serviceOwnerUserId,
        requiredApprovalChainKeys: patch.requiredApprovalChainKeys,
        approvalChains: patch.approvalChains,
        auditTrail: patch.auditTrail,
      })
    }
    return getOrderDetail(orderId)
  },
  async patchUpload(uploadId: string, patch: AdminUploadReviewPatch) {
    const adminStore = useAdminUiStore.getState()
    if (patch.status) {
      adminStore.setUploadStatus(uploadId, patch.status)
    }
    if (typeof patch.reviewNotes === 'string') {
      adminStore.setUploadReviewNotes(uploadId, patch.reviewNotes)
    }
    return getUploadDetail(uploadId)
  },
}
