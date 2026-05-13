import type { OrderItem } from '../../types/backend'

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

export type AdminComment = {
  id: string
  author: string
  body: string
  createdAt: string
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
  items: OrderItem[]
  total: number
  status: AdminOrderStatus
  priority: AdminOrderPriority
  paymentStatus: AdminPaymentStatus
  productionStatus: AdminProductionStatus
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
  fileName: string
  fileType: string
  fileSize: number
  formatLabel: string
  uploadedAt: string
  status: AdminUploadReviewStatus
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
  revenuePlaceholder: number
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
  notes?: string
  productionNotes?: string
  internalComments?: AdminComment[]
}

export type AdminUploadOverride = {
  status?: AdminUploadReviewStatus
  reviewNotes?: string
}
