import type { LegalNoticeKey } from '../../types/product'

export const legalNoticeCopy: Record<LegalNoticeKey, string> = {
  prices_without_vat: 'Precios sin IVA.',
  advance_payment_required: 'Anticipo requerido.',
  balance_on_delivery: 'Saldo contra entrega.',
  design_changes_requote: 'Cambios de diseno sujetos a nueva cotizacion.',
  production_subject_to_review: 'Plazos de entrega sujetos a comprobacion tecnica.',
  dti_prices_vat_included: 'DTI Innuro: 15 €/m, IVA incluido; pedido mínimo de 1 m y ancho útil de 55 cm.',
  dti_artwork_review: 'PNG y PDF reciben una comprobación inicial. AI, PSD, SVG y CDR requieren revisión manual antes de producir.',
  dti_adaptation_quote: 'Adaptación profesional: 35 €/hora + IVA. El presupuesto se aprueba antes de cualquier pago.',
  dti_shipping_and_lead_times: 'Envío peninsular 5 € IVA incluido o recogida en Carrer d’Aragó 423, Barcelona. Preparación: hasta 5 m, 48 horas laborables; más de 5 y hasta 10 m, 3 días laborables; más de 10 m, bajo consulta. El transporte añade su propio plazo.',
}

export const defaultCommercialNoticeKeys: LegalNoticeKey[] = [
  'prices_without_vat',
  'advance_payment_required',
  'balance_on_delivery',
  'design_changes_requote',
  'production_subject_to_review',
]

export function resolveLegalNoticeItems(keys?: readonly LegalNoticeKey[]) {
  const source = keys && keys.length > 0 ? keys : defaultCommercialNoticeKeys
  return source.map((key) => legalNoticeCopy[key])
}

export const commercialConditions = resolveLegalNoticeItems()
