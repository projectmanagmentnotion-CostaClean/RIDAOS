import { normalizeHashRoute } from './hashRouting'

export const publicRoutes = {
  home: '#/',
  catalogo: '#/catalogo',
  dtf: '#/producto/dtf',
  textil: '#/producto/textil',
  papeleria: '#/producto/papeleria',
  materiales: '#/producto/materiales',
  carteleria: '#/servicios/carteleria',
  accesorios: '#/producto/accesorios',
  rotulacion: '#/servicios/rotulacion',
  neones: '#/servicios/neones',
  carrito: '#/carrito',
  checkout: '#/checkout',
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

export type PublicCtaKey = 'catalogo' | 'dtf' | 'guia' | 'contacto' | 'presupuesto' | 'carrito'

export const publicCtaRoutes: Record<PublicCtaKey, (typeof publicRoutes)[PublicCtaKey]> = {
  catalogo: publicRoutes.catalogo,
  dtf: publicRoutes.dtf,
  guia: publicRoutes.guia,
  contacto: publicRoutes.contacto,
  presupuesto: publicRoutes.presupuesto,
  carrito: publicRoutes.carrito,
}

export function getPublicHref(route: PublicRouteKey) {
  return normalizeHashRoute(publicRoutes[route])
}

export function getPublicCtaHref(route: PublicCtaKey) {
  return normalizeHashRoute(publicCtaRoutes[route])
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
