import type { ClientServiceDashboardData, ClientServiceTicketRecord } from '../../operations/client-service/types/clientService'
import type { CapacityBoardData, DispatchBoardColumns, OperationsDashboardData, OperationsOrderRecord, OperationsUploadRecord } from '../../operations/types/operations'
import type { AdminAccountsDashboard } from '../../admin-accounts/types/adminAccounts'
import { reportDefinitions, reportHistoryMock } from '../mock/reportDefinitions'
import type { ReportDefinition, ReportDocument, ReportHistoryEntry } from '../types/reporting'

const formatDate = (value: string) => new Date(value).toLocaleString('es-ES')

const base = (definition: ReportDefinition, idSuffix: string): Omit<ReportDocument, 'sections'> => ({
  id: `${definition.id}-${idSuffix}`,
  type: definition.id,
  label: definition.label,
  description: definition.description,
  relatedEntity: definition.relatedEntity,
  status: definition.status,
  generatedAt: new Date().toISOString(),
  availableFormats: definition.availableFormats,
})

function getDefinition(type: ReportDefinition['id']) {
  return reportDefinitions.find((item) => item.id === type) as ReportDefinition
}

export function listReportDefinitions() {
  return reportDefinitions
}

export function getReportHistoryMock(): readonly ReportHistoryEntry[] {
  return reportHistoryMock
}

export function buildOrderSummaryReport(order: OperationsOrderRecord): ReportDocument {
  const definition = getDefinition('ORDER_SUMMARY')
  return {
    ...base(definition, order.id),
    sections: [
      {
        id: 'order-meta',
        title: 'Pedido',
        rows: [
          { label: 'ID', value: order.id },
          { label: 'Cliente', value: order.customer },
          { label: 'Estado', value: order.status },
          { label: 'Prioridad', value: order.priority },
        ],
      },
      {
        id: 'order-production',
        title: 'Produccion',
        rows: [
          { label: 'Artwork', value: order.artworkStatus },
          { label: 'Stage', value: order.queueStage },
          { label: 'Operador', value: order.operator.name },
          { label: 'Maquina', value: order.machine.label },
        ],
      },
      {
        id: 'order-delivery',
        title: 'Entrega',
        rows: [
          { label: 'Metodo', value: order.deliveryMethod },
          { label: 'Salida', value: order.shippingStatus },
          { label: 'Ventana', value: order.deliveryWindow },
          { label: 'Due date', value: formatDate(order.dueDate) },
        ],
      },
    ],
  }
}

export function buildProductionSheetReport(orders: OperationsOrderRecord[]): ReportDocument {
  const definition = getDefinition('PRODUCTION_SHEET')
  return {
    ...base(definition, 'queue'),
    sections: orders.slice(0, 6).map((order) => ({
      id: `production-${order.id}`,
      title: order.id,
      description: `${order.customer} · ${order.productType}`,
      rows: [
        { label: 'Etapa', value: order.queueStage },
        { label: 'Operador', value: order.operator.name },
        { label: 'Slot', value: `${new Date(order.scheduledDate).toLocaleDateString('es-ES')} · ${order.scheduledWindow}` },
        { label: 'Notas', value: order.productionNotes || 'Sin notas' },
      ],
    })),
  }
}

export function buildArtworkReviewReport(upload: OperationsUploadRecord): ReportDocument {
  const definition = getDefinition('ARTWORK_REVIEW_REPORT')
  return {
    ...base(definition, upload.id),
    sections: [
      {
        id: 'upload-meta',
        title: 'Archivo',
        rows: [
          { label: 'Nombre', value: upload.fileName },
          { label: 'Formato', value: upload.formatLabel },
          { label: 'Pedido', value: upload.orderId },
          { label: 'Estado', value: upload.status },
        ],
      },
      {
        id: 'upload-review',
        title: 'Revision',
        rows: [
          { label: 'Artwork', value: upload.artworkStatus },
          { label: 'Validacion', value: upload.validationState },
          { label: 'Operador', value: upload.operator.name },
          { label: 'Notas', value: upload.reviewNotes || 'Sin notas' },
        ],
      },
    ],
  }
}

export function buildPrepressCheckReport(upload: OperationsUploadRecord): ReportDocument {
  const definition = getDefinition('PREPRESS_CHECK_REPORT')
  const summary = upload.previewSummary
  return {
    ...base(definition, upload.id),
    sections: [
      {
        id: 'prepress-score',
        title: 'Score',
        rows: [
          { label: 'Readiness', value: summary ? `${summary.readinessScore}/100` : 'Sin score' },
          { label: 'Estado', value: summary?.readinessState ?? 'Pendiente' },
          { label: 'Accion sugerida', value: summary?.suggestedActionLabel ?? 'Pendiente' },
          { label: 'Impacto', value: summary?.productionImpactSummary ?? 'Sin impacto registrado' },
        ],
      },
      {
        id: 'prepress-checks',
        title: 'Checks clave',
        rows: (summary?.advancedChecks ?? []).slice(0, 6).map((check) => ({
          label: check.title,
          value: `${check.status} · ${check.severity}`,
        })),
      },
    ],
  }
}

export function buildDispatchReport(board: DispatchBoardColumns): ReportDocument {
  const definition = getDefinition('DISPATCH_REPORT')
  return {
    ...base(definition, 'board'),
    sections: Object.entries(board).map(([key, orders]) => ({
      id: `dispatch-${key}`,
      title: key,
      rows: [
        { label: 'Pedidos', value: String(orders.length) },
        { label: 'Clientes', value: orders.slice(0, 3).map((item) => item.customer).join(' · ') || 'Sin items' },
      ],
    })),
  }
}

export function buildDeliveryHandoffReport(order: OperationsOrderRecord): ReportDocument {
  const definition = getDefinition('DELIVERY_HANDOFF_REPORT')
  return {
    ...base(definition, order.id),
    sections: [
      {
        id: 'handoff',
        title: 'Handoff',
        rows: [
          { label: 'Metodo', value: order.deliveryMethod },
          { label: 'Carrier', value: order.carrierLabel },
          { label: 'Tracking', value: order.trackingCode || 'Sin tracking' },
          { label: 'Ventana', value: order.deliveryWindow },
        ],
      },
      {
        id: 'handoff-timeline',
        title: 'Historial',
        rows: order.handoffTimeline.slice(-4).map((item) => ({
          label: item.label,
          value: formatDate(item.timestamp),
        })),
      },
    ],
  }
}

export function buildClientServiceReport(ticket: ClientServiceTicketRecord): ReportDocument {
  const definition = getDefinition('CLIENT_SERVICE_REPORT')
  return {
    ...base(definition, ticket.id),
    sections: [
      {
        id: 'ticket-summary',
        title: 'Ticket',
        rows: [
          { label: 'Estado', value: ticket.ticketStatus },
          { label: 'SLA', value: ticket.slaStatus },
          { label: 'Approval', value: ticket.approvalState },
          { label: 'Escalado', value: ticket.escalationLevel },
        ],
      },
      {
        id: 'ticket-response',
        title: 'Respuesta',
        rows: [
          { label: 'Owner', value: ticket.serviceOwnerUserId },
          { label: 'Horas SLA', value: `${ticket.slaHoursRemaining}` },
          { label: 'Recommendation', value: ticket.approvalRecommendation },
          { label: 'Incidencia', value: ticket.incidentType },
        ],
      },
    ],
  }
}

export function buildCapacityReport(capacity: CapacityBoardData): ReportDocument {
  const definition = getDefinition('CAPACITY_REPORT')
  return {
    ...base(definition, capacity.today.date),
    sections: [
      {
        id: 'capacity-today',
        title: 'Capacidad diaria',
        rows: [
          { label: 'Usada', value: `${capacity.today.usedCapacity} h` },
          { label: 'Libre', value: `${capacity.today.remainingCapacity} h` },
          { label: 'Total', value: `${capacity.today.totalCapacity} h` },
          { label: 'Sin asignar', value: String(capacity.today.unassignedJobs) },
        ],
      },
      {
        id: 'capacity-workload',
        title: 'Carga por operador',
        rows: capacity.operatorWorkload.slice(0, 5).map((item) => ({
          label: item.operator.name,
          value: `${item.usedHours}/${item.capacityHours} h`,
        })),
      },
    ],
  }
}

export function buildAdminKpiReport(input: {
  dashboard: OperationsDashboardData | null
  dispatch: { kpis: Array<{ label: string; value: number }> } | null
  clientService: ClientServiceDashboardData | null
  capacity: CapacityBoardData | null
  accounts?: AdminAccountsDashboard | null
}): ReportDocument {
  const definition = getDefinition('ADMIN_KPI_REPORT')
  return {
    ...base(definition, 'dashboard'),
    sections: [
      {
        id: 'admin-kpis',
        title: 'KPIs',
        rows: [
          ...(input.dashboard?.kpis ?? []).slice(0, 4).map((item) => ({ label: item.label, value: String(item.value) })),
          ...(input.dispatch?.kpis ?? []).slice(0, 2).map((item) => ({ label: item.label, value: String(item.value) })),
        ],
      },
      {
        id: 'admin-support',
        title: 'Service y capacidad',
        rows: [
          { label: 'Open tickets', value: String(input.clientService?.openTickets.length ?? 0) },
          { label: 'Pending approvals', value: String(input.clientService?.pendingApprovals.length ?? 0) },
          { label: 'Overloaded operators', value: String(input.capacity?.overloadedOperators.length ?? 0) },
          { label: 'Usuarios internos', value: String(input.accounts?.users.length ?? 0) },
        ],
      },
    ],
  }
}
