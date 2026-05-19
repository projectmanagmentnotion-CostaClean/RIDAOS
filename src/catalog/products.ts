import { catalogEntries } from './registry/catalogRegistry'
import type { EditableCatalogProduct } from './productTypes'

export const editableCatalogProducts: EditableCatalogProduct[] = catalogEntries.map((entry) => ({
  id: entry.id,
  name: entry.name,
  slug: entry.slug,
  category: entry.category,
  description: entry.description,
  shortDescription: entry.shortDescription,
  basePrice: entry.basePrice ?? null,
  priceLabel:
    entry.basePrice != null
      ? `${entry.basePrice.toFixed(2)} EUR${entry.unitLabel ? `/${entry.unitLabel}` : ''}`
      : entry.range
        ? `${entry.range.min.toFixed(2)} - ${entry.range.max.toFixed(2)} EUR`
        : 'Consultar',
  image: entry.visualKey ?? null,
  tags: [
    entry.purchaseMode,
    entry.pricingMode,
    ...(entry.featured ? ['featured'] : []),
    ...(entry.catalogGroups ?? []),
  ],
  featured: Boolean(entry.featured),
  configurable: entry.configuratorFields.length > 0,
  status: 'active',
}))
