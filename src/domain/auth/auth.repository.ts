import type { AuthSession, SignInInput } from './auth.types'
import type { AppRole } from './roles'

export interface AuthRepository {
  getSession(): Promise<AuthSession>
  getCurrentRole(): Promise<AppRole>
  signInWithPassword(input: SignInInput): Promise<AuthSession>
  signOut(): Promise<void>
}
