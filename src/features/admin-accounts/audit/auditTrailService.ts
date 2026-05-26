import type { AdminAuditEntry, AdminOrder, AdminOrderOverride } from '../../../admin/types/adminModels'
import { adminMockUsers } from '../mock/adminAccountsMockData'

function pickActor(userId?: string) {
  return adminMockUsers.find((user) => user.id === userId) ?? adminMockUsers[1]
}

export function buildOrderAuditTrail(order: AdminOrder, override?: AdminOrderOverride): AdminAuditEntry[] {
  if (override?.auditTrail?.length) {
    return override.auditTrail
  }

  const actor = pickActor(override?.ownerUserId)

  return [
    {
      id: `${order.id}-audit-created`,
      actorUserId: actor.id,
      actorName: actor.name,
      module: 'orders',
      action: 'Pedido ingresado',
      detail: 'El pedido entra en el sistema interno con trazabilidad operativa.',
      timestamp: order.createdAt,
    },
    {
      id: `${order.id}-audit-approval`,
      actorUserId: pickActor(override?.serviceOwnerUserId).id,
      actorName: pickActor(override?.serviceOwnerUserId).name,
      module: 'client_service',
      action: 'Aprobacion revisada',
      detail: `Estado actual del archivo: ${order.approvalState}.`,
      timestamp: order.createdAt,
    },
    {
      id: `${order.id}-audit-production`,
      actorUserId: actor.id,
      actorName: actor.name,
      module: 'production',
      action: 'Planificacion operativa',
      detail: `Slot ${order.scheduledDate} | ${order.scheduledWindow}.`,
      timestamp: order.createdAt,
    },
    {
      id: `${order.id}-audit-dispatch`,
      actorUserId: actor.id,
      actorName: actor.name,
      module: 'dispatch',
      action: 'Estado de salida',
      detail: `Estado de salida: ${order.shippingStatus}.`,
      timestamp: order.createdAt,
    },
  ]
}
