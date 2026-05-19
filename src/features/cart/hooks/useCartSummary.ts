import { useMemo } from 'react'
import { useCartStore } from '../../../store/useCartStore'
import { buildCartSummary } from '../utils/cartPricing'

export function useCartSummary() {
  const items = useCartStore((state) => state.items)
  const shippingMethod = useCartStore((state) => state.shippingMethod)
  const couponCode = useCartStore((state) => state.couponCode)

  return useMemo(
    () =>
      buildCartSummary({
        items,
        shippingMethod,
        couponCode,
      }),
    [couponCode, items, shippingMethod],
  )
}
