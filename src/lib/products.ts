import { commercialConditions, defaultCommercialNoticeKeys, legalNoticeCopy, resolveLegalNoticeItems } from '../catalog/notices/legalNotices'
import { catalogEntries, productCatalog, productCategories } from '../catalog/registry/catalogRegistry'
import { formatRangeLabel } from '../catalog/pricing/formatters'
import { getCatalogCategory, getProductById, getProductBySlug, getProductsByCategory, resolveCtaForEntry } from '../catalog/selectors/catalogSelectors'
import { getOrderItemSummary } from '../catalog/selectors/orderSummary'

export {
  catalogEntries,
  commercialConditions,
  defaultCommercialNoticeKeys,
  formatRangeLabel,
  getCatalogCategory,
  getOrderItemSummary,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  legalNoticeCopy,
  productCatalog,
  productCategories,
  resolveCtaForEntry,
  resolveLegalNoticeItems,
}

export const catalogCategories = productCategories

export function getCatalogGroups() {
  return {
    direct: catalogEntries.filter((product) => product.catalogGroups?.includes('direct') && !product.featured),
    quote: catalogEntries.filter((product) => product.catalogGroups?.includes('quote')),
    textil: catalogEntries.filter((product) => product.catalogGroups?.includes('textil') && !product.featured),
    granFormato: catalogEntries.filter((product) => product.catalogGroups?.includes('gran-formato')),
  }
}

export function getQuoteServiceOptions() {
  const labels = new Set<string>()

  for (const entry of catalogEntries) {
    if (entry.purchaseMode === 'quote' || entry.purchaseMode === 'hybrid') {
      const category = getCatalogCategory(entry.category)
      if (category) {
        labels.add(category.label)
      }
    }
  }

  labels.add('Diseno grafico')
  labels.add('Otro')

  return Array.from(labels)
}
