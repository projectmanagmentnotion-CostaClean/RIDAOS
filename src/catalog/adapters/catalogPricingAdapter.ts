import { calculateAccessoryPrice, calculateMaterialM2Price, calculatePaperPrice, calculateTextilePrice, calculateVanWrapEstimate } from '../../lib/pricingEngine'
import type { ConfigState } from '../../lib/configuratorState'
import type { CatalogEntry } from '../../types/product'
import { formatCatalogCurrency, formatRangeLabel } from '../pricing/formatters'
import { getEnhancedProductPricing } from '../../features/product-options'

export type CatalogPricingResult = {
  subtotal: number
  total: number
  currency: 'EUR'
  pricingLabel: string
  breakdown: string[]
  warnings: string[]
  canAddToCart: boolean
  quoteRequired?: boolean
  validationMessage?: string
  unitPrice?: number
  unitLabel?: string
  rangeLabel?: string
}

function toResult(input: Partial<CatalogPricingResult> & Pick<CatalogPricingResult, 'subtotal' | 'total' | 'pricingLabel'>): CatalogPricingResult {
  return {
    currency: 'EUR',
    breakdown: [],
    warnings: [],
    canAddToCart: false,
    ...input,
  }
}

function finalizeResult(
  entry: CatalogEntry,
  input: {
    subtotal: number
    total: number
    unitPrice?: number
    unitLabel?: string
    quoteRequired?: boolean
    validationMessage?: string
    rangeLabel?: string
  },
  breakdown: string[],
  warnings: string[],
) {
  const pricingLabel = input.rangeLabel ? input.rangeLabel : input.total > 0 ? formatCatalogCurrency(input.total) : 'A consultar'

  return toResult({
    subtotal: input.subtotal,
    total: input.total,
    unitPrice: input.unitPrice,
    unitLabel: input.unitLabel ?? entry.unitLabel,
    quoteRequired: input.quoteRequired,
    validationMessage: input.validationMessage,
    rangeLabel: input.rangeLabel,
    pricingLabel,
    breakdown,
    warnings: [...(input.validationMessage ? [input.validationMessage] : []), ...warnings],
    canAddToCart: !input.quoteRequired && !input.validationMessage && input.total > 0,
  })
}

export function getCatalogPricingResult(entry: CatalogEntry, config: ConfigState): CatalogPricingResult {
  const enhancedPricing = getEnhancedProductPricing(entry, config)
  if (enhancedPricing) {
    return enhancedPricing
  }

  switch (entry.category) {
    case 'textil': {
      const quantity = Number(config.quantity ?? '0')
      const price = calculateTextilePrice(entry.id, quantity)
      return finalizeResult(entry, price, [`Producto: ${entry.name}`, `Cantidad: ${quantity || 0} uds`, ...(price.unitPrice ? [`${formatCatalogCurrency(price.unitPrice)}/${price.unitLabel ?? entry.unitLabel ?? 'ud'}`] : [])], [])
    }
    case 'papeleria': {
      const quantity = Number(config.quantity ?? '0')
      const price = calculatePaperPrice(entry.id, quantity)
      return finalizeResult(entry, price, [`Producto: ${entry.name}`, `Tirada: ${quantity || 0} uds`, ...(price.unitPrice ? [`Media por unidad: ${formatCatalogCurrency(price.unitPrice)}`] : [])], entry.notes ?? [])
    }
    case 'materiales': {
      const area = Number(config.area ?? '0')
      const price = calculateMaterialM2Price(entry.id, area)
      return finalizeResult(entry, price, [`Material: ${entry.name}`, `Superficie: ${area || 0} m2`, ...(price.unitPrice ? [`${formatCatalogCurrency(price.unitPrice)}/${price.unitLabel ?? entry.unitLabel ?? 'm2'}`] : [])], ['Los soportes complejos y lonas pasan a presupuesto.'])
    }
    case 'accesorios': {
      const quantity = Number(config.quantity ?? '0')
      const price = calculateAccessoryPrice(entry.id, quantity)
      return finalizeResult(entry, price, [`Producto: ${entry.name}`, `Cantidad: ${quantity || 0} uds`, ...(price.unitPrice ? [`Base: ${formatCatalogCurrency(price.unitPrice)}/${price.unitLabel ?? entry.unitLabel ?? 'ud'}`] : [])], ['Otras cantidades y formatos pasan a consulta.'])
    }
    case 'rotulacion': {
      const size = (config.size || 'M') as 'S' | 'M' | 'L' | 'XL'
      const price = calculateVanWrapEstimate(entry.id, size)
      return finalizeResult(entry, price, [`Servicio: ${entry.name}`, `Tamano: ${size}`], ['Servicio orientativo sujeto a confirmacion comercial.'])
    }
    case 'neones': {
      return finalizeResult(entry, { subtotal: entry.range?.max ?? 0, total: entry.range?.max ?? 0, quoteRequired: true, rangeLabel: entry.range ? formatRangeLabel(entry.range.min, entry.range.max) : undefined }, [`Servicio: ${entry.name}`], entry.notes ?? ['No incluye instalacion y puede variar por complejidad.'])
    }
    default:
      return toResult({ subtotal: 0, total: 0, pricingLabel: 'Precio a consultar', quoteRequired: true, warnings: ['El precio se confirmara al revisar los detalles del proyecto.'] })
  }
}
