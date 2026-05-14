import type { AuthRepository } from '../../domain/auth/auth.repository'
import { assertSupabaseFeature } from './supabaseClient'

export const supabaseAuthRepository: AuthRepository = {
  async getSession() {
    return assertSupabaseFeature('auth.getSession')
  },
  async getCurrentRole() {
    return assertSupabaseFeature('auth.getCurrentRole')
  },
  async signInWithPassword() {
    return assertSupabaseFeature('auth.signInWithPassword')
  },
  async signOut() {
    return assertSupabaseFeature('auth.signOut')
  },
}
