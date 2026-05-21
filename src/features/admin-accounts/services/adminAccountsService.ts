import { listAdminOrders } from '../../../admin/services/orderAdminService'
import type { AdminMockUser, AdminOrder } from '../../../admin/types/adminModels'
import { enrichOperationsOrder } from '../../operations/services/operationsMappers'
import { buildApprovalChains } from '../approval-chains/approvalChainService'
import { buildOrderAuditTrail } from '../audit/auditTrailService'
import { adminMockRoles, adminMockUsers } from '../mock/adminAccountsMockData'
import type { AdminAccountsDashboard, AdminAccountSummary } from '../types/adminAccounts'

function withOwnership(order: AdminOrder) {
  return {
    ...order,
    ownerUserId: order.ownerUserId || adminMockUsers[2].id,
    serviceOwnerUserId: order.serviceOwnerUserId || adminMockUsers[4].id,
  }
}

function summarizeUsers(orders: AdminOrder[]) {
  return adminMockUsers.map<AdminAccountSummary>((user) => {
    const assignedOrders = orders.filter((order) => order.ownerUserId === user.id).length
    const assignedTickets = orders.filter((order) => order.serviceOwnerUserId === user.id).length
    const latestActivity =
      orders.flatMap((order) => order.auditTrail).filter((entry) => entry.actorUserId === user.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]

    return {
      ...user,
      assignedOrders,
      assignedTickets,
      latestActivity,
    }
  })
}

export async function getAdminAccountsDashboard(): Promise<AdminAccountsDashboard> {
  const orders = (await listAdminOrders()).map(enrichOperationsOrder).map(withOwnership).map((order) => {
    const auditTrail = buildOrderAuditTrail(order)
    return {
      ...order,
      auditTrail,
      approvalChains: buildApprovalChains(order),
    }
  })

  const recentAudit = orders
    .flatMap((order) => order.auditTrail)
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
    .slice(0, 10)

  return {
    users: summarizeUsers(orders),
    roles: adminMockRoles,
    approvalChains: orders.flatMap((order) => order.approvalChains).slice(0, 8),
    recentAudit,
  }
}

export function resolveMockUser(userId: string): AdminMockUser | undefined {
  return adminMockUsers.find((user) => user.id === userId)
}
