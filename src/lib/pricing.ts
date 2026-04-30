export type DTFQuality = 'standard' | 'premium'
export type DTFUrgency = 'normal' | 'express'

type PriceBreakdown = {
  subtotal: number
  extras: number
  total: number
}

const BASE_PRICE_PER_METER = 14.5

const qualityMultipliers: Record<DTFQuality, number> = {
  standard: 1,
  premium: 1.15,
}

const urgencyExtras: Record<DTFUrgency, number> = {
  normal: 0,
  express: 8,
}

const roundCurrency = (value: number) => Math.round(value * 100) / 100

export function calculateDTFPricing(
  meters: number,
  quality: DTFQuality,
  urgency: DTFUrgency,
): PriceBreakdown {
  const safeMeters = Number.isFinite(meters) && meters > 0 ? meters : 0
  const subtotal = roundCurrency(safeMeters * BASE_PRICE_PER_METER * qualityMultipliers[quality])
  const extras = roundCurrency(urgencyExtras[urgency])
  const total = roundCurrency(subtotal + extras)

  return {
    subtotal,
    extras,
    total,
  }
}

export { BASE_PRICE_PER_METER, qualityMultipliers, urgencyExtras }
