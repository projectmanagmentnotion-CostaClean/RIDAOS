import { listAdminOrders } from '../../../../admin/services/orderAdminService'
import type { AdminOrder } from '../../../../admin/types/adminModels'
import { getApprovalRecommendation } from '../approvals/approvalFlow'
import { buildClientServiceTemplatePreviews } from '../communication/communicationPreview'
import { approvalStateLabels, escalationLevelLabels, incidentTypeLabels, slaStatusLabels, ticketStatusLabels } from '../mock/clientServiceMockData'
import { getEscalationRecommendation } from '../escalation/escalationRules'
import { getSlaHoursRemaining, needsImmediateAttention } from '../sla/slaSelectors'
import type {
  ClientServiceDashboardData,
  ClientServiceFilters,
  ClientServiceTemplatePreview,
  ClientServiceTicketRecord,
} from '../types/clientService'
import { enrichOperationsOrder } from '../../services/operationsMappers'

function toTicket(order: AdminOrder): ClientServiceTicketRecord {
  return {
    ...order,
    slaHoursRemaining: getSlaHoursRemaining(order),
    needsImmediateAttention: needsImmediateAttention(order.slaStatus, order.escalationLevel),
    approvalRecommendation: getApprovalRecommendation(order.approvalState),
  }
}

function matchesFilter(order: ClientServiceTicketRecord, filters: ClientServiceFilters) {
  const query = filters.search.trim().toLowerCase()
  const searchHit =
    !query ||
    order.id.toLowerCase().includes(query) ||
    order.customer.toLowerCase().includes(query) ||
    incidentTypeLabels[order.incidentType].toLowerCase().includes(query) ||
    ticketStatusLabels[order.ticketStatus].toLowerCase().includes(query)

  return (
    searchHit &&
    (filters.ticketStatus === 'all' || order.ticketStatus === filters.ticketStatus) &&
    (filters.slaStatus === 'all' || order.slaStatus === filters.slaStatus) &&
    (filters.approvalState === 'all' || order.approvalState === filters.approvalState) &&
    (filters.escalationLevel === 'all' || order.escalationLevel === filters.escalationLevel) &&
    (filters.incidentType === 'all' || order.incidentType === filters.incidentType)
  )
}

function sortTickets(tickets: ClientServiceTicketRecord[], sort: ClientServiceFilters['sort']) {
  return [...tickets].sort((left, right) => {
    if (sort === 'priority') {
      return right.priority.localeCompare(left.priority)
    }

    if (sort === 'sla') {
      return left.slaHoursRemaining - right.slaHoursRemaining
    }

    if (sort === 'dueDate') {
      return left.dueDate.localeCompare(right.dueDate)
    }

    return right.createdAt.localeCompare(left.createdAt)
  })
}

export async function getClientServiceTickets(filters: ClientServiceFilters) {
  const orders = await listAdminOrders()
  const tickets = orders.map(enrichOperationsOrder).map(toTicket)
  return sortTickets(tickets.filter((ticket) => matchesFilter(ticket, filters)), filters.sort)
}

export async function getClientServiceDashboard(): Promise<ClientServiceDashboardData> {
  const orders = await listAdminOrders()
  const tickets = orders.map(enrichOperationsOrder).map(toTicket)

  return {
    kpis: [
      {
        key: 'open-tickets',
        label: 'Open tickets',
        value: tickets.filter((ticket) => ticket.ticketStatus === 'open').length,
        note: 'Pedidos con seguimiento activo del cliente.',
      },
      {
        key: 'sla-risk',
        label: 'SLA en riesgo',
        value: tickets.filter((ticket) => ticket.slaStatus === 'at_risk').length,
        note: 'Casos que necesitan respuesta antes de 24h.',
      },
      {
        key: 'sla-breached',
        label: 'SLA breached',
        value: tickets.filter((ticket) => ticket.slaStatus === 'breached').length,
        note: 'Casos fuera de ventana operativa mock.',
      },
      {
        key: 'pending-approvals',
        label: 'Approvals pendientes',
        value: tickets.filter((ticket) => ticket.approvalState === 'pending_review' || ticket.approvalState === 'customer_updated_artwork').length,
        note: 'Artes listas para revision y decision.',
      },
    ],
    openTickets: tickets.filter((ticket) => ticket.ticketStatus === 'open').slice(0, 6),
    pendingApprovals: tickets
      .filter((ticket) => ticket.approvalState === 'pending_review' || ticket.approvalState === 'customer_updated_artwork')
      .slice(0, 6),
    escalatedIssues: tickets.filter((ticket) => ticket.escalationLevel === 'urgent' || ticket.escalationLevel === 'critical').slice(0, 6),
    waitingCustomer: tickets.filter((ticket) => ticket.ticketStatus === 'waiting_customer').slice(0, 6),
    urgentReviews: tickets.filter((ticket) => ticket.needsImmediateAttention).slice(0, 6),
  }
}

export function getClientServiceTemplatePreviewData(order: AdminOrder): ClientServiceTemplatePreview[] {
  return buildClientServiceTemplatePreviews(order)
}

export function getClientServiceSummaryMeta(order: AdminOrder) {
  return {
    ticketLabel: ticketStatusLabels[order.ticketStatus],
    slaLabel: slaStatusLabels[order.slaStatus],
    approvalLabel: approvalStateLabels[order.approvalState],
    escalationLabel: escalationLevelLabels[order.escalationLevel],
    incidentLabel: incidentTypeLabels[order.incidentType],
    escalationRecommendation: getEscalationRecommendation(order.escalationLevel),
  }
}
