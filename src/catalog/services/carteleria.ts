import { commonArtworkFormats } from '../configurators/commonArtworkFormats'
import { defaultCommercialNoticeKeys } from '../notices/legalNotices'
import type { CatalogEntry } from '../../types/product'

export const carteleriaEntries: CatalogEntry[] = [
  {
    id: 'lona-impresa',
    slug: 'lona-impresa',
    kind: 'service',
    category: 'carteleria',
    name: 'Lona impresa',
    description: 'Depende de medidas, cantidades, ojales y confeccion.',
    shortDescription: 'Carteleria de gran formato sujeta a medidas y acabados.',
    route: '#/servicios/carteleria',
    purchaseMode: 'quote',
    pricingMode: 'quote',
    upload: { required: false, acceptedFormats: [...commonArtworkFormats] },
    configuratorFields: [
      { key: 'details', type: 'textarea', label: 'Detalles del proyecto', required: true, rows: 4 },
      { key: 'width', type: 'text', label: 'Ancho' },
      { key: 'height', type: 'text', label: 'Alto' },
      { key: 'file', type: 'file', label: 'Archivo', accept: '.pdf,.ai,.eps,.svg,.png,.jpg,.jpeg' },
    ],
    legalNotes: defaultCommercialNoticeKeys,
    cta: { type: 'request_quote', href: '#/presupuesto?service=carteleria', label: 'Solicitar presupuesto', serviceKey: 'carteleria' },
    manualReviewRequired: true,
    notes: ['La lona compleja pasa por presupuesto.'],
    catalogGroups: ['quote', 'gran-formato', 'services'],
    visualKey: 'banner',
  },
]
