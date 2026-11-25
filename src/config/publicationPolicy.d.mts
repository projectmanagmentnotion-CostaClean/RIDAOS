export type PublicationPolicy = {
  isPublicLaunch: boolean
  dtiOnlyMode: boolean
  publishedProductCodes: readonly string[]
}

export type PublicationConfig = {
  dti_only_mode: boolean
  published_product_codes: string[]
}

export const PUBLICATION_PRODUCT_CODES: readonly string[]
export const PUBLICATION_PRODUCT_BY_ROUTE: Readonly<Record<string, string>>
export const PUBLICATION_ROUTE_BY_KEY: Readonly<Record<string, string>>
export function isPublicLaunchHost(hostname: string): boolean
export function resolvePublicationPolicy(hostname: string, config?: PublicationConfig | null): PublicationPolicy
export function isPublicationProductEnabled(productCode: string, policy: PublicationPolicy): boolean
export function isFullCatalogPublished(policy: PublicationPolicy): boolean
export function shouldUseDtiLanding(policy: PublicationPolicy): boolean
export function isPublicationRouteAllowed(route: string, policy: PublicationPolicy): boolean
export function resolvePublicationRoute(routeKey: string, policy: PublicationPolicy): string
export function isPublicationNavigationItemAllowed(item: { href: string; matchHrefs?: string[] }, policy: PublicationPolicy): boolean
