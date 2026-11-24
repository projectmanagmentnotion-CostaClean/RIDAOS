const LEGACY_DTI_NAMES = new Set(['dti por metro', 'dtf por metro'])
const DTI_PRODUCT_NAME = 'DTI Innuro por metro'
const DTI_PRICE_PER_METER = 15

const roundCurrency = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100

export function isDtiInnuroCartItem(item) {
  const name = typeof item?.productName === 'string' ? item.productName.trim().toLocaleLowerCase('es') : ''
  return name === DTI_PRODUCT_NAME.toLocaleLowerCase('es') || LEGACY_DTI_NAMES.has(name)
}

export function migrateLegacyDtiCartItem(item) {
  if (!item || item.productType !== 'dtf' || !LEGACY_DTI_NAMES.has(String(item.productName ?? '').trim().toLocaleLowerCase('es'))) {
    return item
  }

  const meters = Number(item.configuration?.meters)
  if (!Number.isFinite(meters) || meters <= 0) return item

  const total = roundCurrency(meters * DTI_PRICE_PER_METER)
  const summary = [
    'Producto: DTI Innuro',
    `Metraje: ${meters} m`,
    'Ancho útil: 55 cm',
    `Archivo: ${item.artwork?.fileName ?? 'Por subir'}`,
  ]

  return {
    ...item,
    productName: DTI_PRODUCT_NAME,
    configuration: {
      ...item.configuration,
      summary,
      quality: undefined,
      urgency: undefined,
      turnaroundPreference: undefined,
      extras: [],
    },
    pricing: {
      ...item.pricing,
      unitPrice: DTI_PRICE_PER_METER,
      unitLabel: 'metro',
      subtotal: total,
      extras: 0,
      total,
      vatIncluded: true,
    },
  }
}

export function migrateLegacyDtiCartState(state) {
  if (!state || typeof state !== 'object') return state

  const items = Array.isArray(state.items) ? state.items.map(migrateLegacyDtiCartItem) : []
  const dtiOnly = items.length > 0 && items.every(isDtiInnuroCartItem)
  const shippingMethod = dtiOnly && state.shippingMethod === 'express' ? 'standard' : state.shippingMethod

  return { ...state, items, shippingMethod }
}
