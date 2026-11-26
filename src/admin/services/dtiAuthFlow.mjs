export const DTI_AUTH_CALLBACK_PATH = '/auth/callback'

export function buildDtiAuthCallbackUrl(origin) {
  const url = new URL(DTI_AUTH_CALLBACK_PATH, origin)
  if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) {
    throw new Error('La autenticación DTI requiere HTTPS fuera de localhost.')
  }
  return url.toString()
}

export function parseDtiAuthCallback(hash) {
  if (!hash || !hash.startsWith('#')) return null
  const params = new URLSearchParams(hash.slice(1))
  const errorCode = params.get('error_code')
  const error = params.get('error')
  if (error || errorCode) return { kind: 'error', errorCode }

  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  if (!accessToken && !refreshToken) return null
  if (!accessToken || !refreshToken) return { kind: 'invalid' }

  const type = params.get('type')
  const kind = type === 'invite' ? 'invite' : type === 'recovery' ? 'recovery' : 'session'
  const expiresAt = Number(params.get('expires_at'))
  const expiresIn = Number(params.get('expires_in'))

  return {
    kind,
    accessToken,
    refreshToken,
    expiresAt: Number.isFinite(expiresAt) && expiresAt > 0
      ? expiresAt * 1000
      : Date.now() + (Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : 3600) * 1000,
  }
}

export function getSafeCallbackError(errorCode) {
  if (errorCode === 'otp_expired' || errorCode === 'access_denied') return 'El enlace ha caducado o ya se utilizó. Solicita uno nuevo.'
  if (errorCode === 'email_not_confirmed') return 'La invitación aún no se ha confirmado. Solicita un enlace nuevo si ha caducado.'
  return 'No se pudo validar el enlace. Solicita uno nuevo al responsable de la cuenta.'
}
