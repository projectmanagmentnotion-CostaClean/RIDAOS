import type { CatalogCategoryKey, CatalogEntry, PurchaseMode, PricingMode } from '../../../../types/product'
import type { ConfigState } from '../../../../lib/configuratorState'
import type { CatalogPricingResult } from '../../../../catalog/adapters/catalogPricingAdapter'
import type { ProductHeroVisual, ProductOptionDefinition } from '../../../product-options'
import type { ArtworkPreviewSummary } from '../../../artwork-upload'

export type ProductExperienceSectionId =
  | 'hero'
  | 'gallery'
  | 'configurator'
  | 'specs'
  | 'story'
  | 'process'
  | 'recommendations'
  | 'faq'
  | 'final-cta'
  | 'sticky-summary'

export type ProductStoryBlock = {
  id: string
  eyebrow: string
  title: string
  description: string
  bullets: string[]
}

export type ProductGalleryFrameContent = {
  id: string
  label: string
  title: string
  description: string
  assetFileName?: string
  assetPath?: string
  assetStatus?: 'required' | 'mock' | 'pending'
}

export type ProductProcessStep = {
  id: string
  title: string
  description: string
}

export type ProductSupportSection = {
  label: string
  title: string
  items: string[]
}

export type ProductRecommendationContent = {
  id: string
  title: string
  description: string
  href: string
  priceLabel: string
  tag: string
}

export type ProductFinalCtaContent = {
  label: string
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}

export type ProductExperienceConfig = {
  key: CatalogCategoryKey
  className: string
  sections: ProductExperienceSectionId[]
  faqTitle: string
  fallbackEyebrow: string
  fallbackTitle: string
  fallbackDescription: string
  heroStickerWords?: string[]
  supportSections: ProductSupportSection[]
  storyBlocks: ProductStoryBlock[]
  galleryFrames: ProductGalleryFrameContent[]
  processSteps: ProductProcessStep[]
  finalCta: ProductFinalCtaContent
  recommendations: ProductRecommendationContent[]
  heroVisual?: ProductHeroVisual
}

export type ProductExperienceState = {
  products: CatalogEntry[]
  selectedProduct: CatalogEntry | null
  displayEntry: CatalogEntry | null
  optionDefinition: ProductOptionDefinition | null
  config: ConfigState
  estimate: CatalogPricingResult | null
  fieldErrors: Partial<Record<string, string>>
  message: string
  contentTitle: string
  contentEyebrow: string
  contentDescription: string
  handleConfigChange: (key: string, value: string) => void
  handleFileChange: (key: string, file: File | null) => void
  handlePrimaryAction: (previewSummary?: ArtworkPreviewSummary | null) => void
  isDirectFlow: boolean
  purchaseMode: PurchaseMode
  pricingMode: PricingMode
}
