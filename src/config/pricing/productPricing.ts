export const productPricingConfig = {
  currency: 'EUR' as const,
  futureVatRate: null as number | null,
  pricingModes: ['unit', 'volume', 'm2', 'range', 'quote'] as const,
}
