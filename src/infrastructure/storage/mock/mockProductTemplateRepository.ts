import type { ProductTemplateRepository } from '../../../domain/storage/repositories/ProductTemplateRepository'
import type { ProductTemplateAsset } from '../../../domain/storage/storage.types'

const productTemplateAssets: ProductTemplateAsset[] = [
  {
    id: 'template-business-cards-guide',
    productRuleKey: 'business_cards',
    label: 'Guia frontal de tarjeta con sangrado',
    fileName: 'business-card-front-guide-overlay.webp',
    kind: 'guide_overlay',
    recommendedFormat: 'webp',
    transparentBackground: true,
    orientation: 'landscape',
    recommendedSize: '2400x1400',
    priority: 'high',
  },
  {
    id: 'template-stickers-cutline',
    productRuleKey: 'stickers',
    label: 'Overlay de corte para pegatinas',
    fileName: 'stickers-cutline-overlay.webp',
    kind: 'guide_overlay',
    recommendedFormat: 'webp',
    transparentBackground: true,
    orientation: 'square',
    recommendedSize: '2200x2200',
    priority: 'high',
  },
  {
    id: 'template-dtf-roll-preview',
    productRuleKey: 'dtf_meter',
    label: 'Preview de rollo DTF por metro',
    fileName: 'dtf-roll-preview-overlay.webp',
    kind: 'storytelling_asset',
    recommendedFormat: 'webp',
    transparentBackground: true,
    orientation: 'landscape',
    recommendedSize: '2600x1600',
    priority: 'high',
  },
  {
    id: 'template-printed-vinyl-guide',
    productRuleKey: 'printed_vinyl',
    label: 'Plantilla de area visible para vinilo impreso',
    fileName: 'printed-vinyl-visible-area-overlay.pdf',
    kind: 'downloadable_template',
    recommendedFormat: 'pdf',
    transparentBackground: false,
    orientation: 'landscape',
    recommendedSize: 'A3 / 300 dpi',
    priority: 'medium',
  },
]

export const mockProductTemplateRepository: ProductTemplateRepository = {
  async listTemplateAssets(filters) {
    return productTemplateAssets.filter((asset) => {
      if (filters?.productRuleKey && asset.productRuleKey !== filters.productRuleKey) {
        return false
      }

      if (filters?.kind && asset.kind !== filters.kind) {
        return false
      }

      return true
    })
  },
  async getTemplateAssetById(assetId) {
    return productTemplateAssets.find((asset) => asset.id === assetId)
  },
}
