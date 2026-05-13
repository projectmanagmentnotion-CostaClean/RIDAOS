import { commonArtworkFormats } from '../configurators/commonArtworkFormats'
import { defaultCommercialNoticeKeys } from '../notices/legalNotices'
import type { CatalogEntry, ConfiguratorField } from '../../types/product'

const baseServiceField: ConfiguratorField = { key: 'variant', type: 'variant', label: 'Servicio', required: true, options: [] }

export const neonesEntries: CatalogEntry[] = [
  {
    id: 'neon-centro-estetica',
    slug: 'cartel-decorativo-neon',
    kind: 'service',
    category: 'neones',
    name: 'Cartel decorativo neon',
    description: 'Pieza decorativa personalizada. Variacion de precio segun complejidad del diseno.',
    shortDescription: 'Neon decorativo con rango orientativo y validacion manual.',
    route: '#/servicios/neones',
    purchaseMode: 'quote',
    pricingMode: 'range',
    upload: { required: false, acceptedFormats: [...commonArtworkFormats] },
    configuratorFields: [
      baseServiceField,
      { key: 'width', type: 'text', label: 'Ancho' },
      { key: 'height', type: 'text', label: 'Alto' },
      { key: 'file', type: 'file', label: 'Archivo', accept: '.pdf,.ai,.eps,.svg,.png,.jpg,.jpeg' },
    ],
    legalNotes: defaultCommercialNoticeKeys,
    cta: { type: 'request_quote', href: '#/presupuesto?service=neones', label: 'Solicitar presupuesto', serviceKey: 'neones' },
    manualReviewRequired: true,
    range: { min: 300, max: 600 },
    badge: 'A consultar',
    notes: ['Mas de 3 colores: consultar presupuesto.', 'No incluye instalacion.'],
    catalogGroups: ['quote', 'services'],
    visualKey: 'banner',
  },
  {
    id: 'neon-forma-personalizada',
    slug: 'neon-forma-personalizada',
    kind: 'service',
    category: 'neones',
    name: 'Neon de forma personalizada',
    description: 'Formato circular, cuadrado o forma personalizada con medida maxima sujeta a revision.',
    shortDescription: 'Neon especial sujeto a forma, colores y validacion comercial.',
    route: '#/servicios/neones',
    purchaseMode: 'quote',
    pricingMode: 'quote',
    upload: { required: false, acceptedFormats: [...commonArtworkFormats] },
    configuratorFields: [
      baseServiceField,
      { key: 'details', type: 'textarea', label: 'Detalles del proyecto', required: true, rows: 4 },
      { key: 'file', type: 'file', label: 'Archivo', accept: '.pdf,.ai,.eps,.svg,.png,.jpg,.jpeg' },
    ],
    legalNotes: defaultCommercialNoticeKeys,
    cta: { type: 'request_quote', href: '#/presupuesto?service=neones', label: 'Solicitar presupuesto', serviceKey: 'neones' },
    manualReviewRequired: true,
    badge: 'A consultar',
    catalogGroups: ['quote', 'services'],
    visualKey: 'banner',
  },
]
