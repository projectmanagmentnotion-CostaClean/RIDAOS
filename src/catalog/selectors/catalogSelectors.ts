import type { CatalogCategory, CatalogCategoryKey, CatalogEntry, CtaBehavior } from '../../types/product'
import { quoteFallbackServices } from '../services/quoteFallback'
import { catalogEntries, productCategories } from '../registry/catalogRegistry'
import { defaultCommercialNoticeKeys, resolveLegalNoticeItems } from '../notices/legalNotices'

type CatalogSection = {
  key: 'featured' | 'direct' | 'quote' | 'textil' | 'gran-formato'
  title: string
  description: string
  entries: CatalogEntry[]
}

type QuoteServiceOption = {
  key: string
  label: string
  route: string
  legalNotes: string[]
}

export function getFeaturedProducts() {
  return catalogEntries.filter((entry) => entry.featured)
}

export function getCatalogCategory(categoryKey: CatalogCategoryKey) {
  return productCategories.find((category) => category.key === categoryKey)
}

export function getCatalogSections(): CatalogSection[] {
  return [
    {
      key: 'featured',
      title: 'Flagship',
      description: 'Producto principal con configuracion, preview y flujo directo.',
      entries: getFeaturedProducts(),
    },
    {
      key: 'direct',
      title: 'Compra directa',
      description: 'Productos que ya pueden entrar en carrito local.',
      entries: catalogEntries.filter((entry) => entry.catalogGroups?.includes('direct') && !entry.featured),
    },
    {
      key: 'quote',
      title: 'Presupuesto',
      description: 'Servicios y piezas que requieren cierre comercial.',
      entries: catalogEntries.filter((entry) => entry.catalogGroups?.includes('quote')),
    },
    {
      key: 'textil',
      title: 'Textil',
      description: 'Linea textil con tramos por volumen y comprobacion posterior.',
      entries: catalogEntries.filter((entry) => entry.catalogGroups?.includes('textil') && !entry.featured),
    },
    {
      key: 'gran-formato',
      title: 'Gran formato',
      description: 'Materiales, rotulacion y carteleria para soportes grandes.',
      entries: catalogEntries.filter((entry) => entry.catalogGroups?.includes('gran-formato')),
    },
  ]
}

export function getProductsForCatalogView() {
  return [...catalogEntries].sort((left, right) => Number(Boolean(right.featured)) - Number(Boolean(left.featured)))
}

export function getProductsByCategory(category: CatalogCategoryKey) {
  return catalogEntries.filter((entry) => entry.category === category)
}

export function getProductById(productId: string) {
  return catalogEntries.find((entry) => entry.id === productId)
}

export function getProductBySlug(slug: string) {
  return catalogEntries.find((entry) => entry.slug === slug)
}

export function getQuoteServices(): QuoteServiceOption[] {
  const categoryMap = new Map<CatalogCategoryKey, CatalogCategory>()

  for (const entry of catalogEntries) {
    if (entry.purchaseMode === 'quote' || entry.purchaseMode === 'hybrid') {
      const category = getCatalogCategory(entry.category)
      if (category?.route) {
        categoryMap.set(category.key, category)
      }
    }
  }

  return [
    ...Array.from(categoryMap.values()).map((category) => ({
      key: category.key,
      label: category.label,
      route: category.route ?? '#/presupuesto',
      legalNotes: resolveLegalNoticeItems(defaultCommercialNoticeKeys),
    })),
    ...quoteFallbackServices.map((service) => ({
      ...service,
      legalNotes: resolveLegalNoticeItems(defaultCommercialNoticeKeys),
    })),
  ]
}

export function getNavigationEntriesFromCatalog() {
  return [
    ...productCategories
      .filter((category) => category.navigation?.primary && category.route)
      .sort((left, right) => (left.navigation?.order ?? 999) - (right.navigation?.order ?? 999))
      .map((category) => ({
        key: category.key,
        label: category.navigation?.label ?? category.label,
        href: category.route!,
      })),
    ...getFeaturedProducts()
      .filter((entry) => entry.navigation?.primary)
      .sort((left, right) => (left.navigation?.order ?? 999) - (right.navigation?.order ?? 999))
      .map((entry) => ({
        key: entry.id,
        label: entry.navigation?.label ?? entry.name,
        href: entry.route,
      })),
  ]
}

export function resolveCtaForEntry(entry: CatalogEntry): CtaBehavior {
  return entry.cta
}
