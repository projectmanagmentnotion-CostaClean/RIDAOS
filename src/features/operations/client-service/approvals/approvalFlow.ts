import type { AdminApprovalState } from '../../../../admin/types/adminModels'
import { approvalFlowStates } from '../mock/clientServiceMockData'

export function getNextApprovalState(current: AdminApprovalState): AdminApprovalState {
  const currentIndex = approvalFlowStates.indexOf(current)
  if (currentIndex === -1 || currentIndex === approvalFlowStates.length - 1) {
    return current
  }

  return approvalFlowStates[currentIndex + 1]
}

export function getApprovalRecommendation(state: AdminApprovalState) {
  switch (state) {
    case 'pending_review':
      return 'Revisar archivo y decidir si puede pasar a cambios o a produccion.'
    case 'changes_requested':
      return 'Esperar nueva version del cliente y registrar feedback concreto.'
    case 'customer_updated_artwork':
      return 'Revisar de nuevo el archivo actualizado antes de aprobar.'
    case 'approved_for_production':
      return 'Bloquear arte y mover el pedido a planning productivo.'
    case 'production_locked':
      return 'Mantener solo cambios criticos y registrar cualquier excepcion.'
    case 'rejected':
      return 'Registrar motivo de rechazo y ofrecer alternativa al cliente.'
    case 'approved':
    default:
      return 'El arte esta listo para continuar dentro del flujo operativo.'
  }
}
