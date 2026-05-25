import type { ConfiguratorField } from '../../../types/product'
import type { ArtworkProductRuleKey } from '../../../domain/storage'

export type ProductOptionAssetStatus = 'required' | 'mock' | 'pending'

export type ProductOptionAsset = {
  id: string
  label: string
  fileName: string
  expectedPath: string
  format: string
  altFormat?: string
  status: ProductOptionAssetStatus
  purpose: string
}

export type ProductHeroVisual = {
  eyebrow: string
  title: string
  claim: string
  description: string
  primaryCtaLabel: string
  secondaryCtaLabel?: string
  benefitChips: string[]
  accent: string
  asset: ProductOptionAsset
}

export type ProductOptionPricingSnapshot = {
  subtotal: number
  total: number
  extras: number
  quoteRequired?: boolean
  canAddToCart: boolean
  pricingLabel: string
  unitPrice?: number
  unitLabel?: string
  rangeLabel?: string
  validationMessage?: string
  breakdown: string[]
  warnings: string[]
}

export type ProductOptionDefinition = {
  entryId: string
  familyKey: 'dti' | 'stickers' | 'business-cards' | 'flyers' | 'vehicle-wrap' | 'textile' | 'printed-vinyl'
  displayName: string
  templateRuleKey?: ArtworkProductRuleKey
  prepressRuleKey?: ArtworkProductRuleKey
  hero: ProductHeroVisual
  fields: ConfiguratorField[]
  assetRequirements: ProductOptionAsset[]
  recommendedTemplateLabel?: string
  seoTitle: string
  seoDescription: string
}
