export type DTFQuality = 'standard' | 'premium'
export type DTFUrgency = 'normal' | 'express'

export type PriceBreakdown = {
  subtotal: number
  extras: number
  total: number
}

export const DTF_PRICING_CONFIG = {
  currency: 'EUR' as const,
  basePricePerMeter: 14.5,
  minimumMeters: 0.1,
  qualityMultipliers: {
    standard: 1,
    premium: 1.15,
  } satisfies Record<DTFQuality, number>,
  urgencyExtras: {
    normal: 0,
    express: 8,
  } satisfies Record<DTFUrgency, number>,
  discounts: [],
  extras: ['express'],
  futureVatRate: null as number | null,
}

const roundCurrency = (value: number) => Math.round(value * 100) / 100

export function calculateDTFPricing(
  meters: number,
  quality: DTFQuality,
  urgency: DTFUrgency,
): PriceBreakdown {
  const safeMeters = Number.isFinite(meters) && meters > 0 ? meters : 0
  const subtotal = roundCurrency(
    safeMeters *
      DTF_PRICING_CONFIG.basePricePerMeter *
      DTF_PRICING_CONFIG.qualityMultipliers[quality],
  )
  const extras = roundCurrency(DTF_PRICING_CONFIG.urgencyExtras[urgency])
  const total = roundCurrency(subtotal + extras)

  return {
    subtotal,
    extras,
    total,
  }
}

export const BASE_PRICE_PER_METER = DTF_PRICING_CONFIG.basePricePerMeter
export const qualityMultipliers = DTF_PRICING_CONFIG.qualityMultipliers
export const urgencyExtras = DTF_PRICING_CONFIG.urgencyExtras
