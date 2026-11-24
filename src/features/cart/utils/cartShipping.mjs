import { isDtiInnuroCartItem } from './migrateLegacyDtiCart.mjs'

const DTI_INNURO_SHIPPING_PRICE = 5

export const SHIPPING_METHODS = [
  {
    id: 'pickup',
    label: 'Recogida en taller',
    description: "Sin coste. Recogida en Ridaos Print BCN, Carrer d'Aragó 423, Barcelona.",
    price: 0,
    eta: 'Aviso al finalizar produccion',
    vatIncluded: true,
  },
  {
    id: 'standard',
    label: 'Envio peninsula',
    description: 'Envío peninsular estándar.',
    price: 6.9,
    eta: '48-72h despues de producir',
  },
  {
    id: 'express',
    label: 'Envio prioritario',
    description: 'Da prioridad a la salida una vez el archivo este aprobado.',
    price: 14.9,
    eta: '24-48h despues de producir',
  },
]

export function hasDtiInnuro(items) {
  return items.some(isDtiInnuroCartItem)
}

function hasOtherProducts(items) {
  return items.some((item) => !isDtiInnuroCartItem(item))
}

export function getCartShippingMethods(items) {
  if (!hasDtiInnuro(items)) return SHIPPING_METHODS

  if (hasOtherProducts(items)) {
    return SHIPPING_METHODS.map((method) => {
      if (method.id === 'pickup') return method
      const dtiIncluded = DTI_INNURO_SHIPPING_PRICE
      const existingShipping = method.price

      return {
        ...method,
        description: `${method.label}: DTI Innuro ${dtiIncluded} € IVA incluido + tarifa del resto del catálogo (${existingShipping} € + IVA).`,
        price: dtiIncluded + existingShipping,
        includedPrice: dtiIncluded,
        taxablePrice: existingShipping,
      }
    })
  }

  return SHIPPING_METHODS
    .filter((method) => method.id !== 'express')
    .map((method) => method.id === 'standard'
      ? {
          ...method,
          description: 'Envío peninsular: 5 € IVA incluido. El transporte se suma al tiempo de preparación.',
          price: DTI_INNURO_SHIPPING_PRICE,
          eta: 'Plazo de transporte adicional',
          vatIncluded: true,
        }
      : method)
}

export function resolveCartShippingMethod(id, items = []) {
  const methods = getCartShippingMethods(items)
  const normalizedId = id === 'express' && hasDtiInnuro(items) && !hasOtherProducts(items) ? 'standard' : id
  return methods.find((method) => method.id === normalizedId) ?? methods[0]
}
