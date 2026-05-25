import { useMemo } from 'react'
import type { CatalogCategoryKey, CatalogEntry } from '../../../types/product'
import { discoverabilityHubs } from '../hubs/discoverabilityHubs'
import { internalLinkGraph } from '../internal-links/internalLinkGraph'
import { localServiceHubs } from '../local/localServiceHubs'
import { frequentlyCombinedBundles, upsellRules } from '../recommendations/upsellRules'
import { resolveHubIdFromCategory, resolveHubIdFromEntry } from '../utils/discoverabilityResolvers'

export function useDiscoverability(options: {
  category?: CatalogCategoryKey
  entry?: CatalogEntry | null
}) {
  return useMemo(() => {
    const hubId = options.entry
      ? resolveHubIdFromEntry(options.entry)
      : options.category
        ? resolveHubIdFromCategory(options.category)
        : 'empresas'

    const hub = discoverabilityHubs.find((item) => item.id === hubId) ?? discoverabilityHubs[0]
    const upsell = upsellRules.find((rule) => rule.trigger === (options.entry?.category ?? options.category ?? ''))
    const frequentlyCombined = frequentlyCombinedBundles.filter((bundle) => {
      if (hub.id === 'rotulacion' || hub.id === 'rotulacion-furgonetas') {
        return bundle.id === 'bundle-empresa-local'
      }

      if (hub.id === 'dti' || hub.id === 'textil-personalizado') {
        return bundle.id === 'bundle-dtf-launch'
      }

      return bundle.id === 'bundle-empresa-local'
    })

    const local = localServiceHubs.filter((item) =>
      hub.id === 'barcelona'
        ? item.locality === 'Barcelona'
        : hub.id === 'blanes'
          ? item.locality === 'Blanes'
          : hub.id === 'girona-costa-brava'
            ? item.locality === 'Girona / Costa Brava'
            : false,
    )

    const graphKey =
      hub.id === 'dti'
        ? 'dtf'
        : hub.id === 'rotulacion' || hub.id === 'rotulacion-furgonetas'
          ? 'rotulacion'
          : 'catalogo'

    return {
      hub,
      upsell,
      frequentlyCombined,
      local,
      internalLinks: internalLinkGraph[graphKey] ?? [],
    }
  }, [options.category, options.entry])
}
