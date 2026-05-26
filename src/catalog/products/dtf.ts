import { commonArtworkFormats } from '../configurators/commonArtworkFormats'
import { defaultCommercialNoticeKeys } from '../notices/legalNotices'
import { DTF_PRICING_CONFIG } from '../../config/pricing/dtfPricing'
import type { CatalogEntry } from '../../types/product'

export const dtfEntry: CatalogEntry = {
  id: 'dtf-metro',
  slug: 'dtf-por-metro',
  kind: 'product',
  category: 'dtf',
  name: 'DTI por metro',
  description: 'Producto principal con configurador propio, revision tecnica y compra directa.',
  shortDescription: 'DTI por metro con archivo, revision y precio claro antes del carrito.',
  route: '#/producto/dti-por-metro',
  purchaseMode: 'direct',
  pricingMode: 'unit',
  upload: {
    required: true,
    acceptedFormats: [...commonArtworkFormats],
    notes: ['La comprobacion tecnica final se realiza antes de fabricar.'],
  },
  configuratorFields: [
    { key: 'meters', type: 'meters', label: 'Metros', required: true, min: 0.1, step: 0.1, hint: 'Introduce el metraje total del pedido.' },
    {
      key: 'quality',
      type: 'select',
      label: 'Calidad',
      required: true,
      hint: 'Elige el acabado base del DTF.',
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
      hint: 'Selecciona la urgencia real del pedido.',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'express', label: 'Express' },
      ],
    },
    { key: 'file', type: 'file', label: 'Archivo', required: true, accept: '.pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.tiff,.zip', hint: 'Acepta PDF, AI, EPS, SVG, PNG, JPG, TIFF y ZIP.' },
    { key: 'notes', type: 'textarea', label: 'Notas', rows: 5, hint: 'Usa este campo para color, prioridad o referencias de montaje.' },
  ],
  legalNotes: defaultCommercialNoticeKeys,
  cta: { type: 'open_product', href: '#/producto/dti-por-metro', label: 'Configurar DTI' },
  manualReviewRequired: true,
  featured: true,
  badge: 'Compra directa',
  unitLabel: 'metro',
  productionTime: 'Plazo sujeto a comprobacion tecnica del archivo y carga de trabajo.',
  basePrice: DTF_PRICING_CONFIG.basePricePerMeter,
  navigation: { label: 'DTI por metro', primary: true, order: 10 },
  catalogGroups: ['direct', 'textil'],
  visualKey: 'dtf',
}
