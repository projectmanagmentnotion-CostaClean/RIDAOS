import type {
  AdminArtworkStatus,
  AdminCommentCategory,
  AdminOperator,
  AdminOrder,
  AdminOrderPriority,
  AdminShippingStatus,
  AdminUploadRecord,
} from '../../../admin/types/adminModels'

export type OperationsQueueStage =
  | 'new'
  | 'reviewing_artwork'
  | 'preparing'
  | 'printing'
  | 'quality_control'
  | 'packaging'
  | 'shipped'
  | 'delivered'

export type OperationsSortKey = 'newest' | 'dueDate' | 'priority' | 'customer'

export type OperationsFilters = {
  search: string
  status: AdminOrder['status'] | 'all'
  priority: AdminOrderPriority | 'all'
  category: AdminOrder['productType'] | 'all'
  artworkStatus: AdminArtworkStatus | 'all'
  shippingStatus: AdminShippingStatus | 'all'
  stage: OperationsQueueStage | 'all'
  sort: OperationsSortKey
}

export type OperationsKpi = {
  key: string
  label: string
  value: number | string
  note: string
}

export type OperationsQuickAction = {
  label: string
  href: string
  tone?: 'default' | 'warning' | 'success'
}

export type OperationsActivityItem = {
  id: string
  title: string
  detail: string
  timestamp: string
  tone: 'default' | 'warning' | 'success'
  href?: string
}

export type ProductionStageDefinition = {
  key: OperationsQueueStage
  label: string
  description: string
}

export type OperationsOrderRecord = AdminOrder & {
  queueStage: OperationsQueueStage
}

export type OperationsUploadRecord = AdminUploadRecord & {
  validationState: 'ready' | 'warning' | 'blocked'
}

export type OperationsDashboardData = {
  kpis: OperationsKpi[]
  urgentOrders: OperationsOrderRecord[]
  artworkQueue: OperationsUploadRecord[]
  productionQueue: OperationsOrderRecord[]
  readyForDispatch: OperationsOrderRecord[]
  activityFeed: OperationsActivityItem[]
  quickActions: OperationsQuickAction[]
}

export type OperationsNoteInput = {
  body: string
  category: AdminCommentCategory
}

export type OperationsReviewAction = {
  status: AdminUploadRecord['status']
  label: string
}

export type OperationsRosterAssignment = {
  operator: AdminOperator
  fallbackTags: string[]
}
