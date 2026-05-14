import type { AppRole } from './roles'

export type AuthenticatedUser = {
  id: string
  email: string
  role: AppRole
  customerId?: string
}

export type AuthSession =
  | {
      status: 'anonymous'
      user: null
    }
  | {
      status: 'authenticated'
      user: AuthenticatedUser
    }

export type SignInInput = {
  email: string
  password: string
}
