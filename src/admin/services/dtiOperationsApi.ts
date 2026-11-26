export type DtiStaffSession = {
  accessToken: string
  expiresAt: number
  email: string
}

export type DtiStaffOrder = {
  id: string
  customer_name: string
  meters: number
  useful_width_mm: number
  shipping_method: 'standard' | 'pickup'
  shipping_total_cents: number
  total_cents: number
  currency_code: string
  status: string
  payment_status: string
  adaptation_requested: boolean
  preparation_working_days: number | null
  estimated_dispatch_date: string | null
  production_started_at: string | null
  quality_control_completed_at: string | null
  dispatch_ready_at: string | null
  dispatched_at: string | null
  picked_up_at: string | null
  tracking_reference: string | null
  created_at: string
  latestArtwork: null | {
    id: string
    version_number: number
    original_file_name: string
    format: string
    file_size_bytes: number
    validation_status: string
    client_accepted_at: string | null
    latestReview: null | { decision: string; summary: string; created_at: string }
  }
  events: Array<{ event_type: string; actor_kind: string; details: Record<string, unknown>; created_at: string }>
}

type DtiApiConfig = { url?: string; anonKey?: string }
type AuthResponse = { access_token: string; expires_in: number; user: { email?: string } }

const SESSION_KEY = 'ridaos:dti-staff-session'
const env = import.meta.env as ImportMetaEnv & { VITE_DTI_SUPABASE_URL?: string; VITE_DTI_SUPABASE_ANON_KEY?: string }

function getConfig(): DtiApiConfig {
  return { url: env.VITE_DTI_SUPABASE_URL?.replace(/\/$/, ''), anonKey: env.VITE_DTI_SUPABASE_ANON_KEY }
}

function readSession(): DtiStaffSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as DtiStaffSession
    if (!session.accessToken || session.expiresAt <= Date.now()) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

export const getDtiStaffSession = readSession

export function signOutDtiStaff() {
  sessionStorage.removeItem(SESSION_KEY)
}

export async function signInDtiStaff(email: string, password: string): Promise<DtiStaffSession> {
  const config = getConfig()
  if (!config.url || !config.anonKey) throw new Error('El backend DTI de QA no está configurado en este entorno.')
  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: config.anonKey, 'content-type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  })
  const result = await response.json() as AuthResponse & { error_description?: string; msg?: string }
  if (!response.ok || !result.access_token) throw new Error('No se pudo iniciar sesión. Comprueba las credenciales o el acceso al proyecto QA.')
  const session: DtiStaffSession = {
    accessToken: result.access_token,
    expiresAt: Date.now() + result.expires_in * 1000,
    email: result.user?.email ?? email.trim().toLowerCase(),
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export async function callDtiStaff<T>(session: DtiStaffSession, body: Record<string, unknown>, idempotencyKey?: string): Promise<T> {
  const config = getConfig()
  if (!config.url || !config.anonKey) throw new Error('El backend DTI de QA no está configurado en este entorno.')
  const headers = new Headers({
    apikey: config.anonKey,
    authorization: `Bearer ${session.accessToken}`,
    'content-type': 'application/json',
  })
  if (idempotencyKey) headers.set('idempotency-key', idempotencyKey)
  const response = await fetch(`${config.url}/functions/v1/dti-staff-operations`, {
    method: 'POST', headers, body: JSON.stringify(body),
  })
  const result = await response.json() as { error?: string } & T
  if (!response.ok) {
    if (response.status === 401) signOutDtiStaff()
    throw new Error(result.error ?? 'No se pudo completar la operación DTI.')
  }
  return result
}

export async function getDtiArtworkDownload(session: DtiStaffSession, versionId: string) {
  return callDtiStaff<{ url: string; format: string; fileName: string; expiresInSeconds: number }>(session, {
    action: 'artwork_download', versionId,
  })
}

export function newDtiOperationKey() {
  return crypto.randomUUID().replaceAll('-', '')
}
