import type {
  AdminArtworkStatus,
  AdminCommentCategory,
  AdminDeliveryMethod,
  AdminDeliveryWindow,
  AdminMachineAssignment,
  AdminOperator,
  AdminOrder,
  AdminPackingStatus,
  AdminOrderPriority,
  AdminSchedulingWindow,
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

export type OperatorWorkload = {
  operator: AdminOperator
  capacityHours: number
  scheduledJobs: number
  urgentJobs: number
  usedHours: number
  remainingHours: number
  overloaded: boolean
}

export type MachineSlot = {
  id: string
  machine: AdminMachineAssignment
  date: string
  window: AdminSchedulingWindow
  order?: OperationsOrderRecord
  overloaded?: boolean
}

export type DailyCapacitySnapshot = {
  date: string
  usedCapacity: number
  remainingCapacity: number
  totalCapacity: number
  overloaded: boolean
  unassignedJobs: number
}

export type DeliveryPlanningItem = {
  date: string
  items: OperationsOrderRecord[]
}

export type SchedulingBoardDay = {
  date: string
  label: string
  deliveries: OperationsOrderRecord[]
  machineSlots: MachineSlot[]
}

export type SchedulingConflict = {
  id: string
  level: 'warning' | 'critical'
  message: string
  orderIds: string[]
}

export type SchedulingBoardData = {
  days: SchedulingBoardDay[]
  conflicts: SchedulingConflict[]
}

export type CapacityBoardData = {
  today: DailyCapacitySnapshot
  upcomingDeliveries: OperationsOrderRecord[]
  operatorWorkload: OperatorWorkload[]
  machineQueue: Array<{
    machine: AdminMachineAssignment
    queuedJobs: number
    overloaded: boolean
  }>
  unassignedJobs: OperationsOrderRecord[]
  overloadedOperators: OperatorWorkload[]
  deliveryPlanning: DeliveryPlanningItem[]
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

export type SlotRecommendation = {
  date: string
  window: AdminSchedulingWindow
  machine: AdminMachineAssignment
  operator: AdminOperator
  conflictLevel: 'clear' | 'busy'
  note: string
}

export type DispatchBoardColumnKey = 'packing' | 'ready_for_pickup' | 'delivery_queue' | 'incidents'

export type DispatchCardRecord = OperationsOrderRecord & {
  dispatchColumn: DispatchBoardColumnKey
}

export type DispatchKpi = {
  key: string
  label: string
  value: number
  note: string
}

export type DispatchDashboardData = {
  kpis: DispatchKpi[]
  readyForPickup: DispatchCardRecord[]
  packingQueue: DispatchCardRecord[]
  todayDeliveries: DispatchCardRecord[]
  incidents: DispatchCardRecord[]
  handoffs: DispatchCardRecord[]
}

export type DispatchBoardColumns = Record<DispatchBoardColumnKey, DispatchCardRecord[]>

export type DeliveryMessagePreview = {
  key: 'pickup_ready' | 'shipped' | 'incident' | 'delayed' | 'delivered'
  label: string
  message: string
}

export type DeliveryPlanningSnapshot = {
  method: AdminDeliveryMethod
  packingStatus: AdminPackingStatus
  window: AdminDeliveryWindow
  carrierLabel: string
  trackingCode: string
}
