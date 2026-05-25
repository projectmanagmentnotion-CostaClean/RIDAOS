import { useMemo } from 'react'
import type { CatalogEntry } from '../../../types/product'
import { productOptionDefinitions } from '../data/productOptionDefinitions'

export function getProductOptionDefinition(entryId: string) {
  return productOptionDefinitions.find((definition) => definition.entryId === entryId) ?? null
}

export function useProductOptions(entry: CatalogEntry | null) {
  return useMemo(() => (entry ? getProductOptionDefinition(entry.id) : null), [entry])
}
