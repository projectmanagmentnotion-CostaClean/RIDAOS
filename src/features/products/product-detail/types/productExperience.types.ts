import type { CatalogCategoryKey, CatalogEntry, PurchaseMode, PricingMode } from '../../../../types/product'
import type { ConfigState } from '../../../../lib/configuratorState'
import type { CatalogPricingResult } from '../../../../catalog/adapters/catalogPricingAdapter'

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
}

export type ProductExperienceState = {
  products: CatalogEntry[]
  selectedProduct: CatalogEntry | null
  config: ConfigState
  estimate: CatalogPricingResult | null
  fieldErrors: Partial<Record<string, string>>
  message: string
  contentTitle: string
  contentEyebrow: string
  contentDescription: string
  handleConfigChange: (key: string, value: string) => void
  handleFileChange: (key: string, file: File | null) => void
  handlePrimaryAction: () => void
  isDirectFlow: boolean
  purchaseMode: PurchaseMode
  pricingMode: PricingMode
}
