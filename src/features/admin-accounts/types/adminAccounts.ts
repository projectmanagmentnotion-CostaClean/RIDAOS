import type {
  AdminApprovalChain,
  AdminAuditEntry,
  AdminMockPermission,
  AdminMockRole,
  AdminMockUser,
} from '../../../admin/types/adminModels'

export type AdminAccountSummary = AdminMockUser & {
  assignedOrders: number
  assignedTickets: number
  latestActivity?: AdminAuditEntry
}

export type AdminRoleDefinition = {
  key: AdminMockRole
  label: string
  description: string
  permissions: AdminMockPermission[]
}

export type AdminAccountsDashboard = {
  users: AdminAccountSummary[]
  roles: AdminRoleDefinition[]
  approvalChains: AdminApprovalChain[]
  recentAudit: AdminAuditEntry[]
}
