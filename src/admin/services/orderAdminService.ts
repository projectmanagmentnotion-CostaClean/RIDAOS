import { getAdminRepository } from '../../infrastructure/repositoryFactory'
import type {
  AdminOrderFilters,
  AdminOrderPriority,
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminProductionStatus,
  AdminUploadReviewStatus,
} from '../types/adminModels'

const wait = (delay = 100) => new Promise((resolve) => window.setTimeout(resolve, delay))

export async function listAdminOrders(filters?: Partial<AdminOrderFilters>) {
  await wait()
  return getAdminRepository().listOrders(filters)
}

export async function getAdminOrderDetail(orderId: string) {
  await wait()
  return getAdminRepository().getOrderDetail(orderId)
}

export async function updateAdminOrderStatus(orderId: string, status: AdminOrderStatus) {
  await wait(60)
  return getAdminRepository().updateOrderStatus(orderId, status)
}

export async function updateAdminOrderPriority(orderId: string, priority: AdminOrderPriority) {
  await wait(60)
  return getAdminRepository().updateOrderPriority(orderId, priority)
}

export async function updateAdminPaymentStatus(orderId: string, paymentStatus: AdminPaymentStatus) {
  await wait(60)
  return getAdminRepository().updatePaymentStatus(orderId, paymentStatus)
}

export async function updateAdminProductionStatus(orderId: string, productionStatus: AdminProductionStatus) {
  await wait(60)
  return getAdminRepository().updateProductionStatus(orderId, productionStatus)
}

export async function saveAdminOrderNotes(orderId: string, notes: string) {
  await wait(60)
  return getAdminRepository().saveOrderNotes(orderId, notes)
}

export async function saveAdminProductionNotes(orderId: string, notes: string) {
  await wait(60)
  return getAdminRepository().saveProductionNotes(orderId, notes)
}

export async function addAdminInternalComment(orderId: string, body: string) {
  await wait(60)
  return getAdminRepository().addInternalComment(orderId, body)
}

export async function listAdminUploads() {
  await wait()
  return getAdminRepository().listUploads()
}

export async function updateAdminUploadStatus(uploadId: string, status: AdminUploadReviewStatus) {
  await wait(60)
  return getAdminRepository().updateUploadStatus(uploadId, status)
}

export async function updateAdminUploadNotes(uploadId: string, reviewNotes: string) {
  await wait(60)
  return getAdminRepository().updateUploadNotes(uploadId, reviewNotes)
}

export async function listAdminCustomers() {
  await wait()
  return getAdminRepository().listCustomers()
}

export async function listProductionQueue() {
  await wait()
  return getAdminRepository().listProductionQueue()
}

export async function getAdminDashboardOverview() {
  await wait()
  return getAdminRepository().getDashboardOverview()
}
