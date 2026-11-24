import { DTF_PRICING_CONFIG } from '../../config/pricing/dtfPricing'
import type { CatalogEntry } from '../../types/product'

export const dtfEntry: CatalogEntry = {
  id: 'dtf-metro',
  slug: 'dtf-por-metro',
  kind: 'product',
  category: 'dtf',
  name: 'DTI Innuro por metro',
  description: 'DTI Innuro para transfer textil a 15 €/m IVA incluido, con ancho útil de 55 cm y revisión previa del archivo.',
  shortDescription: 'DTI Innuro por metro; DTF por metro para búsquedas. Precio claro y archivo revisado antes de producir.',
  route: '#/producto/dti-por-metro',
  purchaseMode: 'direct',
  pricingMode: 'unit',
  upload: {
    required: true,
    acceptedFormats: ['PNG', 'PDF', 'AI', 'PSD', 'SVG', 'CDR'],
    notes: ['PNG y PDF con comprobación inicial; AI, PSD, SVG y CDR requieren revisión manual antes de producción.'],
  },
  configuratorFields: [
    { key: 'meters', type: 'meters', label: 'Metros', required: true, min: 1, step: 0.1, hint: 'Pedido mínimo de 1 m. El ancho útil del rollo es 55 cm.' },
    { key: 'file', type: 'file', label: 'Archivo', required: true, accept: '.png,.pdf,.ai,.psd,.svg,.cdr', hint: 'PNG y PDF con comprobación inicial; AI, PSD, SVG y CDR pasan a revisión manual.' },
    { key: 'notes', type: 'textarea', label: 'Notas', rows: 5, hint: 'Usa este campo para color, prioridad o referencias de montaje.' },
  ],
  legalNotes: ['dti_prices_vat_included', 'dti_artwork_review', 'dti_adaptation_quote', 'dti_shipping_and_lead_times'],
  cta: { type: 'open_product', href: '#/producto/dti-por-metro', label: 'Configurar DTI' },
  manualReviewRequired: true,
  featured: true,
  badge: 'Compra directa',
  unitLabel: 'metro',
  productionTime: '1–5 m: 48 horas laborables · más de 5–10 m: 3 días laborables · más de 10 m bajo consulta. Transporte adicional.',
  basePrice: DTF_PRICING_CONFIG.basePricePerMeter,
  navigation: { label: 'DTI por metro', primary: true, order: 10 },
  catalogGroups: ['direct', 'textil'],
  visualKey: 'dtf',
}
