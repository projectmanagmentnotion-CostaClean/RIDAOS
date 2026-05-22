import type { ArtworkProductRuleKey, ProductTemplateAsset } from '../../../domain/storage'

export type TemplateDownloadFormat = NonNullable<ProductTemplateAsset['formatsAvailable']>[number]

export type ProductTemplateCollection = {
  ruleKey: ArtworkProductRuleKey
  templates: ProductTemplateAsset[]
}
