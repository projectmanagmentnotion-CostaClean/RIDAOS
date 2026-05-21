import type {
  AdminEscalationLevel,
  AdminIncidentType,
  AdminOrderPriority,
  AdminSlaStatus,
  AdminTicketStatus,
} from '../../../../admin/types/adminModels'

export function deriveEscalationLevel(
  priority: AdminOrderPriority,
  slaStatus: AdminSlaStatus,
  ticketStatus: AdminTicketStatus,
  incidentType: AdminIncidentType,
): AdminEscalationLevel {
  if (slaStatus === 'breached' || incidentType === 'damaged_delivery_mock') {
    return 'critical'
  }

  if (ticketStatus === 'escalated' || priority === 'urgent' || incidentType === 'delivery_delay') {
    return 'urgent'
  }

  if (slaStatus === 'at_risk' || priority === 'high' || incidentType === 'urgent_change_request') {
    return 'priority'
  }

  return 'normal'
}

export function getEscalationRecommendation(level: AdminEscalationLevel) {
  switch (level) {
    case 'critical':
      return 'Escalar a direccion operativa y proteger el due date del pedido.'
    case 'urgent':
      return 'Priorizar respuesta y coordinar con produccion o dispatch hoy.'
    case 'priority':
      return 'Revisar en la siguiente ventana operativa y ajustar planning.'
    case 'normal':
    default:
      return 'Mantener seguimiento dentro del flujo estandar.'
  }
}
