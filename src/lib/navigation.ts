export const publicRoutes = {
  home: '#/',
  catalogo: '#/catalogo',
  dtf: '#/producto/dtf',
  textil: '#/producto/textil',
  papeleria: '#/producto/papeleria',
  materiales: '#/producto/materiales',
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

  return `${publicRoutes.presupuesto}?service=${service}`
}

export function getContinueShoppingHref() {
  return publicRoutes.catalogo
}
