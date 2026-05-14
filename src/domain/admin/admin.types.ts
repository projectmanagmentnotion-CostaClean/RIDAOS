import type {
  AdminCustomerSummary,
  AdminDashboardStats,
  AdminOrder,
  AdminOrderFilters,
  AdminOrderPriority,
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminProductionStatus,
  AdminUploadRecord,
  AdminUploadReviewStatus,
} from '../../admin/types/adminModels'

export type AdminOrderRecord = AdminOrder
export type AdminUploadQueueItem = AdminUploadRecord
export type AdminCustomerRecord = AdminCustomerSummary
export type AdminDashboardOverview = {
  stats: AdminDashboardStats
  orders: AdminOrderRecord[]
  uploads: AdminUploadQueueItem[]
  customers: AdminCustomerRecord[]
}
export type AdminOrderListFilters = Partial<AdminOrderFilters>
export type AdminOrderLifecyclePatch = {
  status?: AdminOrderStatus
  priority?: AdminOrderPriority
  paymentStatus?: AdminPaymentStatus
  productionStatus?: AdminProductionStatus
  notes?: string
  productionNotes?: string
}
export type AdminUploadReviewPatch = {
  status?: AdminUploadReviewStatus
  reviewNotes?: string
}
