import type {
  AdminApprovalState,
  AdminEscalationLevel,
  AdminIncidentType,
  AdminSlaStatus,
  AdminTicketStatus,
} from '../../../../admin/types/adminModels'

export const incidentTypeLabels: Record<AdminIncidentType, string> = {
  artwork_invalid: 'Archivo invalido',
  customer_change_request: 'Cambio solicitado por cliente',
  delivery_delay: 'Retraso en entrega',
  production_quality_review: 'Revision de calidad',
  missing_information: 'Informacion incompleta',
  urgent_change_request: 'Cambio urgente',
  payment_issue_mock: 'Incidencia de pago mock',
  damaged_delivery_mock: 'Entrega danada mock',
}

export const ticketStatusLabels: Record<AdminTicketStatus, string> = {
  open: 'Abierto',
  waiting_customer: 'Esperando cliente',
  waiting_internal: 'Esperando interno',
  resolved: 'Resuelto',
  escalated: 'Escalado',
  archived: 'Archivado',
}

export const slaStatusLabels: Record<AdminSlaStatus, string> = {
  on_track: 'En plazo',
  at_risk: 'En riesgo',
  breached: 'Fuera de SLA',
}

export const approvalStateLabels: Record<AdminApprovalState, string> = {
  pending_review: 'Pendiente de revision',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  changes_requested: 'Cambios solicitados',
  customer_updated_artwork: 'Cliente actualizo archivo',
  approved_for_production: 'Aprobado para produccion',
  production_locked: 'Produccion bloqueada',
}

export const escalationLevelLabels: Record<AdminEscalationLevel, string> = {
  normal: 'Normal',
  priority: 'Prioridad',
  urgent: 'Urgente',
  critical: 'Critico',
}

export const approvalFlowStates: AdminApprovalState[] = [
  'pending_review',
  'changes_requested',
  'customer_updated_artwork',
  'approved_for_production',
  'production_locked',
]
