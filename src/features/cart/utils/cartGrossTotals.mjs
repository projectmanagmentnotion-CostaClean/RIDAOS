const roundCurrency = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100

export function calculateCartGrossTotals(items, shipping, couponDiscount, taxRate = 0.21) {
  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.pricing.total * Math.max(1, item.lineQuantity ?? 1), 0))
  const includedItemsGross = roundCurrency(items.reduce(
    (sum, item) => sum + (item.pricing.vatIncluded ? item.pricing.total * Math.max(1, item.lineQuantity ?? 1) : 0),
    0,
  ))
  const includedRatio = subtotal > 0 ? includedItemsGross / subtotal : 0
  const includedDiscount = roundCurrency(couponDiscount * includedRatio)
  const exclusiveDiscount = roundCurrency(couponDiscount - includedDiscount)
  const includedShipping = shipping.includedPrice ?? (shipping.vatIncluded ? shipping.price : 0)
  const exclusiveShipping = shipping.taxablePrice ?? (shipping.vatIncluded ? 0 : shipping.price)
  const includedGross = Math.max(0, includedItemsGross - includedDiscount) + includedShipping
  const exclusiveGross = Math.max(0, subtotal - includedItemsGross - exclusiveDiscount) + exclusiveShipping
  const includedVat = includedGross - includedGross / (1 + taxRate)
  const additionalVat = exclusiveGross * taxRate

  return {
    subtotal,
    taxes: roundCurrency(includedVat + additionalVat),
    total: roundCurrency(subtotal - couponDiscount + shipping.price + additionalVat),
  }
}
