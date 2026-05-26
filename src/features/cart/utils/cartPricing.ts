import type { CartItem } from '../../../types/ecommerce'
import type { CartCoupon, CartSummary, ShippingMethod, ShippingMethodId } from '../types/cart.types'

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'pickup',
    label: 'Recogida en taller',
    description: 'Sin coste. Confirmamos la salida cuando termina la comprobacion tecnica.',
    price: 0,
    eta: 'Aviso al finalizar produccion',
  },
  {
    id: 'standard',
    label: 'Envio peninsula',
    description: 'Expedicion preparada para pedidos listos y validados.',
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

export const CART_COUPONS: CartCoupon[] = [
  { code: 'RIDAOS10', label: 'Descuento lanzamiento', kind: 'percent', value: 10, minSubtotal: 60 },
  { code: 'MUESTRA5', label: 'Credito de muestra', kind: 'fixed', value: 5, minSubtotal: 25 },
]

export const TAX_RATE = 0.21

const roundCurrency = (value: number) => Math.round(value * 100) / 100

export function getItemLineQuantity(item: CartItem) {
  return Math.max(1, item.lineQuantity ?? 1)
}

export function getCartItemLineSubtotal(item: CartItem) {
  return roundCurrency(item.pricing.subtotal * getItemLineQuantity(item))
}

export function getCartItemLineExtras(item: CartItem) {
  return roundCurrency(item.pricing.extras * getItemLineQuantity(item))
}

export function getCartItemLineTotal(item: CartItem) {
  return roundCurrency(item.pricing.total * getItemLineQuantity(item))
}

export function getCartSubtotal(items: CartItem[]) {
  return roundCurrency(items.reduce((sum, item) => sum + getCartItemLineTotal(item), 0))
}

export function resolveShippingMethod(id: string | undefined) {
  return SHIPPING_METHODS.find((method) => method.id === id) ?? SHIPPING_METHODS[0]
}

export function resolveCoupon(code: string, subtotal: number) {
  const normalizedCode = code.trim().toUpperCase()
  const coupon = CART_COUPONS.find((entry) => entry.code === normalizedCode)

  if (!coupon) {
    return { coupon: null, discount: 0 }
  }

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { coupon: null, discount: 0 }
  }

  const discount =
    coupon.kind === 'percent'
      ? roundCurrency((subtotal * coupon.value) / 100)
      : roundCurrency(Math.min(coupon.value, subtotal))

  return { coupon, discount }
}

export function buildCartSummary(input: {
  items: CartItem[]
  shippingMethod: ShippingMethodId | string
  couponCode: string
}): CartSummary {
  const subtotal = getCartSubtotal(input.items)
  const shipping = resolveShippingMethod(input.shippingMethod)
  const { coupon, discount } = resolveCoupon(input.couponCode, subtotal)
  const taxableBase = Math.max(0, subtotal - discount + shipping.price)
  const taxes = roundCurrency(taxableBase * TAX_RATE)
  const total = roundCurrency(taxableBase + taxes)

  return {
    items: input.items,
    itemCount: input.items.length,
    lineCount: input.items.reduce((sum, item) => sum + getItemLineQuantity(item), 0),
    subtotal,
    shipping,
    coupon,
    couponDiscount: discount,
    taxes,
    total,
  }
}

export function multiplyOrderItemPricing(item: CartItem): CartItem {
  const quantity = getItemLineQuantity(item)

  if (quantity === 1) {
    return item
  }

  return {
    ...item,
    pricing: {
      ...item.pricing,
      subtotal: getCartItemLineSubtotal(item),
      extras: getCartItemLineExtras(item),
      total: getCartItemLineTotal(item),
    },
  }
}
