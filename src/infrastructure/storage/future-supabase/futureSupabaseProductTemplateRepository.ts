import type { ProductTemplateRepository } from '../../../domain/storage/repositories/ProductTemplateRepository'
import { assertSupabaseFeature } from '../../supabase/supabaseClient'

export const futureSupabaseProductTemplateRepository: ProductTemplateRepository = {
  async listTemplateAssets() {
    return assertSupabaseFeature('storage.templates.listTemplateAssets')
  },
  async getTemplateAssetById() {
    return assertSupabaseFeature('storage.templates.getTemplateAssetById')
  },
}
