import type { CartItem } from '../../../types/ecommerce'

export type ShippingMethodId = 'pickup' | 'standard' | 'express'

export type CartCoupon = {
  code: string
  label: string
  kind: 'percent' | 'fixed'
  value: number
  minSubtotal?: number
}

export type ShippingMethod = {
  id: ShippingMethodId
  label: string
  description: string
  price: number
  eta: string
}

export type CartRecommendation = {
  id: string
  title: string
  description: string
  href: string
  priceLabel: string
  tag: string
}

export type CartSummary = {
  items: CartItem[]
  itemCount: number
  lineCount: number
  subtotal: number
  shipping: ShippingMethod
  coupon: CartCoupon | null
  couponDiscount: number
  taxes: number
  total: number
}
