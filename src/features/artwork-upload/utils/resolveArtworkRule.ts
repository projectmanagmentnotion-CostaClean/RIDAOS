import type { CatalogCategoryKey, CatalogEntry } from '../../../types/product'
import type { ArtworkProductRuleKey } from '../types/artworkUpload'

export function resolveArtworkRuleFromCategory(category: CatalogCategoryKey): ArtworkProductRuleKey {
  switch (category) {
    case 'dtf':
      return 'dtf_meter'
    case 'papeleria':
      return 'paper'
    case 'materiales':
    case 'rotulacion':
      return 'printed_vinyl'
    case 'carteleria':
    case 'neones':
      return 'signage'
    case 'textil':
      return 'textile'
    case 'accesorios':
    default:
      return 'stickers'
  }
}

export function resolveArtworkRuleForEntry(entry: CatalogEntry): ArtworkProductRuleKey {
  if (entry.id.includes('tarjetas')) {
    return 'business_cards'
  }

  if (entry.id.includes('pegatina') || entry.visualKey === 'stickers') {
    return 'stickers'
  }

  if (entry.category === 'papeleria') {
    return entry.id.includes('tarjetas') ? 'business_cards' : 'paper'
  }

  return resolveArtworkRuleFromCategory(entry.category)
}
