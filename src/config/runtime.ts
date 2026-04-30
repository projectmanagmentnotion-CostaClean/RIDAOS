export type BackendMode = 'mock' | 'supabase'

export const runtimeConfig = {
  backendMode: 'mock' as BackendMode,
}

// When the real backend is introduced, repositories and services will switch on
// `runtimeConfig.backendMode` and route calls to the Supabase implementation.
