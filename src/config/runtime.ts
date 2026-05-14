export type DataMode = 'mock' | 'supabase'
export type AuthMode = 'none' | 'supabase'
export type PaymentsMode = 'disabled' | 'stripe'
export type AdminMode = 'mock' | 'supabase'

type RuntimeConfig = {
  dataMode: DataMode
  authMode: AuthMode
  paymentsMode: PaymentsMode
  adminMode: AdminMode
}

const env = import.meta.env as ImportMetaEnv & {
  VITE_RIDAOS_DATA_MODE?: string
  VITE_RIDAOS_AUTH_MODE?: string
  VITE_RIDAOS_PAYMENTS_MODE?: string
  VITE_RIDAOS_ADMIN_MODE?: string
}

function resolveDataMode(value: string | undefined): DataMode {
  return value === 'supabase' ? 'supabase' : 'mock'
}

function resolveAuthMode(value: string | undefined): AuthMode {
  return value === 'supabase' ? 'supabase' : 'none'
}

function resolvePaymentsMode(value: string | undefined): PaymentsMode {
  return value === 'stripe' ? 'stripe' : 'disabled'
}

function resolveAdminMode(value: string | undefined): AdminMode {
  return value === 'supabase' ? 'supabase' : 'mock'
}

export const runtimeConfig: RuntimeConfig = {
  dataMode: resolveDataMode(env.VITE_RIDAOS_DATA_MODE),
  authMode: resolveAuthMode(env.VITE_RIDAOS_AUTH_MODE),
  paymentsMode: resolvePaymentsMode(env.VITE_RIDAOS_PAYMENTS_MODE),
  adminMode: resolveAdminMode(env.VITE_RIDAOS_ADMIN_MODE),
}
