import type {
  AdminApprovalState,
  AdminCustomerSummary,
  AdminDashboardStats,
  AdminDeliveryMethod,
  AdminDeliveryWindow,
  AdminEscalationLevel,
  AdminIncidentType,
  AdminOrder,
  AdminOrderFilters,
  AdminOrderPriority,
  AdminOrderStatus,
  AdminPackingStatus,
  AdminPaymentStatus,
  AdminProductionStatus,
  AdminSlaStatus,
  AdminShippingStatus,
  AdminTicketStatus,
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
  shippingStatus?: AdminShippingStatus
  notes?: string
  productionNotes?: string
  operatorId?: string
  machineId?: string
  scheduledDate?: string
  scheduledWindow?: import('../../admin/types/adminModels').AdminSchedulingWindow
  deliveryMethod?: AdminDeliveryMethod
  packingStatus?: AdminPackingStatus
  carrierLabel?: string
  trackingCode?: string
  deliveryWindow?: AdminDeliveryWindow
  customerContactPreference?: 'phone' | 'email' | 'whatsapp_mock'
  deliveryIncident?: string
  handoffTimeline?: import('../../admin/types/adminModels').AdminTimelineItem[]
  ticketStatus?: AdminTicketStatus
  slaStatus?: AdminSlaStatus
  approvalState?: AdminApprovalState
  escalationLevel?: AdminEscalationLevel
  incidentType?: AdminIncidentType
  serviceNotes?: string
  approvalTimeline?: import('../../admin/types/adminModels').AdminTimelineItem[]
  serviceTimeline?: import('../../admin/types/adminModels').AdminTimelineItem[]
}
export type AdminUploadReviewPatch = {
  status?: AdminUploadReviewStatus
  reviewNotes?: string
}
