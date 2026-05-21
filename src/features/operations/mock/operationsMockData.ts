import type { AdminOperator } from '../../../admin/types/adminModels'
import { capacityMachines, capacityOperators } from '../capacity/capacityMockData'
import type {
  OperationsQuickAction,
  OperationsReviewAction,
  OperationsRosterAssignment,
  ProductionStageDefinition,
} from '../types/operations'

const pressOperator = capacityOperators.find((operator) => operator.id === 'operator-laura') as AdminOperator
const productionOperator = capacityOperators.find((operator) => operator.id === 'operator-sergio') as AdminOperator
const finishingOperator = capacityOperators.find((operator) => operator.id === 'operator-noa') as AdminOperator

export const operationsRosterByProductType: Record<string, OperationsRosterAssignment> = {
  dtf: {
    operator: productionOperator,
    fallbackTags: ['dtf', 'lineal'],
  },
  textile: {
    operator: productionOperator,
    fallbackTags: ['textil', 'drop'],
  },
  paper: {
    operator: pressOperator,
    fallbackTags: ['papel', 'acabado'],
  },
  material: {
    operator: finishingOperator,
    fallbackTags: ['material rigido', 'revision'],
  },
  accessory: {
    operator: finishingOperator,
    fallbackTags: ['accesorio', 'packaging'],
  },
}

export const operationsQuickActions: OperationsQuickAction[] = [
  { label: 'Atacar urgentes', href: '#/admin/orders?priority=urgent', tone: 'warning' },
  { label: 'Abrir revision de artes', href: '#/admin/uploads', tone: 'default' },
  { label: 'Mover cola de produccion', href: '#/admin/production', tone: 'success' },
]

export const machineStatusLabels = Object.fromEntries(capacityMachines.map((machine) => [machine.id, machine.label])) as Record<string, string>

export const productionStageDefinitions: ProductionStageDefinition[] = [
  { key: 'new', label: 'Nuevo', description: 'Pedido recibido y pendiente de triage.' },
  { key: 'reviewing_artwork', label: 'Revision arte', description: 'Comprobacion tecnica del archivo.' },
  { key: 'preparing', label: 'Preparacion', description: 'Planificacion de materiales y slot de maquina.' },
  { key: 'printing', label: 'Impresion', description: 'Trabajo lanzado a produccion.' },
  { key: 'quality_control', label: 'QC', description: 'Revision de color, corte y acabado.' },
  { key: 'packaging', label: 'Packaging', description: 'Cierre, etiquetado y packing interno.' },
  { key: 'shipped', label: 'Enviado', description: 'Pedido entregado al transporte.' },
  { key: 'delivered', label: 'Entregado', description: 'Cierre operativo del encargo.' },
]

export const uploadReviewActions: OperationsReviewAction[] = [
  { status: 'approved', label: 'Aprobar arte' },
  { status: 'needs_fix', label: 'Pedir correccion' },
  { status: 'reuploaded', label: 'Marcar nueva version' },
]

export const shippingStatusLabels = {
  not_ready: 'Sin preparar',
  label_pending: 'Etiqueta pendiente',
  ready_for_dispatch: 'Listo para salida',
  shipped: 'Enviado',
  delivered: 'Entregado',
} as const

export const artworkStatusLabels = {
  missing: 'Sin archivo',
  pending_review: 'Revision pendiente',
  needs_fix: 'Requiere cambios',
  approved: 'Aprobado',
  ready_for_production: 'Listo para produccion',
} as const
