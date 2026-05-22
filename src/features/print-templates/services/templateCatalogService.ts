import type { ArtworkProductRuleKey, ProductTemplateAsset } from '../../../domain/storage'
import { getProductTemplateRepository } from '../../../infrastructure/repositoryFactory'

export async function listProductTemplates(ruleKey: ArtworkProductRuleKey): Promise<ProductTemplateAsset[]> {
  const repository = getProductTemplateRepository()
  const templates = await repository.listTemplateAssets({ productRuleKey: ruleKey })
  return templates.sort((left, right) => {
    const priorityRank = { high: 0, medium: 1, low: 2 }
    return priorityRank[left.priority] - priorityRank[right.priority]
  })
}
