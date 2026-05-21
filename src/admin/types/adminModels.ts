import type { OrderItem } from '../../types/backend'
import type { OrderLifecycleStatus } from '../../domain/orders/order-status.types'

export type AdminOrderStatus =
  | 'pending_review'
  | 'approved'
  | 'needs_changes'
  | 'awaiting_payment'
  | 'paid'
  | 'in_production'
  | 'quality_check'
  | 'ready'
  | 'completed'
  | 'cancelled'

export type AdminOrderPriority = 'low' | 'normal' | 'high' | 'urgent'

export type AdminPaymentStatus = 'pending' | 'awaiting_payment' | 'paid' | 'not_required'

export type AdminProductionStatus =
  | 'not_started'
  | 'queued'
  | 'printing'
  | 'finishing'
  | 'quality_check'
  | 'ready'
  | 'completed'

export type AdminUploadReviewStatus = 'pending' | 'approved' | 'needs_fix' | 'reuploaded'
export type AdminArtworkStatus = 'missing' | 'pending_review' | 'needs_fix' | 'approved' | 'ready_for_production'
export type AdminShippingStatus = 'not_ready' | 'label_pending' | 'ready_for_dispatch' | 'shipped' | 'delivered'
export type AdminCommentCategory = 'internal' | 'qa' | 'production' | 'service'
export type AdminDeliveryMethod = 'pickup' | 'local_delivery' | 'courier' | 'own_route'
export type AdminPackingStatus = 'not_packed' | 'packing' | 'packed' | 'handoff_ready'
export type AdminDeliveryWindow = '09-13' | '13-17' | '17-20'
export type AdminIncidentType =
  | 'artwork_invalid'
  | 'customer_change_request'
  | 'delivery_delay'
  | 'production_quality_review'
  | 'missing_information'
  | 'urgent_change_request'
  | 'payment_issue_mock'
  | 'damaged_delivery_mock'
export type AdminTicketStatus = 'open' | 'waiting_customer' | 'waiting_internal' | 'resolved' | 'escalated' | 'archived'
export type AdminSlaStatus = 'on_track' | 'at_risk' | 'breached'
export type AdminApprovalState =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'changes_requested'
  | 'customer_updated_artwork'
  | 'approved_for_production'
  | 'production_locked'
export type AdminEscalationLevel = 'normal' | 'priority' | 'urgent' | 'critical'
export type AdminOperator = {
  id: string
  name: string
  role: string
}

export type AdminMachineType = 'dtf_press' | 'cut_plotter' | 'large_format_printer' | 'laminator' | 'prep_table'
export type AdminSchedulingWindow = 'morning' | 'midday' | 'afternoon'
export type AdminMachineAssignment = {
  id: string
  label: string
  type: AdminMachineType
}

export type AdminComment = {
  id: string
  author: string
  body: string
  createdAt: string
  category?: AdminCommentCategory
}

export type AdminTimelineItem = {
  id: string
  label: string
  detail: string
  timestamp: string
  tone?: 'default' | 'success' | 'warning'
}

export type AdminOrder = {
  id: string
  customer: string
  email: string
  phone: string
  createdAt: string
  dueDate: string
  items: OrderItem[]
  productType: OrderItem['productType']
  total: number
  status: AdminOrderStatus
  lifecycleStatus: OrderLifecycleStatus
  priority: AdminOrderPriority
  paymentStatus: AdminPaymentStatus
  productionStatus: AdminProductionStatus
  artworkStatus: AdminArtworkStatus
  shippingStatus: AdminShippingStatus
  operator: AdminOperator
  machine: AdminMachineAssignment
  scheduledDate: string
  scheduledWindow: AdminSchedulingWindow
  deliveryMethod: AdminDeliveryMethod
  packingStatus: AdminPackingStatus
  carrierLabel: string
  trackingCode: string
  deliveryWindow: AdminDeliveryWindow
  customerContactPreference: 'phone' | 'email' | 'whatsapp_mock'
  deliveryIncident?: string
  handoffTimeline: AdminTimelineItem[]
  ticketStatus: AdminTicketStatus
  slaStatus: AdminSlaStatus
  approvalState: AdminApprovalState
  escalationLevel: AdminEscalationLevel
  incidentType: AdminIncidentType
  serviceNotes: string
  approvalTimeline: AdminTimelineItem[]
  serviceTimeline: AdminTimelineItem[]
  tags: string[]
  notes: string
  uploadIds: string[]
  productionNotes: string
  internalComments: AdminComment[]
  timeline: AdminTimelineItem[]
}

export type AdminUploadRecord = {
  id: string
  orderId: string
  customer: string
  product: string
  productType: OrderItem['productType']
  fileName: string
  fileType: string
  fileSize: number
  formatLabel: string
  uploadedAt: string
  status: AdminUploadReviewStatus
  artworkStatus: AdminArtworkStatus
  operator: AdminOperator
  previewable: boolean
  reviewNotes: string
}

export type AdminCustomerSummary = {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalValue: number
  lastOrderAt: string
}

export type AdminOrderFilters = {
  search: string
  status: AdminOrderStatus | 'all'
  priority: AdminOrderPriority | 'all'
}

export type AdminDashboardStats = {
  pendingReviews: number
  productionQueue: number
  latestUploads: number
  recentCustomers: number
  revenueHint: number
  urgentOrders: number
  artworkQueue: number
  deliveryReady: number
  productionToday: number
  orderCounters: Array<{
    key: string
    label: string
    value: number
  }>
}

export type AdminOrderOverride = {
  status?: AdminOrderStatus
  priority?: AdminOrderPriority
  paymentStatus?: AdminPaymentStatus
  productionStatus?: AdminProductionStatus
  shippingStatus?: AdminShippingStatus
  notes?: string
  productionNotes?: string
  internalComments?: AdminComment[]
  operatorId?: string
  machineId?: string
  scheduledDate?: string
  scheduledWindow?: AdminSchedulingWindow
  deliveryMethod?: AdminDeliveryMethod
  packingStatus?: AdminPackingStatus
  carrierLabel?: string
  trackingCode?: string
  deliveryWindow?: AdminDeliveryWindow
  customerContactPreference?: 'phone' | 'email' | 'whatsapp_mock'
  deliveryIncident?: string
  handoffTimeline?: AdminTimelineItem[]
  ticketStatus?: AdminTicketStatus
  slaStatus?: AdminSlaStatus
  approvalState?: AdminApprovalState
  escalationLevel?: AdminEscalationLevel
  incidentType?: AdminIncidentType
  serviceNotes?: string
  approvalTimeline?: AdminTimelineItem[]
  serviceTimeline?: AdminTimelineItem[]
}

export type AdminUploadOverride = {
  status?: AdminUploadReviewStatus
  reviewNotes?: string
}
