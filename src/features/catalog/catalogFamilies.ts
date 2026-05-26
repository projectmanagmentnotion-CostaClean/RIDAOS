import { brandTokens } from '../brand/brandTokens'
import { getCatalogFamilyHref, getProductPageHref } from '../../lib/navigation'

export type CatalogFamilyId =
  | 'dti'
  | 'rotulacion'
  | 'textil'
  | 'pegatinas'
  | 'tarjetas'
  | 'flyers'
  | 'vinilo-impreso'

export type CatalogFamily = {
  id: CatalogFamilyId
  title: string
  shortDescription: string
  href: string
  image: string
  accent: string
  featured: boolean
  productsCount: string
  tags: string[]
  primaryProductHref: string
}

export const catalogFamilies: CatalogFamily[] = [
  {
    id: 'dti',
    title: 'DTI por metro',
    shortDescription: 'Produccion textil directa para marcas, talleres y pedidos agiles.',
    href: getCatalogFamilyHref('catalogoDti'),
    image: '/assets/cinematic/dti/dti-roll-transparent.webp',
    accent: brandTokens.neonPink,
    featured: true,
    productsCount: 'Producto principal',
    tags: ['DTI', 'Textil', 'Produccion directa'],
    primaryProductHref: getProductPageHref('dtf'),
  },
  {
    id: 'rotulacion',
    title: 'Rotulacion',
    shortDescription: 'Furgonetas, flotas, escaparates y vehiculos de empresa con presencia de marca real.',
    href: getCatalogFamilyHref('rotulacion'),
    image: '/assets/cinematic/wrap/wrap-van-side-transparent.webp',
    accent: brandTokens.neonGreen,
    featured: true,
    productsCount: 'Vehiculos y flotas',
    tags: ['Furgonetas', 'Flotas', 'Barcelona'],
    primaryProductHref: getProductPageHref('productoRotulacion'),
  },
  {
    id: 'textil',
    title: 'Textil personalizado',
    shortDescription: 'Camisetas, sudaderas y prendas de equipo con configuracion clara.',
    href: getCatalogFamilyHref('textil'),
    image: '/assets/cinematic/home/textile-hoodie-transparent.webp',
    accent: brandTokens.cyan,
    featured: false,
    productsCount: 'Prendas y series cortas',
    tags: ['Camisetas', 'Sudaderas', 'Uniformes'],
    primaryProductHref: getProductPageHref('productoTextil'),
  },
  {
    id: 'pegatinas',
    title: 'Pegatinas personalizadas',
    shortDescription: 'Troquel, material y acabado para branding, packaging y exterior.',
    href: getCatalogFamilyHref('catalogoPegatinas'),
    image: '/assets/previews/stickers/sticker-sheet-preview.webp',
    accent: brandTokens.neonPink,
    featured: false,
    productsCount: 'Corte, kiss cut y exterior',
    tags: ['Branding', 'Packaging', 'Exterior'],
    primaryProductHref: getProductPageHref('productoPegatinas'),
  },
  {
    id: 'tarjetas',
    title: 'Tarjetas de visita',
    shortDescription: 'Formato, papel y acabados premium para una primera impresion mas fuerte.',
    href: getCatalogFamilyHref('catalogoTarjetas'),
    image: '/assets/previews/cards/business-card-stack-premium.webp',
    accent: brandTokens.softWhite,
    featured: false,
    productsCount: 'Formatos y acabados',
    tags: ['Soft touch', 'Foil', 'Barniz 3D'],
    primaryProductHref: getProductPageHref('productoTarjetas'),
  },
  {
    id: 'flyers',
    title: 'Flyers personalizados',
    shortDescription: 'Promocion local con formatos claros y papel listo para repartir.',
    href: getCatalogFamilyHref('catalogoFlyers'),
    image: '/assets/previews/cards/flyer-stack-preview.webp',
    accent: brandTokens.cyan,
    featured: false,
    productsCount: 'A6 a A3',
    tags: ['Eventos', 'Reparto', 'Campanas'],
    primaryProductHref: getProductPageHref('productoFlyers'),
  },
  {
    id: 'vinilo-impreso',
    title: 'Vinilo impreso',
    shortDescription: 'Vinilos y soportes impresos con lectura clara por superficie y acabado.',
    href: getCatalogFamilyHref('catalogoVinilo'),
    image: '/assets/previews/vinyl/vinyl-panel-preview.webp',
    accent: brandTokens.neonGreen,
    featured: false,
    productsCount: 'Interior, exterior y retail',
    tags: ['Escaparate', 'Pared', 'Retail'],
    primaryProductHref: getProductPageHref('productoVinilo'),
  },
]

export function getCatalogFamilyById(id: CatalogFamilyId) {
  return catalogFamilies.find((family) => family.id === id) ?? null
}
