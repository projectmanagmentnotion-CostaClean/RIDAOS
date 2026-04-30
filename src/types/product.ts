export type ProductCategoryKey =
  | 'textil'
  | 'papeleria'
  | 'materiales'
  | 'carteleria'
  | 'neones'
  | 'accesorios'
  | 'rotulacion'

export type PricingModel = 'unit' | 'volume' | 'm2' | 'range' | 'quote'

export type SalesMode = 'direct' | 'quote'

export type ProductPriceTier = {
  min: number
  max?: number
  unitPrice?: number
  totalPrice?: number
  note?: string
}

export type ProductRecord = {
  id: string
  name: string
  category: ProductCategoryKey
  salesMode: SalesMode
  pricingModel: PricingModel
  route?: string
  description: string
  unitLabel?: string
  highlight?: boolean
  badge?: string
  productionTime?: string
  notes?: string[]
  tiers?: ProductPriceTier[]
  basePrice?: number
  range?: {
    min: number
    max: number
  }
}

export type ProductCategory = {
  key: ProductCategoryKey
  label: string
  description: string
  route?: string
}

export type PriceResult = {
  currency: 'EUR'
  total: number
  subtotal: number
  extras: number
  unitPrice?: number
  unitLabel?: string
  quoteRequired?: boolean
  validationMessage?: string
  rangeLabel?: string
}
