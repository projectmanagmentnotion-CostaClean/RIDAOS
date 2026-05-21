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
    label: 'Owner',
    description: 'Vision completa del sistema y aprobacion final de workflows criticos.',
    permissions: [...adminMockPermissions],
  },
  {
    key: 'admin',
    label: 'Admin',
    description: 'Gestion operativa transversal del mock system.',
    permissions: ['view_orders', 'update_orders', 'approve_artwork', 'manage_schedule', 'manage_dispatch', 'resolve_tickets', 'edit_content_mock'],
  },
  {
    key: 'production_lead',
    label: 'Production lead',
    description: 'Coordina planning, QC y bloqueos de produccion.',
    permissions: ['view_orders', 'update_orders', 'approve_artwork', 'manage_schedule', 'manage_dispatch'],
  },
  {
    key: 'designer',
    label: 'Designer',
    description: 'Revision de artes, cambios y aprobacion tecnica.',
    permissions: ['view_orders', 'approve_artwork'],
  },
  {
    key: 'customer_service',
    label: 'Customer service',
    description: 'Gestion de tickets, SLA y comunicaciones mock.',
    permissions: ['view_orders', 'resolve_tickets'],
  },
  {
    key: 'dispatch_operator',
    label: 'Dispatch operator',
    description: 'Packing, handoff y trazabilidad de salida.',
    permissions: ['view_orders', 'manage_dispatch'],
  },
  {
    key: 'viewer',
    label: 'Viewer',
    description: 'Lectura interna sin capacidad de cambio.',
    permissions: ['view_orders'],
  },
]

export const adminMockUsers: AdminMockUser[] = [
  {
    id: 'user-owner-lucia',
    name: 'Lucia Costa',
    email: 'lucia@ridaosprint.mock',
    role: 'owner',
    permissions: adminMockRoles.find((role) => role.key === 'owner')!.permissions,
    status: 'active',
    workloadLabel: 'Supervision global',
  },
  {
    id: 'user-admin-marco',
    name: 'Marco Ridaos',
    email: 'marco@ridaosprint.mock',
    role: 'admin',
    permissions: adminMockRoles.find((role) => role.key === 'admin')!.permissions,
    status: 'active',
    workloadLabel: 'Operacion transversal',
  },
  {
    id: 'user-prod-sergio',
    name: 'Sergio Ruiz',
    email: 'sergio@ridaosprint.mock',
    role: 'production_lead',
    permissions: adminMockRoles.find((role) => role.key === 'production_lead')!.permissions,
    status: 'busy',
    workloadLabel: 'Cola DTF y QC',
  },
  {
    id: 'user-design-laura',
    name: 'Laura Vidal',
    email: 'laura@ridaosprint.mock',
    role: 'designer',
    permissions: adminMockRoles.find((role) => role.key === 'designer')!.permissions,
    status: 'active',
    workloadLabel: 'Revision de artes',
  },
  {
    id: 'user-service-ines',
    name: 'Ines Mora',
    email: 'ines@ridaosprint.mock',
    role: 'customer_service',
    permissions: adminMockRoles.find((role) => role.key === 'customer_service')!.permissions,
    status: 'active',
    workloadLabel: 'Tickets y SLA',
  },
  {
    id: 'user-dispatch-noa',
    name: 'Noa Sanz',
    email: 'noa@ridaosprint.mock',
    role: 'dispatch_operator',
    permissions: adminMockRoles.find((role) => role.key === 'dispatch_operator')!.permissions,
    status: 'offline',
    workloadLabel: 'Packing y salida',
  },
]

export const approvalChainBlueprints: Record<AdminApprovalChainKey, Omit<AdminApprovalChain, 'steps'>> = {
  artwork_approval: {
    key: 'artwork_approval',
    label: 'Artwork approval',
    currentStatus: 'active',
  },
  urgent_change_request: {
    key: 'urgent_change_request',
    label: 'Urgent change request',
    currentStatus: 'pending',
  },
  production_quality_hold: {
    key: 'production_quality_hold',
    label: 'Production quality hold',
    currentStatus: 'pending',
  },
  delivery_incident: {
    key: 'delivery_incident',
    label: 'Delivery incident',
    currentStatus: 'pending',
  },
  refund_manual_adjustment_mock: {
    key: 'refund_manual_adjustment_mock',
    label: 'Refund / manual adjustment mock',
    currentStatus: 'pending',
  },
  content_publish_mock: {
    key: 'content_publish_mock',
    label: 'Content publish mock',
    currentStatus: 'pending',
  },
}
