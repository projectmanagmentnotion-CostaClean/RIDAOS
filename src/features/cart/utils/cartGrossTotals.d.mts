export function calculateCartGrossTotals(
  items: Array<{ pricing: { total: number; vatIncluded?: boolean }; lineQuantity?: number }>,
  shipping: { price: number; vatIncluded?: boolean },
  couponDiscount: number,
  taxRate?: number,
): { subtotal: number; taxes: number; total: number }
