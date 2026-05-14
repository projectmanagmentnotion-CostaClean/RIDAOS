export const appRoles = ['guest', 'customer', 'admin', 'production', 'designer', 'super_admin'] as const

export type AppRole = (typeof appRoles)[number]

export const permissions = [
  'view_public_catalog',
  'create_order',
  'upload_artwork',
  'view_own_orders',
  'manage_orders',
  'review_artwork',
  'update_production_status',
  'manage_catalog',
  'manage_customers',
  'manage_settings',
] as const

export type Permission = (typeof permissions)[number]

const rolePermissions: Record<AppRole, Permission[]> = {
  guest: ['view_public_catalog', 'create_order'],
  customer: ['view_public_catalog', 'create_order', 'upload_artwork', 'view_own_orders'],
  admin: ['view_public_catalog', 'manage_orders', 'review_artwork', 'manage_catalog', 'manage_customers'],
  production: ['view_public_catalog', 'manage_orders', 'update_production_status', 'review_artwork'],
  designer: ['view_public_catalog', 'review_artwork', 'upload_artwork'],
  super_admin: [...permissions],
}

export function hasPermission(role: AppRole, permission: Permission) {
  return rolePermissions[role].includes(permission)
}

export function canAccessAdmin(role: AppRole) {
  return role !== 'guest' && role !== 'customer'
}
