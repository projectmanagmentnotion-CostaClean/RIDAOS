import { commonArtworkFormats } from '../configurators/commonArtworkFormats'
import { defaultCommercialNoticeKeys } from '../notices/legalNotices'
import type { CatalogEntry } from '../../types/product'

export const dtfEntry: CatalogEntry = {
  id: 'dtf-metro',
  slug: 'dtf-por-metro',
  kind: 'product',
  category: 'dtf',
  name: 'DTF por metro',
  description: 'Producto principal con configurador propio, preview, archivo y cesta activa.',
  shortDescription: 'DTF con flujo directo desde el archivo hasta la confirmacion del pedido.',
  route: '#/producto/dtf',
  purchaseMode: 'direct',
  pricingMode: 'unit',
  upload: {
    required: true,
    acceptedFormats: [...commonArtworkFormats],
    notes: ['La comprobacion tecnica final se realiza despues de recibir el archivo.'],
  },
  configuratorFields: [
    { key: 'meters', type: 'meters', label: 'Metros', required: true, min: 0.1, step: 0.1 },
    {
      key: 'quality',
      type: 'select',
      label: 'Calidad',
      required: true,
      options: [
        { value: 'standard', label: 'Standard' },
        { value: 'premium', label: 'Premium' },
      ],
    },
    {
      key: 'urgency',
      type: 'select',
      label: 'Urgencia',
      required: true,
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'express', label: 'Express' },
      ],
    },
    { key: 'file', type: 'file', label: 'Archivo', required: true, accept: '.pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.tiff,.zip' },
    { key: 'notes', type: 'textarea', label: 'Notas', rows: 5 },
  ],
  legalNotes: defaultCommercialNoticeKeys,
  cta: { type: 'open_product', href: '#/producto/dtf', label: 'Configurar DTF' },
  manualReviewRequired: true,
  featured: true,
  badge: 'Compra directa',
  unitLabel: 'metro',
  productionTime: 'Segun carga de trabajo y comprobacion del archivo.',
  basePrice: 14.5,
  navigation: { label: 'DTF por metro', primary: true, order: 10 },
  catalogGroups: ['direct', 'textil'],
  visualKey: 'dtf',
}
