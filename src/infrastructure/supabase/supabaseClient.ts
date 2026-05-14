export type SupabaseClientLike = {
  url: string
  anonKey: string
  implementation: 'placeholder'
}

type SupabaseRuntimeConfig = {
  url?: string
  anonKey?: string
}

function readSupabaseRuntimeConfig(): SupabaseRuntimeConfig {
  const env = import.meta.env as ImportMetaEnv & {
    VITE_SUPABASE_URL?: string
    VITE_SUPABASE_ANON_KEY?: string
  }

  return {
    url: env.VITE_SUPABASE_URL,
    anonKey: env.VITE_SUPABASE_ANON_KEY,
  }
}

export function getSupabaseClient(): SupabaseClientLike {
  const config = readSupabaseRuntimeConfig()

  if (!config.url || !config.anonKey) {
    throw new Error('Supabase mode requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }

  return {
    url: config.url,
    anonKey: config.anonKey,
    implementation: 'placeholder',
  }
}

export function assertSupabaseFeature(methodName: string): never {
  getSupabaseClient()
  throw new Error(`Supabase repository method "${methodName}" is not implemented yet.`)
}
