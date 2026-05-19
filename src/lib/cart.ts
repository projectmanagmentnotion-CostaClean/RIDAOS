import { useCartStore } from '../store/useCartStore'
import type { CartItem } from '../types/ecommerce'

export function getCart(): CartItem[] {
  return useCartStore.getState().items
}

export function addToCart(item: CartItem): CartItem[] {
  const store = useCartStore.getState()
  store.addItem(item)
  return useCartStore.getState().items
}

export function removeFromCart(id: string): CartItem[] {
  const store = useCartStore.getState()
  store.removeItem(id)
  return useCartStore.getState().items
}

export function clearCart() {
  useCartStore.getState().clearCart()
}

export function getCartTotal(items: CartItem[] = getCart()) {
  return items.reduce((sum, item) => sum + item.pricing.total * (item.lineQuantity ?? 1), 0)
}

export function updateCartItemQuantity(id: string, quantity: number) {
  useCartStore.getState().updateItemQuantity(id, quantity)
  return useCartStore.getState().items
}
