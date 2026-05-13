import { useOrderStore } from '../../store/useOrderStore'
import { useAdminUiStore } from '../store/useAdminUiStore'
import {
  filterAdminOrders,
  getAdminCustomerSummaries,
  getAdminDashboardStats,
  getProductionOrders,
  mapOrdersToUploads,
  mapOrderToAdminOrder,
  sortOrdersByNewest,
} from '../selectors/orderSelectors'
import type {
  AdminComment,
  AdminOrderFilters,
  AdminOrderPriority,
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminProductionStatus,
  AdminUploadReviewStatus,
} from '../types/adminModels'

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

export async function listAdminOrders(filters?: Partial<AdminOrderFilters>) {
  await wait()
  const effectiveFilters: AdminOrderFilters = {
    search: filters?.search ?? '',
    status: filters?.status ?? 'all',
    priority: filters?.priority ?? 'all',
  }

  return filterAdminOrders(readAdminOrders(), effectiveFilters)
}

export async function getAdminOrderDetail(orderId: string) {
  await wait()
  return readAdminOrders().find((order) => order.id === orderId) ?? null
}

export async function updateAdminOrderStatus(orderId: string, status: AdminOrderStatus) {
  useAdminUiStore.getState().setOrderStatus(orderId, status)
  await wait(60)
  return getAdminOrderDetail(orderId)
}

export async function updateAdminOrderPriority(orderId: string, priority: AdminOrderPriority) {
  useAdminUiStore.getState().setOrderPriority(orderId, priority)
  await wait(60)
  return getAdminOrderDetail(orderId)
}

export async function updateAdminPaymentStatus(orderId: string, paymentStatus: AdminPaymentStatus) {
  useAdminUiStore.getState().setPaymentStatus(orderId, paymentStatus)
  await wait(60)
  return getAdminOrderDetail(orderId)
}

export async function updateAdminProductionStatus(orderId: string, productionStatus: AdminProductionStatus) {
  useAdminUiStore.getState().setProductionStatus(orderId, productionStatus)
  await wait(60)
  return getAdminOrderDetail(orderId)
}

export async function saveAdminOrderNotes(orderId: string, notes: string) {
  useAdminUiStore.getState().setOrderNotes(orderId, notes)
  await wait(60)
  return getAdminOrderDetail(orderId)
}

export async function saveAdminProductionNotes(orderId: string, notes: string) {
  useAdminUiStore.getState().setProductionNotes(orderId, notes)
  await wait(60)
  return getAdminOrderDetail(orderId)
}

export async function addAdminInternalComment(orderId: string, body: string) {
  const comment: AdminComment = {
    id: `comment-${orderId}-${Date.now()}`,
    author: 'Equipo Ridaos',
    body,
    createdAt: new Date().toISOString(),
  }

  useAdminUiStore.getState().addInternalComment(orderId, comment)
  await wait(60)
  return getAdminOrderDetail(orderId)
}

export async function listAdminUploads() {
  await wait()
  return readAdminUploads()
}

export async function updateAdminUploadStatus(uploadId: string, status: AdminUploadReviewStatus) {
  useAdminUiStore.getState().setUploadStatus(uploadId, status)
  await wait(60)
  return readAdminUploads().find((upload) => upload.id === uploadId) ?? null
}

export async function updateAdminUploadNotes(uploadId: string, reviewNotes: string) {
  useAdminUiStore.getState().setUploadReviewNotes(uploadId, reviewNotes)
  await wait(60)
  return readAdminUploads().find((upload) => upload.id === uploadId) ?? null
}

export async function listAdminCustomers() {
  await wait()
  return getAdminCustomerSummaries(readAdminOrders())
}

export async function listProductionQueue() {
  await wait()
  return getProductionOrders(readAdminOrders())
}

export async function getAdminDashboardOverview() {
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
}
