import {
  getProductPageHref,
  getPublicCtaHref,
  getPublicHref,
  publicRoutes,
} from '../../lib/navigation'
import { normalizeHashRoute } from '../../lib/hashRouting'

export type NavigationAccent = 'green' | 'pink' | 'cyan' | 'neutral'

export type NavigationLinkItem = {
  label: string
  href: string
  description: string
  badge?: string
  accent: NavigationAccent
  priority?: 'high' | 'medium' | 'low'
  matchHrefs?: string[]
  matchPrefixes?: string[]
}

function route(href: string) {
  return normalizeHashRoute(href)
}

export const primaryLinks: NavigationLinkItem[] = [
  {
    label: 'Catalogo',
    href: getPublicCtaHref('catalogo'),
    description: 'Escaparate visual de productos y familias.',
    accent: 'neutral',
    priority: 'high',
    matchHrefs: [
      publicRoutes.catalogo,
      publicRoutes.catalogoDti,
      publicRoutes.rotulacion,
      publicRoutes.textil,
      publicRoutes.catalogoPegatinas,
      publicRoutes.catalogoTarjetas,
      publicRoutes.catalogoFlyers,
      publicRoutes.catalogoVinilo,
    ],
  },
  {
    label: 'DTI',
    href: getProductPageHref('dtf'),
    description: 'Produccion por metro para marcas, talleres y drops.',
    accent: 'green',
    priority: 'high',
    matchHrefs: [publicRoutes.dtf, publicRoutes.catalogoDti, '#/dtf', '#/producto/dtf'],
  },
  {
    label: 'Rotulacion',
    href: getPublicHref('rotulacion'),
    description: 'Furgonetas, presencia comercial y vinilo aplicado.',
    accent: 'pink',
    priority: 'high',
    matchHrefs: [publicRoutes.rotulacion, publicRoutes.productoRotulacion, '#/servicios/rotulacion'],
  },
  {
    label: 'Subir archivo',
    href: getPublicCtaHref('upload'),
    description: 'Carga, guia y revision tecnica.',
    accent: 'cyan',
    priority: 'high',
    matchHrefs: [publicRoutes.upload, publicRoutes.guia],
  },
]

export const productLinks: NavigationLinkItem[] = [
  {
    label: 'DTI por metro',
    href: getProductPageHref('dtf'),
    description: 'Produccion textil flexible con revision tecnica.',
    badge: 'Principal',
    accent: 'green',
    priority: 'high',
    matchHrefs: [publicRoutes.dtf, publicRoutes.catalogoDti],
  },
  {
    label: 'Pegatinas personalizadas',
    href: getProductPageHref('productoPegatinas'),
    description: 'Troquel, acabado y material con lectura clara.',
    accent: 'pink',
    priority: 'medium',
    matchHrefs: [publicRoutes.productoPegatinas, publicRoutes.catalogoPegatinas],
  },
  {
    label: 'Tarjetas de visita',
    href: getProductPageHref('productoTarjetas'),
    description: 'Acabados premium y presencia de marca.',
    accent: 'cyan',
    priority: 'medium',
    matchHrefs: [publicRoutes.productoTarjetas, publicRoutes.catalogoTarjetas],
  },
  {
    label: 'Flyers personalizados',
    href: getProductPageHref('productoFlyers'),
    description: 'Campanas, eventos y entrega directa.',
    accent: 'pink',
    priority: 'medium',
    matchHrefs: [publicRoutes.productoFlyers, publicRoutes.catalogoFlyers],
  },
  {
    label: 'Vinilo impreso',
    href: getProductPageHref('productoVinilo'),
    description: 'Escaparate, pared y gran formato.',
    accent: 'cyan',
    priority: 'medium',
    matchHrefs: [publicRoutes.productoVinilo, publicRoutes.catalogoVinilo],
  },
  {
    label: 'Textil personalizado',
    href: getProductPageHref('productoTextil'),
    description: 'Prenda, tecnica y zona de impresion.',
    accent: 'green',
    priority: 'medium',
    matchHrefs: [publicRoutes.productoTextil, publicRoutes.textil],
  },
]

export const serviceLinks: NavigationLinkItem[] = [
  {
    label: 'Rotulacion de furgonetas',
    href: getProductPageHref('productoRotulacion'),
    description: 'Presencia en calle con briefing guiado.',
    badge: 'Street',
    accent: 'green',
    priority: 'high',
    matchHrefs: [publicRoutes.productoRotulacion],
  },
  {
    label: 'Rotulacion comercial',
    href: getPublicHref('rotulacion'),
    description: 'Fachadas, flotas y cobertura visual.',
    accent: 'pink',
    priority: 'high',
    matchHrefs: [publicRoutes.rotulacion, '#/servicios/rotulacion'],
  },
  {
    label: 'Vinilo impreso',
    href: getProductPageHref('productoVinilo'),
    description: 'Paneles, paredes y piezas de gran impacto.',
    accent: 'cyan',
    priority: 'medium',
    matchHrefs: [publicRoutes.productoVinilo, publicRoutes.catalogoVinilo],
  },
  {
    label: 'Solicitar presupuesto',
    href: getProductPageHref('productoRotulacion'),
    description: 'Entrada rapida para proyectos guiados y flotas.',
    accent: 'neutral',
    priority: 'medium',
    matchHrefs: [publicRoutes.productoRotulacion],
  },
]

export const resourceLinks: NavigationLinkItem[] = [
  {
    label: 'Subir archivo',
    href: getPublicCtaHref('upload'),
    description: 'Carga tu diseno y activa la lectura tecnica.',
    accent: 'cyan',
    priority: 'high',
    matchHrefs: [publicRoutes.upload],
  },
  {
    label: 'Guia de archivos',
    href: getPublicCtaHref('guia'),
    description: 'Resolucion, sangrado y preparacion clara.',
    accent: 'cyan',
    priority: 'medium',
    matchHrefs: [publicRoutes.guia],
  },
  {
    label: 'Catalogo',
    href: getPublicCtaHref('catalogo'),
    description: 'Explora familias, categorias y rutas de compra.',
    accent: 'neutral',
    priority: 'medium',
    matchHrefs: [publicRoutes.catalogo],
  },
  {
    label: 'Revision tecnica',
    href: getPublicCtaHref('upload'),
    description: 'Comprobacion visual antes de producir.',
    accent: 'green',
    priority: 'medium',
    matchHrefs: [publicRoutes.upload, publicRoutes.guia],
  },
]

export const featuredLinks: NavigationLinkItem[] = [
  {
    label: 'Configurar DTI',
    href: getProductPageHref('dtf'),
    description: 'Flujo directo con precio estimado y upload.',
    accent: 'green',
    priority: 'high',
    matchHrefs: [publicRoutes.dtf],
  },
  {
    label: 'Rotular furgoneta',
    href: getProductPageHref('productoRotulacion'),
    description: 'Entrada guiada para presencia comercial real.',
    accent: 'pink',
    priority: 'medium',
    matchHrefs: [publicRoutes.productoRotulacion],
  },
]

export const mobilePrimaryCards = [
  {
    label: 'DTI por metro',
    href: getProductPageHref('dtf'),
    description: 'Configura y sube archivo',
    accent: 'green' as const,
  },
  {
    label: 'Rotulacion',
    href: getProductPageHref('productoRotulacion'),
    description: 'Furgonetas y presencia comercial',
    accent: 'pink' as const,
  },
  {
    label: 'Catalogo',
    href: getPublicCtaHref('catalogo'),
    description: 'Explorar familias',
    accent: 'neutral' as const,
  },
  {
    label: 'Subir archivo',
    href: getPublicCtaHref('upload'),
    description: 'Revision tecnica',
    accent: 'cyan' as const,
  },
]

export const navigationMeta = {
  desktopTriggerLabel: 'Explorar',
  mobileTitle: 'Menu Ridaos',
  primaryCta: {
    label: 'Configurar DTI',
    href: getProductPageHref('dtf'),
    accent: 'green' as const,
  },
  featuredBlock: {
    eyebrow: 'DTI por metro',
    title: 'Produccion textil flexible para marcas, talleres y drops.',
    chips: ['Marcas', 'Talleres', 'Drops', 'Revision tecnica'],
    ctaLabel: 'Configurar DTI',
    ctaHref: getProductPageHref('dtf'),
  },
} as const

export function isNavigationItemActive(currentHashRoute: string, item: NavigationLinkItem) {
  const current = route(currentHashRoute)
  const href = route(item.href)

  if (current === href) {
    return true
  }

  if (item.matchHrefs?.some((candidate) => route(candidate) === current)) {
    return true
  }

  if (item.matchPrefixes?.some((candidate) => current.startsWith(route(candidate)))) {
    return true
  }

  return false
}
