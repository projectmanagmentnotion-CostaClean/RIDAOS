import type { AuthRepository } from '../../domain/auth/auth.repository'
import type { AuthSession } from '../../domain/auth/auth.types'

const guestSession: AuthSession = {
  status: 'anonymous',
  user: null,
}

export const mockAuthRepository: AuthRepository = {
  async getSession() {
    return guestSession
  },
  async getCurrentRole() {
    return 'guest'
  },
  async signInWithPassword() {
    throw new Error('Authentication is disabled while authMode is set to "none".')
  },
  async signOut() {
    return
  },
}
