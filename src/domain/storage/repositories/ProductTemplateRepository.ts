import type { ArtworkProductRuleKey, ProductTemplateAsset } from '../storage.types'

export type ProductTemplateFilters = {
  productRuleKey?: ArtworkProductRuleKey
  kind?: ProductTemplateAsset['kind']
}

export interface ProductTemplateRepository {
  listTemplateAssets(filters?: ProductTemplateFilters): Promise<ProductTemplateAsset[]>
  getTemplateAssetById(assetId: string): Promise<ProductTemplateAsset | undefined>
}
