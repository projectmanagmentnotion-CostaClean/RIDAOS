import type {
  AdminApprovalState,
  AdminEscalationLevel,
  AdminIncidentType,
  AdminOrder,
  AdminSlaStatus,
  AdminTicketStatus,
} from '../../../../admin/types/adminModels'

export type ClientServiceSortKey = 'newest' | 'dueDate' | 'sla' | 'priority'

export type ClientServiceFilters = {
  search: string
  ticketStatus: AdminTicketStatus | 'all'
  slaStatus: AdminSlaStatus | 'all'
  approvalState: AdminApprovalState | 'all'
  escalationLevel: AdminEscalationLevel | 'all'
  incidentType: AdminIncidentType | 'all'
  sort: ClientServiceSortKey
}

export type ClientServiceTicketRecord = AdminOrder & {
  slaHoursRemaining: number
  needsImmediateAttention: boolean
  approvalRecommendation: string
}

export type ClientServiceKpi = {
  key: string
  label: string
  value: number
  note: string
}

export type ClientServiceDashboardData = {
  kpis: ClientServiceKpi[]
  openTickets: ClientServiceTicketRecord[]
  pendingApprovals: ClientServiceTicketRecord[]
  escalatedIssues: ClientServiceTicketRecord[]
  waitingCustomer: ClientServiceTicketRecord[]
  urgentReviews: ClientServiceTicketRecord[]
}

export type ClientServiceTemplatePreview = {
  key: string
  label: string
  tone: 'default' | 'success' | 'warning'
  subject: string
  body: string
}
