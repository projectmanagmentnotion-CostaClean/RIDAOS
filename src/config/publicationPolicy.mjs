export const PUBLICATION_PRODUCT_CODES = Object.freeze([
  'dti-innuro',
  'textil',
  'papeleria',
  'flyers',
  'vinilo',
  'accesorios',
  'rotulacion',
  'carteleria',
  'neones',
])

export const PUBLICATION_PRODUCT_BY_ROUTE = Object.freeze({
  '#/dtf': 'dti-innuro',
  '#/producto/dti-por-metro': 'dti-innuro',
  '#/catalogo/dti': 'dti-innuro',
  '#/textil': 'textil',
  '#/catalogo/textil': 'textil',
  '#/producto/textil-personalizado': 'textil',
  '#/catalogo/tarjetas': 'papeleria',
  '#/producto/tarjetas-visita': 'papeleria',
  '#/catalogo/flyers': 'flyers',
  '#/producto/flyers-personalizados': 'flyers',
  '#/catalogo/vinilo-impreso': 'vinilo',
  '#/producto/vinilo-impreso': 'vinilo',
  '#/catalogo/pegatinas': 'accesorios',
  '#/accesorios': 'accesorios',
  '#/producto/accesorios': 'accesorios',
  '#/producto/pegatinas-personalizadas': 'accesorios',
  '#/catalogo/rotulacion': 'rotulacion',
  '#/producto/rotulacion-furgonetas': 'rotulacion',
  '#/servicios/rotulacion': 'rotulacion',
  '#/servicios/carteleria': 'carteleria',
  '#/servicios/neones': 'neones',
})

export const PUBLICATION_ROUTE_BY_KEY = Object.freeze({
  home: '#/',
  catalogo: '#/catalogo',
  dtf: '#/producto/dti-por-metro',
  catalogoDti: '#/catalogo/dti',
  catalogoFlyers: '#/catalogo/flyers',
  productTextil: '#/producto/textil-personalizado',
  productPegatinas: '#/producto/pegatinas-personalizadas',
  productTarjetas: '#/producto/tarjetas-visita',
  productFlyers: '#/producto/flyers-personalizados',
  productVinilo: '#/producto/vinilo-impreso',
  productRotulacion: '#/producto/rotulacion-furgonetas',
  productAccesoriosLegacy: '#/producto/accesorios',
  legacyConfigurator: '#/product-configurator',
  textil: '#/catalogo/textil',
  papeleria: '#/catalogo/tarjetas',
  carteleria: '#/servicios/carteleria',
  materiales: '#/catalogo/vinilo-impreso',
  accesorios: '#/catalogo/pegatinas',
  rotulacion: '#/catalogo/rotulacion',
  neones: '#/servicios/neones',
  carrito: '#/carrito',
  checkout: '#/checkout',
  upload: '#/upload',
  guia: '#/guia',
  contacto: '#/contacto',
  legal: '#/legal',
  presupuesto: '#/presupuesto',
})

const publicLaunchHosts = new Set([
  'dti.ridaosprint.com',
])

const alwaysAvailableRoutes = new Set([
  '#/',
  '#/carrito',
  '#/checkout',
  '#/upload',
  '#/guia',
  '#/contacto',
  '#/legal',
  '#/presupuesto',
])

const privatePolicy = Object.freeze({
  isPublicLaunch: false,
  dtiOnlyMode: false,
  publishedProductCodes: PUBLICATION_PRODUCT_CODES,
})

const failClosedPublicPolicy = Object.freeze({
  isPublicLaunch: true,
  dtiOnlyMode: true,
  publishedProductCodes: Object.freeze(['dti-innuro']),
})

export function isPublicLaunchHost(hostname) {
  return publicLaunchHosts.has(String(hostname ?? '').trim().toLowerCase().replace(/\.$/, ''))
}

export function resolvePublicationPolicy(hostname, config) {
  if (!isPublicLaunchHost(hostname)) {
    return privatePolicy
  }

  if (!config || typeof config.dti_only_mode !== 'boolean' || !Array.isArray(config.published_product_codes)) {
    return failClosedPublicPolicy
  }

  const publishedProductCodes = [...new Set([
    'dti-innuro',
    ...config.published_product_codes.filter((code) => PUBLICATION_PRODUCT_CODES.includes(code)),
  ])]

  return Object.freeze({
    isPublicLaunch: true,
    dtiOnlyMode: config.dti_only_mode,
    publishedProductCodes: Object.freeze(config.dti_only_mode
      ? ['dti-innuro']
      : publishedProductCodes),
  })
}

export function isPublicationProductEnabled(productCode, policy) {
  if (!policy?.isPublicLaunch) {
    return true
  }

  if (policy.dtiOnlyMode) {
    return productCode === 'dti-innuro'
  }

  return policy.publishedProductCodes.includes(productCode)
}

export function isFullCatalogPublished(policy) {
  return !policy?.isPublicLaunch || PUBLICATION_PRODUCT_CODES.every(
    (productCode) => isPublicationProductEnabled(productCode, policy),
  )
}

export function shouldUseDtiLanding(policy) {
  return Boolean(policy?.isPublicLaunch && (policy.dtiOnlyMode || !isFullCatalogPublished(policy)))
}

export function isPublicationRouteAllowed(route, policy) {
  if (!policy?.isPublicLaunch) {
    return true
  }

  const normalized = normalizePublicationRoute(route)
  const productCode = PUBLICATION_PRODUCT_BY_ROUTE[normalized]

  if (productCode) {
    return isPublicationProductEnabled(productCode, policy)
  }

  if (normalized === '#/catalogo') {
    return isFullCatalogPublished(policy)
  }

  return alwaysAvailableRoutes.has(normalized)
}

export function resolvePublicationRoute(routeKey, policy) {
  if (!policy?.isPublicLaunch) {
    return routeKey
  }

  if (routeKey === 'home' && shouldUseDtiLanding(policy)) {
    return 'dtf'
  }

  const route = PUBLICATION_ROUTE_BY_KEY[routeKey]

  if (route && isPublicationRouteAllowed(route, policy)) {
    return routeKey
  }

  return 'dtf'
}

export function isPublicationNavigationItemAllowed(item, policy) {
  return isPublicationRouteAllowed(item.href, policy)
}

function normalizePublicationRoute(route) {
  const rawRoute = String(route ?? '').trim()
  const hashRoute = rawRoute.includes('#') ? rawRoute.slice(rawRoute.indexOf('#')) : rawRoute
  const withoutQuery = hashRoute.split('?')[0]

  if (!withoutQuery || withoutQuery === '#') {
    return '#/'
  }

  if (withoutQuery.startsWith('#/')) {
    return withoutQuery
  }

  if (withoutQuery.startsWith('/')) {
    return `#${withoutQuery}`
  }

  return `#/${withoutQuery.replace(/^#?\/?/, '')}`
}
