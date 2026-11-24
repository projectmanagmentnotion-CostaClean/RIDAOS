import type { CartItem } from '../../../types/ecommerce'
import type { ShippingMethod } from '../types/cart.types'

export const SHIPPING_METHODS: ShippingMethod[]
export function hasDtiInnuro(items: CartItem[]): boolean
export function getCartShippingMethods(items: CartItem[]): ShippingMethod[]
export function resolveCartShippingMethod(id: string | undefined, items?: CartItem[]): ShippingMethod
