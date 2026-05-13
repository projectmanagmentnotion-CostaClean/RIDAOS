import type { LegalNoticeKey } from '../../types/product'

export const legalNoticeCopy: Record<LegalNoticeKey, string> = {
  prices_without_vat: 'Precios sin IVA.',
  advance_payment_required: 'Anticipo requerido.',
  balance_on_delivery: 'Saldo contra entrega.',
  design_changes_requote: 'Cambios de diseno sujetos a nueva cotizacion.',
  production_subject_to_review: 'Plazos de entrega sujetos a comprobacion tecnica.',
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
