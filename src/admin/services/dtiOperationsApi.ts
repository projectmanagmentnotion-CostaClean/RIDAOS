import { buildDtiAuthCallbackUrl } from './dtiAuthFlow.mjs'

export type DtiStaffSession = {
  accessToken: string
  refreshToken: string
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
type AuthResponse = { access_token: string; refresh_token: string; expires_in: number; expires_at?: number; user?: { email?: string } }

const SESSION_KEY = 'ridaos:dti-staff-session'
const AUTH_FLOW_KEY = 'ridaos:dti-auth-flow'
const env = import.meta.env as ImportMetaEnv & { VITE_DTI_SUPABASE_URL?: string; VITE_DTI_SUPABASE_ANON_KEY?: string }

function getConfig(): DtiApiConfig {
  return { url: env.VITE_DTI_SUPABASE_URL?.replace(/\/$/, ''), anonKey: env.VITE_DTI_SUPABASE_ANON_KEY }
}

function readSession(): DtiStaffSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as DtiStaffSession
    if (!session.accessToken || !session.refreshToken || !session.expiresAt) {
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

export function clearDtiStaffSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function getDtiAuthFlow(): 'invite' | 'recovery' | null {
  const flow = sessionStorage.getItem(AUTH_FLOW_KEY)
  return flow === 'invite' || flow === 'recovery' ? flow : null
}

export function setDtiAuthFlow(flow: 'invite' | 'recovery') {
  sessionStorage.setItem(AUTH_FLOW_KEY, flow)
}

export function clearDtiAuthFlow() {
  sessionStorage.removeItem(AUTH_FLOW_KEY)
}

export function signOutDtiStaff() {
  const config = getConfig()
  const session = readSession()
  sessionStorage.removeItem(SESSION_KEY)
  clearDtiAuthFlow()
  if (!config.url || !config.anonKey || !session?.accessToken) return Promise.resolve()
  return fetch(`${config.url}/auth/v1/logout?scope=local`, {
    method: 'POST',
    headers: { apikey: config.anonKey, authorization: `Bearer ${session.accessToken}` },
  }).then(() => undefined).catch(() => undefined)
}

function storeSession(result: AuthResponse, fallbackEmail = ''): DtiStaffSession {
  if (!result.access_token || !result.refresh_token || !result.expires_in) {
    throw new Error('La respuesta de autenticación está incompleta. Inténtalo de nuevo.')
  }
  const session: DtiStaffSession = {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
    expiresAt: result.expires_at ? result.expires_at * 1000 : Date.now() + result.expires_in * 1000,
    email: result.user?.email ?? fallbackEmail,
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

let refreshInFlight: Promise<DtiStaffSession> | null = null

export async function ensureDtiStaffSession(session: DtiStaffSession): Promise<DtiStaffSession> {
  if (session.expiresAt > Date.now() + 60_000) return session
  const stored = readSession()
  const current = stored?.refreshToken === session.refreshToken ? stored : session
  if (current.expiresAt > Date.now() + 60_000) return current
  const config = getConfig()
  if (!config.url || !config.anonKey) throw new Error('El backend DTI de QA no está configurado en este entorno.')
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const response = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: { apikey: config.anonKey!, 'content-type': 'application/json' },
        body: JSON.stringify({ refresh_token: current.refreshToken }),
      })
      if (!response.ok) {
        sessionStorage.removeItem(SESSION_KEY)
        throw new Error('dti_session_expired')
      }
      return storeSession(await response.json() as AuthResponse, current.email)
    })().finally(() => { refreshInFlight = null })
  }
  return refreshInFlight
}

export async function acceptDtiAuthCallback(accessToken: string, refreshToken: string, expiresAt: number) {
  const config = getConfig()
  if (!config.url || !config.anonKey) throw new Error('El backend DTI de QA no está configurado en este entorno.')
  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: { apikey: config.anonKey, authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('El enlace ha caducado o ya se utilizó. Solicita uno nuevo.')
  const user = await response.json() as { email?: string }
  const session: DtiStaffSession = { accessToken, refreshToken, expiresAt, email: user.email ?? '' }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export async function requestDtiPasswordRecovery(email: string) {
  const config = getConfig()
  if (!config.url || !config.anonKey) throw new Error('El backend DTI de QA no está configurado en este entorno.')
  const callbackUrl = buildDtiAuthCallbackUrl(window.location.origin)
  const response = await fetch(`${config.url}/auth/v1/recover?redirect_to=${encodeURIComponent(callbackUrl)}`, {
    method: 'POST',
    headers: { apikey: config.anonKey, 'content-type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  })
  if (!response.ok) throw new Error('No se pudo solicitar el enlace. Inténtalo más tarde.')
}

export async function updateDtiStaffPassword(session: DtiStaffSession, password: string) {
  const config = getConfig()
  if (!config.url || !config.anonKey) throw new Error('El backend DTI de QA no está configurado en este entorno.')
  const activeSession = await ensureDtiStaffSession(session)
  const response = await fetch(`${config.url}/auth/v1/user`, {
    method: 'PUT',
    headers: { apikey: config.anonKey, authorization: `Bearer ${activeSession.accessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!response.ok) throw new Error('No se pudo actualizar la contraseña. Comprueba que el enlace siga vigente y vuelve a intentarlo.')
  return activeSession
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
  clearDtiAuthFlow()
  return storeSession(result, email.trim().toLowerCase())
}

export async function callDtiStaff<T>(session: DtiStaffSession, body: Record<string, unknown>, idempotencyKey?: string): Promise<T> {
  const config = getConfig()
  if (!config.url || !config.anonKey) throw new Error('El backend DTI de QA no está configurado en este entorno.')
  const activeSession = await ensureDtiStaffSession(session)
  const headers = new Headers({
    apikey: config.anonKey,
    authorization: `Bearer ${activeSession.accessToken}`,
    'content-type': 'application/json',
  })
  if (idempotencyKey) headers.set('idempotency-key', idempotencyKey)
  const response = await fetch(`${config.url}/functions/v1/dti-staff-operations`, {
    method: 'POST', headers, body: JSON.stringify(body),
  })
  const result = await response.json() as { error?: string } & T
  if (!response.ok) {
    if (response.status === 401) {
      clearDtiStaffSession()
      throw new Error('dti_session_expired')
    }
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
