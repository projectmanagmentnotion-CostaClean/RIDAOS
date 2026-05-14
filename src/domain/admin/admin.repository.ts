import type {
  AdminCustomerRecord,
  AdminDashboardOverview,
  AdminOrderLifecyclePatch,
  AdminOrderListFilters,
  AdminOrderRecord,
  AdminUploadQueueItem,
  AdminUploadReviewPatch,
} from './admin.types'
import type {
  AdminOrderPriority,
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminProductionStatus,
  AdminUploadReviewStatus,
} from '../../admin/types/adminModels'

export interface AdminRepository {
  listOrders(filters?: AdminOrderListFilters): Promise<AdminOrderRecord[]>
  getOrderDetail(orderId: string): Promise<AdminOrderRecord | null>
  updateOrderStatus(orderId: string, status: AdminOrderStatus): Promise<AdminOrderRecord | null>
  updateOrderPriority(orderId: string, priority: AdminOrderPriority): Promise<AdminOrderRecord | null>
  updatePaymentStatus(orderId: string, paymentStatus: AdminPaymentStatus): Promise<AdminOrderRecord | null>
  updateProductionStatus(orderId: string, productionStatus: AdminProductionStatus): Promise<AdminOrderRecord | null>
  saveOrderNotes(orderId: string, notes: string): Promise<AdminOrderRecord | null>
  saveProductionNotes(orderId: string, notes: string): Promise<AdminOrderRecord | null>
  listUploads(): Promise<AdminUploadQueueItem[]>
  updateUploadStatus(uploadId: string, status: AdminUploadReviewStatus): Promise<AdminUploadQueueItem | null>
  updateUploadNotes(uploadId: string, reviewNotes: string): Promise<AdminUploadQueueItem | null>
  listCustomers(): Promise<AdminCustomerRecord[]>
  listProductionQueue(): Promise<AdminOrderRecord[]>
  getDashboardOverview(): Promise<AdminDashboardOverview>
  addInternalComment(orderId: string, body: string): Promise<AdminOrderRecord | null>
  patchOrder(orderId: string, patch: AdminOrderLifecyclePatch): Promise<AdminOrderRecord | null>
  patchUpload(uploadId: string, patch: AdminUploadReviewPatch): Promise<AdminUploadQueueItem | null>
}
