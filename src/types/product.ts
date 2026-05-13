export type CatalogCategoryKey =
  | 'dtf'
  | 'textil'
  | 'papeleria'
  | 'materiales'
  | 'carteleria'
  | 'neones'
  | 'accesorios'
  | 'rotulacion'

export type CatalogEntryKind = 'product' | 'service'

export type PurchaseMode = 'direct' | 'quote' | 'hybrid'

export type PricingMode = 'unit' | 'volume' | 'm2' | 'range' | 'quote'

export type UploadRequirement = {
  required: boolean
  acceptedFormats?: string[]
  notes?: string[]
}

type BaseConfiguratorField = {
  key: string
  label: string
  required?: boolean
  placeholder?: string
  helpText?: string
}

export type ConfiguratorField =
  | (BaseConfiguratorField & {
      type: 'select' | 'variant' | 'size'
      options: { value: string; label: string }[]
    })
  | (BaseConfiguratorField & {
      type: 'quantity' | 'meters' | 'area'
      min?: number
      max?: number
      step?: number
    })
  | (BaseConfiguratorField & {
      type: 'file'
      accept?: string
    })
  | (BaseConfiguratorField & {
      type: 'text' | 'textarea'
      rows?: number
    })

export type LegalNoticeKey =
  | 'prices_without_vat'
  | 'advance_payment_required'
  | 'balance_on_delivery'
  | 'design_changes_requote'
  | 'production_subject_to_review'

export type CtaBehavior =
  | {
      type: 'open_product'
      href: string
      label: string
    }
  | {
      type: 'add_to_cart'
      href: string
      label: string
    }
  | {
      type: 'request_quote'
      href: string
      label: string
      serviceKey: string
    }

export type ProductPriceTier = {
  min: number
  max?: number
  unitPrice?: number
  totalPrice?: number
  note?: string
}

export type CatalogEntry = {
  id: string
  slug: string
  kind: CatalogEntryKind
  category: CatalogCategoryKey
  name: string
  description: string
  shortDescription: string
  route: string
  purchaseMode: PurchaseMode
  pricingMode: PricingMode
  upload: UploadRequirement
  configuratorFields: ConfiguratorField[]
  legalNotes: LegalNoticeKey[]
  cta: CtaBehavior
  manualReviewRequired: boolean
  featured?: boolean
  badge?: string
  unitLabel?: string
  productionTime?: string
  notes?: string[]
  tiers?: ProductPriceTier[]
  basePrice?: number
  range?: {
    min: number
    max: number
  }
  navigation?: {
    label: string
    primary?: boolean
    order?: number
  }
  catalogGroups?: Array<'direct' | 'quote' | 'textil' | 'gran-formato' | 'services'>
  visualKey?: 'dtf' | 'vehicle' | 'storefront' | 'stickers' | 'banner' | 'textile'
}

export type CatalogCategory = {
  key: CatalogCategoryKey
  label: string
  description: string
  route?: string
  kind: CatalogEntryKind | 'mixed'
  navigation?: {
    label: string
    primary?: boolean
    order?: number
  }
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

export type ProductCategoryKey = CatalogCategoryKey
export type SalesMode = Exclude<PurchaseMode, 'hybrid'>
export type ProductRecord = CatalogEntry
export type ProductCategory = CatalogCategory
