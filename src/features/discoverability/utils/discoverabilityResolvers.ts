import type { CatalogCategoryKey, CatalogEntry } from '../../../types/product'
import type { DiscoverabilityHubId } from '../types/discoverability'

export function resolveHubIdFromCategory(category: CatalogCategoryKey): DiscoverabilityHubId {
  switch (category) {
    case 'rotulacion':
      return 'rotulacion'
    case 'dtf':
      return 'dti'
    case 'textil':
      return 'textil-personalizado'
    case 'papeleria':
      return 'tarjetas-papeleria'
    case 'carteleria':
      return 'vinilo-impreso'
    default:
      return 'empresas'
  }
}

export function resolveHubIdFromEntry(entry: CatalogEntry): DiscoverabilityHubId {
  if (entry.category === 'rotulacion' && /furgoneta|vehiculo|wrap|rotulacion/i.test(entry.name)) {
    return 'rotulacion-furgonetas'
  }

  return resolveHubIdFromCategory(entry.category)
}
