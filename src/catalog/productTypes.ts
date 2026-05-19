import type { CatalogCategoryKey } from '../types/product'

export type EditableCatalogStatus = 'active' | 'draft' | 'hidden'

export type EditableCatalogProduct = {
  id: string
  name: string
  slug: string
  category: CatalogCategoryKey
  description: string
  shortDescription: string
  basePrice: number | null
  priceLabel: string
  image: string | null
  tags: string[]
  featured: boolean
  configurable: boolean
  status: EditableCatalogStatus
}

export type EditableCatalogCategory = {
  key: CatalogCategoryKey
  label: string
  description: string
  route?: string
}
