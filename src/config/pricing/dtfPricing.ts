export type DTFQuality = 'standard' | 'premium'
export type DTFUrgency = 'normal' | 'express'

import {
  calculateDtiInnuroPrice,
  DTI_INNURO_MINIMUM_METERS,
  DTI_INNURO_PRICE_PER_METER,
} from './dtiInnuroPricing.mjs'

export type PriceBreakdown = {
  subtotal: number
  extras: number
  total: number
}

export const DTF_PRICING_CONFIG = {
  currency: 'EUR' as const,
  basePricePerMeter: DTI_INNURO_PRICE_PER_METER,
  minimumMeters: DTI_INNURO_MINIMUM_METERS,
  qualityMultipliers: {
    standard: 1,
    premium: 1,
  } satisfies Record<DTFQuality, number>,
  urgencyExtras: {
    normal: 0,
    express: 0,
  } satisfies Record<DTFUrgency, number>,
  discounts: [],
  extras: [],
  vatRate: 0.21,
}

export function calculateDTFPricing(
  meters: number,
  quality: DTFQuality,
  urgency: DTFUrgency,
): PriceBreakdown {
  void quality
  void urgency
  const pricing = calculateDtiInnuroPrice(meters)

  return {
    subtotal: pricing.total,
    extras: 0,
    total: pricing.total,
  }
}

export const BASE_PRICE_PER_METER = DTF_PRICING_CONFIG.basePricePerMeter
export const qualityMultipliers = DTF_PRICING_CONFIG.qualityMultipliers
export const urgencyExtras = DTF_PRICING_CONFIG.urgencyExtras
