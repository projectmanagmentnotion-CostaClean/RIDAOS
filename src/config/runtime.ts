export type DataMode = 'demo' | 'supabase'

export const runtimeConfig = {
  dataMode: 'demo' as DataMode,
}

// When the Supabase layer is introduced, repositories and services will switch on
// `runtimeConfig.dataMode` and route calls to that implementation.
