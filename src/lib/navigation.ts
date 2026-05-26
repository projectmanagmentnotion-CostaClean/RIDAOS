import { normalizeHashRoute } from './hashRouting'

export const publicRoutes = {
  home: '#/',
  catalogo: '#/catalogo',
  dtf: '#/producto/dti-por-metro',
  textil: '#/catalogo/textil',
  papeleria: '#/catalogo/tarjetas',
  materiales: '#/catalogo/vinilo-impreso',
  carteleria: '#/servicios/carteleria',
  accesorios: '#/catalogo/pegatinas',
  rotulacion: '#/catalogo/rotulacion',
  neones: '#/servicios/neones',
  catalogoDti: '#/catalogo/dti',
  catalogoPegatinas: '#/catalogo/pegatinas',
  catalogoTarjetas: '#/catalogo/tarjetas',
  catalogoFlyers: '#/catalogo/flyers',
  catalogoVinilo: '#/catalogo/vinilo-impreso',
  productoPegatinas: '#/producto/pegatinas-personalizadas',
  productoTarjetas: '#/producto/tarjetas-visita',
  productoFlyers: '#/producto/flyers-personalizados',
  productoVinilo: '#/producto/vinilo-impreso',
  productoRotulacion: '#/producto/rotulacion-furgonetas',
  productoTextil: '#/producto/textil-personalizado',
  carrito: '#/carrito',
  checkout: '#/checkout',
  upload: '#/upload',
  guia: '#/guia',
  portafolio: '#/portafolio',
  contacto: '#/contacto',
  legal: '#/legal',
  presupuesto: '#/presupuesto',
  miCuenta: '#/mi-cuenta',
  misPedidos: '#/mi-cuenta/pedidos',
  detallePedido: '#/mi-cuenta/pedidos/demo',
  historialArchivos: '#/mi-cuenta/archivos',
} as const

export type PublicRouteKey = keyof typeof publicRoutes

export type PublicCtaKey =
  | 'catalogo'
  | 'dtf'
  | 'guia'
  | 'contacto'
  | 'presupuesto'
  | 'carrito'
  | 'upload'

export const publicCtaRoutes: Record<PublicCtaKey, (typeof publicRoutes)[PublicCtaKey]> = {
  catalogo: publicRoutes.catalogo,
  dtf: publicRoutes.dtf,
  guia: publicRoutes.guia,
  contacto: publicRoutes.contacto,
  presupuesto: publicRoutes.presupuesto,
  carrito: publicRoutes.carrito,
  upload: publicRoutes.upload,
}

export type CatalogFamilyRouteKey =
  | 'catalogoDti'
  | 'rotulacion'
  | 'textil'
  | 'catalogoPegatinas'
  | 'catalogoTarjetas'
  | 'catalogoFlyers'
  | 'catalogoVinilo'

export type ProductPageRouteKey =
  | 'dtf'
  | 'productoPegatinas'
  | 'productoTarjetas'
  | 'productoFlyers'
  | 'productoVinilo'
  | 'productoRotulacion'
  | 'productoTextil'

export function getPublicHref(route: PublicRouteKey) {
  return normalizeHashRoute(publicRoutes[route])
}

export function getPublicCtaHref(route: PublicCtaKey) {
  return normalizeHashRoute(publicCtaRoutes[route])
}

export function getCatalogFamilyHref(route: CatalogFamilyRouteKey) {
  return normalizeHashRoute(publicRoutes[route])
}

export function getProductPageHref(route: ProductPageRouteKey) {
  return normalizeHashRoute(publicRoutes[route])
}

export type QuoteServiceKey =
  | 'textil'
  | 'papeleria'
  | 'materiales'
  | 'rotulacion'
  | 'neones'
  | 'carteleria'
  | 'diseno-grafico'
  | 'otro'

export function getQuoteHref(service?: QuoteServiceKey | string) {
  if (!service) {
    return publicRoutes.presupuesto
  }

  return `${normalizeHashRoute(publicRoutes.presupuesto)}?service=${service}`
}

export function getContinueShoppingHref() {
  return getPublicCtaHref('catalogo')
}
