import type {
  AdminApprovalChain,
  AdminApprovalChainKey,
  AdminMockPermission,
  AdminMockUser,
} from '../../../admin/types/adminModels'
import type { AdminRoleDefinition } from '../types/adminAccounts'

export const adminMockPermissions: AdminMockPermission[] = [
  'view_orders',
  'update_orders',
  'approve_artwork',
  'manage_schedule',
  'manage_dispatch',
  'resolve_tickets',
  'edit_content_mock',
  'export_reports_mock',
]

export const adminMockRoles: AdminRoleDefinition[] = [
  {
    key: 'owner',
    label: 'Direccion',
    description: 'Vision completa del sistema y aprobacion final de workflows criticos.',
    permissions: [...adminMockPermissions],
  },
  {
    key: 'admin',
    label: 'Administracion',
    description: 'Gestion operativa transversal del sistema.',
    permissions: ['view_orders', 'update_orders', 'approve_artwork', 'manage_schedule', 'manage_dispatch', 'resolve_tickets', 'edit_content_mock'],
  },
  {
    key: 'production_lead',
    label: 'Responsable de produccion',
    description: 'Coordina planning, QC y bloqueos de produccion.',
    permissions: ['view_orders', 'update_orders', 'approve_artwork', 'manage_schedule', 'manage_dispatch'],
  },
  {
    key: 'designer',
    label: 'Diseno',
    description: 'Revision de artes, cambios y aprobacion tecnica.',
    permissions: ['view_orders', 'approve_artwork'],
  },
  {
    key: 'customer_service',
    label: 'Atencion al cliente',
    description: 'Gestion de tickets, SLA y comunicaciones operativas.',
    permissions: ['view_orders', 'resolve_tickets'],
  },
  {
    key: 'dispatch_operator',
    label: 'Despacho',
    description: 'Packing, handoff y trazabilidad de salida.',
    permissions: ['view_orders', 'manage_dispatch'],
  },
  {
    key: 'viewer',
    label: 'Consulta',
    description: 'Lectura interna sin capacidad de cambio.',
    permissions: ['view_orders'],
  },
]

export const adminMockUsers: AdminMockUser[] = [
  {
    id: 'user-owner-lucia',
    name: 'Lucia Costa',
    email: 'lucia@ridaosprint.local',
    role: 'owner',
    permissions: adminMockRoles.find((role) => role.key === 'owner')!.permissions,
    status: 'active',
    workloadLabel: 'Supervision global',
  },
  {
    id: 'user-admin-marco',
    name: 'Marco Ridaos',
    email: 'marco@ridaosprint.local',
    role: 'admin',
    permissions: adminMockRoles.find((role) => role.key === 'admin')!.permissions,
    status: 'active',
    workloadLabel: 'Operacion transversal',
  },
  {
    id: 'user-prod-sergio',
    name: 'Sergio Ruiz',
    email: 'sergio@ridaosprint.local',
    role: 'production_lead',
    permissions: adminMockRoles.find((role) => role.key === 'production_lead')!.permissions,
    status: 'busy',
    workloadLabel: 'Cola DTI y QC',
  },
  {
    id: 'user-design-laura',
    name: 'Laura Vidal',
    email: 'laura@ridaosprint.local',
    role: 'designer',
    permissions: adminMockRoles.find((role) => role.key === 'designer')!.permissions,
    status: 'active',
    workloadLabel: 'Revision de artes',
  },
  {
    id: 'user-service-ines',
    name: 'Ines Mora',
    email: 'ines@ridaosprint.local',
    role: 'customer_service',
    permissions: adminMockRoles.find((role) => role.key === 'customer_service')!.permissions,
    status: 'active',
    workloadLabel: 'Tickets y SLA',
  },
  {
    id: 'user-dispatch-noa',
    name: 'Noa Sanz',
    email: 'noa@ridaosprint.local',
    role: 'dispatch_operator',
    permissions: adminMockRoles.find((role) => role.key === 'dispatch_operator')!.permissions,
    status: 'offline',
    workloadLabel: 'Packing y salida',
  },
]

export const approvalChainBlueprints: Record<AdminApprovalChainKey, Omit<AdminApprovalChain, 'steps'>> = {
  artwork_approval: {
    key: 'artwork_approval',
    label: 'Aprobacion de archivo',
    currentStatus: 'active',
  },
  urgent_change_request: {
    key: 'urgent_change_request',
    label: 'Cambio urgente',
    currentStatus: 'pending',
  },
  production_quality_hold: {
    key: 'production_quality_hold',
    label: 'Bloqueo de calidad',
    currentStatus: 'pending',
  },
  delivery_incident: {
    key: 'delivery_incident',
    label: 'Incidencia de entrega',
    currentStatus: 'pending',
  },
  refund_manual_adjustment_mock: {
    key: 'refund_manual_adjustment_mock',
    label: 'Ajuste manual',
    currentStatus: 'pending',
  },
  content_publish_mock: {
    key: 'content_publish_mock',
    label: 'Publicacion de contenido',
    currentStatus: 'pending',
  },
}
