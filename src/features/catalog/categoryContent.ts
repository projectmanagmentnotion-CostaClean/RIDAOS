import type { CatalogFamilyId } from './catalogFamilies'
import { getCatalogFamilyHref, getProductPageHref, getPublicCtaHref } from '../../lib/navigation'
import { brandTokens } from '../brand/brandTokens'

export type CategoryLandingContent = {
  slug: CatalogFamilyId
  title: string
  eyebrow: string
  description: string
  heroImage: string
  accentColor: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  benefits: string[]
  useCases: string[]
  featuredProducts: string[]
  seoTitle: string
  seoDescription: string
}

export const categoryContent: Record<CatalogFamilyId, CategoryLandingContent> = {
  dti: {
    slug: 'dti',
    title: 'DTI por metro para marcas, talleres y produccion agil.',
    eyebrow: 'Categoria DTI',
    description: 'Configura tu metraje, prepara el archivo y deja lista la produccion textil desde una unica pagina de compra.',
    heroImage: '/assets/cinematic/dti/dti-roll-transparent.webp',
    accentColor: brandTokens.neonPink,
    primaryCtaLabel: 'Configurar DTI por metro',
    primaryCtaHref: getProductPageHref('dtf'),
    secondaryCtaLabel: 'Ver guia de archivos',
    secondaryCtaHref: getPublicCtaHref('guia'),
    benefits: [
      'Precio por metro claro desde el primer paso.',
      'Revision tecnica antes de fabricar.',
      'Preparado para marcas, talleres y drops de textil personalizado.',
    ],
    useCases: [
      'Series cortas y reposiciones rapidas.',
      'Uniformes, eventos y produccion para marca propia.',
      'Pedidos con archivo final o con ayuda de preparacion.',
    ],
    featuredProducts: ['dtf-metro'],
    seoTitle: 'DTI por metro | RidaosPrint',
    seoDescription: 'Categoria DTI por metro con beneficios, usos y acceso directo al configurador completo.',
  },
  rotulacion: {
    slug: 'rotulacion',
    title: 'Rotulacion de furgonetas, flotas y vehiculos de empresa.',
    eyebrow: 'Categoria rotulacion',
    description: 'Vehiculos comerciales, escaparates y presencia de marca con una lectura clara antes de pedir propuesta.',
    heroImage: '/assets/cinematic/wrap/wrap-van-side-transparent.webp',
    accentColor: brandTokens.neonGreen,
    primaryCtaLabel: 'Solicitar rotulacion de furgonetas',
    primaryCtaHref: getProductPageHref('productoRotulacion'),
    secondaryCtaLabel: 'Ver catalogo',
    secondaryCtaHref: getPublicCtaHref('catalogo'),
    benefits: [
      'Cobertura parcial, media o integral segun el vehiculo.',
      'Diseno, material e instalacion dentro del mismo flujo comercial.',
      'Enfoque local para Barcelona, Blanes, Girona y Costa Brava.',
    ],
    useCases: [
      'Furgonetas de reparto y servicios tecnicos.',
      'Flotas comerciales y vehiculos de empresa.',
      'Escaparates, vinilo comercial y continuidad visual de marca.',
    ],
    featuredProducts: ['rotulacion-basica', 'rotulacion-full-wrap'],
    seoTitle: 'Rotulacion de furgonetas y vehiculos | RidaosPrint',
    seoDescription: 'Categoria de rotulacion comercial para furgonetas, flotas y vehiculos de empresa.',
  },
  textil: {
    slug: 'textil',
    title: 'Textil personalizado con configuracion clara y acabados listos para decidir.',
    eyebrow: 'Categoria textil',
    description: 'Camisetas, sudaderas y prendas de equipo con tramos visibles y revision tecnica antes de producir.',
    heroImage: '/assets/cinematic/home/textile-hoodie-transparent.webp',
    accentColor: brandTokens.cyan,
    primaryCtaLabel: 'Configurar textil personalizado',
    primaryCtaHref: getProductPageHref('productoTextil'),
    secondaryCtaLabel: 'Ver DTI por metro',
    secondaryCtaHref: getProductPageHref('dtf'),
    benefits: [
      'Cantidades, acabados y prendas visibles sin salir de la pagina.',
      'Apto para merch, uniformes y series cortas.',
      'Paso directo a carrito cuando la tirada ya esta definida.',
    ],
    useCases: ['Camisetas y sudaderas para marca.', 'Uniformes de equipo.', 'Merchandising para eventos y retail.'],
    featuredProducts: ['camiseta-basica', 'sudadera'],
    seoTitle: 'Textil personalizado | RidaosPrint',
    seoDescription: 'Categoria textil con acceso directo al configurador completo de prendas personalizadas.',
  },
  pegatinas: {
    slug: 'pegatinas',
    title: 'Pegatinas personalizadas con corte, material y acabado en una lectura rapida.',
    eyebrow: 'Categoria pegatinas',
    description: 'Branding, packaging y exterior con troquel, kiss cut y materiales listos para configurar.',
    heroImage: '/assets/previews/stickers/sticker-sheet-preview.webp',
    accentColor: brandTokens.neonPink,
    primaryCtaLabel: 'Configurar pegatinas',
    primaryCtaHref: getProductPageHref('productoPegatinas'),
    secondaryCtaLabel: 'Ver catalogo',
    secondaryCtaHref: getPublicCtaHref('catalogo'),
    benefits: [
      'Formas cuadradas, redondas o personalizadas.',
      'Material blanco, transparente y exterior.',
      'Preparadas para branding, packaging y retail local.',
    ],
    useCases: ['Pegatinas para packaging.', 'Etiquetas promocionales.', 'Exterior y cristal.'],
    featuredProducts: ['pegatina-sin-laminar', 'pegatina-laminada'],
    seoTitle: 'Pegatinas personalizadas | RidaosPrint',
    seoDescription: 'Categoria de pegatinas personalizadas con acceso directo a materiales, troqueles y acabados.',
  },
  tarjetas: {
    slug: 'tarjetas',
    title: 'Tarjetas de visita premium para una primera impresion que se nota.',
    eyebrow: 'Categoria tarjetas',
    description: 'Papeles, gramajes y acabados premium con una pagina de compra clara y directa.',
    heroImage: '/assets/previews/cards/business-card-stack-premium.webp',
    accentColor: brandTokens.softWhite,
    primaryCtaLabel: 'Configurar tarjetas de visita',
    primaryCtaHref: getProductPageHref('productoTarjetas'),
    secondaryCtaLabel: 'Explorar flyers',
    secondaryCtaHref: getCatalogFamilyHref('catalogoFlyers'),
    benefits: [
      'Formatos clasicos, cuadrados y premium.',
      'Papel, gramaje y acabado en la misma vista.',
      'Perfectas para visita comercial, retail y marca personal.',
    ],
    useCases: ['Tarjetas de empresa.', 'Equipos comerciales.', 'Eventos y networking.'],
    featuredProducts: ['tarjetas-estandar'],
    seoTitle: 'Tarjetas de visita premium | RidaosPrint',
    seoDescription: 'Categoria de tarjetas de visita con acceso directo al configurador completo.',
  },
  flyers: {
    slug: 'flyers',
    title: 'Flyers y folletos listos para promocionar, repartir y recordar.',
    eyebrow: 'Categoria flyers',
    description: 'Formatos, papel y doble cara definidos para decidir rapido y producir con claridad.',
    heroImage: '/assets/previews/cards/flyer-stack-preview.webp',
    accentColor: brandTokens.cyan,
    primaryCtaLabel: 'Configurar flyers personalizados',
    primaryCtaHref: getProductPageHref('productoFlyers'),
    secondaryCtaLabel: 'Explorar tarjetas',
    secondaryCtaHref: getCatalogFamilyHref('catalogoTarjetas'),
    benefits: [
      'Formatos desde reparto rapido a pieza premium.',
      'Orientacion, gramaje y papel en el mismo flujo.',
      'Listos para campanas locales, aperturas y promociones.',
    ],
    useCases: ['Flyers para apertura.', 'Folletos para retail.', 'Promocion local y eventos.'],
    featuredProducts: ['flyer-a6', 'flyer-a5'],
    seoTitle: 'Flyers personalizados | RidaosPrint',
    seoDescription: 'Categoria de flyers personalizados con acceso directo al configurador completo.',
  },
  'vinilo-impreso': {
    slug: 'vinilo-impreso',
    title: 'Vinilo impreso para retail, pared, escaparate y presencia fisica de marca.',
    eyebrow: 'Categoria vinilo impreso',
    description: 'Soportes impresos con lectura por superficie y siguiente paso claro antes de producir.',
    heroImage: '/assets/previews/vinyl/vinyl-panel-preview.webp',
    accentColor: brandTokens.neonGreen,
    primaryCtaLabel: 'Configurar vinilo impreso',
    primaryCtaHref: getProductPageHref('productoVinilo'),
    secondaryCtaLabel: 'Ver rotulacion',
    secondaryCtaHref: getCatalogFamilyHref('rotulacion'),
    benefits: [
      'Vinilos para pared, cristal y aplicacion comercial.',
      'Base por m2 con revision tecnica cuando el proyecto la necesita.',
      'Conecta bien con escaparates, retail y branding local.',
    ],
    useCases: ['Escaparates.', 'Paredes y retail.', 'Senaletica y soporte comercial.'],
    featuredProducts: ['vinilo-monomerico', 'vinilo-polimerico'],
    seoTitle: 'Vinilo impreso | RidaosPrint',
    seoDescription: 'Categoria de vinilo impreso con acceso directo al configurador y uso comercial claro.',
  },
}

export function getCategoryContent(slug: CatalogFamilyId) {
  return categoryContent[slug]
}
