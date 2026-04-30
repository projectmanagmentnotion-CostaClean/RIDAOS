import { getProductById } from './products'
import type { PriceResult } from '../types/product'

const result = (input: Partial<PriceResult> & Pick<PriceResult, 'total' | 'subtotal' | 'extras'>): PriceResult => ({
  currency: 'EUR',
  ...input,
})

function findTier(productId: string, quantity: number) {
  const product = getProductById(productId)

  if (!product?.tiers) {
    return null
  }

  return (
    product.tiers.find((tier) => {
      if (quantity < tier.min) {
        return false
      }

      if (typeof tier.max === 'number' && quantity > tier.max) {
        return false
      }

      return true
    }) ?? null
  )
}

export function calculateTextilePrice(productId: string, quantity: number) {
  const product = getProductById(productId)

  if (!product) {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      validationMessage: 'Producto textil no encontrado.',
    })
  }

  if (product.salesMode === 'quote' || product.pricingModel === 'quote') {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      quoteRequired: true,
      validationMessage: 'Este producto textil requiere presupuesto.',
    })
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      validationMessage: 'Introduce una cantidad valida.',
    })
  }

  const tier = findTier(productId, quantity)

  if (!tier || typeof tier.unitPrice !== 'number') {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      quoteRequired: true,
      validationMessage: 'Consulta este tramo de cantidad para cerrar el precio.',
    })
  }

  const total = Number((tier.unitPrice * quantity).toFixed(2))

  return result({
    total,
    subtotal: total,
    extras: 0,
    unitPrice: tier.unitPrice,
    unitLabel: product.unitLabel,
  })
}

export function calculatePaperPrice(productId: string, quantity: number) {
  const product = getProductById(productId)

  if (!product) {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      validationMessage: 'Producto de papeleria no encontrado.',
    })
  }

  if (product.salesMode === 'quote') {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      quoteRequired: true,
      validationMessage: 'Este producto de papeleria requiere consulta.',
    })
  }

  const tier = findTier(productId, quantity)

  if (!tier || typeof tier.totalPrice !== 'number') {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      quoteRequired: true,
      validationMessage: 'La tirada seleccionada no esta definida en el catalogo base.',
    })
  }

  return result({
    total: tier.totalPrice,
    subtotal: tier.totalPrice,
    extras: 0,
    unitPrice: tier.totalPrice / quantity,
    unitLabel: product.unitLabel,
  })
}

export function calculateMaterialM2Price(productId: string, areaM2: number) {
  const product = getProductById(productId)

  if (!product) {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      validationMessage: 'Material no encontrado.',
    })
  }

  if (product.salesMode === 'quote' || product.pricingModel === 'quote') {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      quoteRequired: true,
      validationMessage: 'Este material requiere presupuesto.',
    })
  }

  if (!product.basePrice || !Number.isFinite(areaM2) || areaM2 <= 0) {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      validationMessage: 'Introduce una superficie valida en m2.',
    })
  }

  const total = Number((product.basePrice * areaM2).toFixed(2))

  return result({
    total,
    subtotal: total,
    extras: 0,
    unitPrice: product.basePrice,
    unitLabel: product.unitLabel,
  })
}

export function calculateStickerPrice(productId: string, quantity: number) {
  const product = getProductById(productId)

  if (!product) {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      validationMessage: 'Pegatina no encontrada.',
    })
  }

  const tier = findTier(productId, quantity)

  if (!tier) {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      quoteRequired: true,
      validationMessage: 'Cantidad no contemplada en el catalogo base.',
    })
  }

  if (typeof tier.totalPrice === 'number') {
    return result({
      total: tier.totalPrice,
      subtotal: tier.totalPrice,
      extras: 0,
      unitPrice: tier.totalPrice / quantity,
      unitLabel: product.unitLabel,
    })
  }

  if (typeof tier.unitPrice === 'number') {
    const total = Number((tier.unitPrice * quantity).toFixed(2))

    return result({
      total,
      subtotal: total,
      extras: 0,
      unitPrice: tier.unitPrice,
      unitLabel: product.unitLabel,
    })
  }

  return result({
    total: 0,
    subtotal: 0,
    extras: 0,
    quoteRequired: true,
    validationMessage: 'Cantidad no contemplada en el catalogo base.',
  })
}

export function calculateVanWrapEstimate(productId: string, size: 'S' | 'M' | 'L' | 'XL') {
  const ranges = {
    'rotulacion-basica': { S: [180, 240], M: [240, 320], L: [400, 580], XL: [800, 1000] },
    'rotulacion-parcial': { S: [300, 400], M: [400, 600], L: [600, 800], XL: [800, 1000] },
    'rotulacion-semi': { S: [900, 1100], M: [1000, 1200], L: [1200, 1600], XL: [1600, 2000] },
    'rotulacion-full-wrap': { S: [1800, 2000], M: [2000, 2200], L: [2200, 2450], XL: [2800, 3400] },
  } as const

  const selected = ranges[productId as keyof typeof ranges]

  if (!selected) {
    return result({
      total: 0,
      subtotal: 0,
      extras: 0,
      quoteRequired: true,
      validationMessage: 'Servicio de rotulacion no configurado.',
    })
  }

  const [min, max] = selected[size]

  return result({
    total: max,
    subtotal: max,
    extras: 0,
    quoteRequired: true,
    rangeLabel: `${min} EUR - ${max} EUR`,
  })
}

export function calculateAccessoryPrice(productId: string, quantity: number) {
  return calculateStickerPrice(productId, quantity)
}
