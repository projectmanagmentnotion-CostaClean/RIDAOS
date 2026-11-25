import { useEffect, useState } from 'react'
import {
  isPublicLaunchHost,
  resolvePublicationPolicy,
  type PublicationConfig,
  type PublicationPolicy,
} from './publicationPolicy.mjs'

const env = import.meta.env as ImportMetaEnv & {
  VITE_DTI_SUPABASE_URL?: string
  VITE_DTI_SUPABASE_ANON_KEY?: string
}

export function useResolvedPublicationPolicy(hostname: string): PublicationPolicy {
  const [resolved, setResolved] = useState<{ hostname: string; policy: PublicationPolicy } | null>(null)

  useEffect(() => {
    let cancelled = false

    if (!isPublicLaunchHost(hostname)) {
      return () => { cancelled = true }
    }

    const baseUrl = env.VITE_DTI_SUPABASE_URL?.replace(/\/$/, '')
    const anonKey = env.VITE_DTI_SUPABASE_ANON_KEY

    if (!baseUrl || !anonKey) {
      return () => { cancelled = true }
    }

    fetch(`${baseUrl}/rest/v1/ridaos_publication_flags?scope=eq.public&select=dti_only_mode,published_product_codes&limit=1`, {
      cache: 'no-store',
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Publication config unavailable')
        return await response.json() as PublicationConfig[]
      })
      .then((rows) => {
        if (!cancelled && rows.length === 1) {
          setResolved({ hostname, policy: resolvePublicationPolicy(hostname, rows[0]) })
        }
      })
      .catch(() => null)

    return () => { cancelled = true }
  }, [hostname])

  return resolved?.hostname === hostname
    ? resolved.policy
    : resolvePublicationPolicy(hostname)
}
