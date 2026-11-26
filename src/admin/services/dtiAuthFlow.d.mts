export const DTI_AUTH_CALLBACK_PATH: string
export function buildDtiAuthCallbackUrl(origin: string): string
export function parseDtiAuthCallback(hash: string): null | { kind: 'error'; errorCode: string | null } | { kind: 'invalid' } | { kind: 'invite' | 'recovery' | 'session'; accessToken: string; refreshToken: string; expiresAt: number }
export function getSafeCallbackError(errorCode: string | null): string
