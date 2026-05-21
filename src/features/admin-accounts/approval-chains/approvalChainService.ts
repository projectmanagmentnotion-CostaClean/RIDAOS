import type { AdminApprovalChain, AdminApprovalChainKey, AdminApprovalState, AdminMockRole, AdminOrder } from '../../../admin/types/adminModels'
import { approvalChainBlueprints, adminMockUsers } from '../mock/adminAccountsMockData'

function userForRole(role: AdminMockRole) {
  return adminMockUsers.find((user) => user.role === role) ?? adminMockUsers[0]
}

function buildSteps(
  order: AdminOrder,
  chainKey: AdminApprovalChainKey,
  approvalState: AdminApprovalState,
): AdminApprovalChain['steps'] {
  const now = order.createdAt

  if (chainKey === 'artwork_approval') {
    return [
      {
        id: `${order.id}-artwork-designer`,
        label: 'Revision tecnica',
        requiredRole: 'designer',
        assignedUserId: userForRole('designer').id,
        status: approvalState === 'pending_review' || approvalState === 'changes_requested' ? 'active' : 'approved',
        notes: 'Comprobar resolucion, sangrado y calidad del archivo.',
        timestamp: now,
      },
      {
        id: `${order.id}-artwork-production`,
        label: 'Validacion de produccion',
        requiredRole: 'production_lead',
        assignedUserId: userForRole('production_lead').id,
        status: approvalState === 'approved_for_production' || approvalState === 'production_locked' ? 'approved' : 'pending',
        notes: 'Confirmar que el arte puede entrar en scheduling.',
        timestamp: now,
      },
    ]
  }

  if (chainKey === 'delivery_incident') {
    return [
      {
        id: `${order.id}-delivery-dispatch`,
        label: 'Revision dispatch',
        requiredRole: 'dispatch_operator',
        assignedUserId: userForRole('dispatch_operator').id,
        status: order.deliveryIncident ? 'active' : 'pending',
        notes: 'Comprobar handoff y estado del carrier mock.',
        timestamp: now,
      },
      {
        id: `${order.id}-delivery-service`,
        label: 'Respuesta cliente',
        requiredRole: 'customer_service',
        assignedUserId: userForRole('customer_service').id,
        status: order.deliveryIncident ? 'active' : 'pending',
        notes: 'Preparar mensaje y siguiente ventana de entrega.',
        timestamp: now,
      },
    ]
  }

  const role: AdminMockRole =
    chainKey === 'content_publish_mock'
      ? 'admin'
      : chainKey === 'production_quality_hold'
        ? 'production_lead'
        : chainKey === 'urgent_change_request'
          ? 'customer_service'
          : 'owner'

  return [
    {
      id: `${order.id}-${chainKey}-primary`,
      label: approvalChainBlueprints[chainKey].label,
      requiredRole: role,
      assignedUserId: userForRole(role).id,
      status: 'pending',
      notes: 'Cadena mock pendiente de validacion.',
      timestamp: now,
    },
  ]
}

export function buildApprovalChains(order: AdminOrder): AdminApprovalChain[] {
  const keys: AdminApprovalChainKey[] = order.requiredApprovalChainKeys.length
    ? order.requiredApprovalChainKeys
    : ['artwork_approval']

  if (order.approvalChains?.length) {
    return order.approvalChains
  }

  return keys.map((key) => {
    const base = approvalChainBlueprints[key]
    const isTriggered =
      key === 'delivery_incident'
        ? Boolean(order.deliveryIncident)
        : key === 'urgent_change_request'
          ? order.incidentType === 'urgent_change_request'
          : key === 'production_quality_hold'
            ? order.incidentType === 'production_quality_review'
            : key === 'content_publish_mock'
              ? order.ticketStatus === 'open'
              : true

    return {
      ...base,
      currentStatus: isTriggered ? base.currentStatus : 'pending',
      steps: buildSteps(order, key, order.approvalState),
    }
  })
}
