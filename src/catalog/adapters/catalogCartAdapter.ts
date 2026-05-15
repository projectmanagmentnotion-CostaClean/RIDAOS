import type { ConfigState } from '../../lib/configuratorState'
import type { CartItem } from '../../types/ecommerce'
import type { CatalogEntry } from '../../types/product'
import type { CatalogPricingResult } from './catalogPricingAdapter'

type UploadMeta = {
  fileName?: string
  fileType?: string
  fileSize?: number
  formatLabel?: string
  notes?: string
}

function formatSummaryValue(value: string | number, suffix?: string) {
  if (value === '' || value === 0) {
    return null
  }

  return suffix ? `${value} ${suffix}` : String(value)
}

function mapProductType(entry: CatalogEntry): CartItem['productType'] {
  switch (entry.category) {
    case 'textil':
      return 'textile'
    case 'papeleria':
      return 'paper'
    case 'materiales':
      return 'material'
    case 'accesorios':
      return 'accessory'
    case 'dtf':
      return 'dtf'
    default:
      return 'accessory'
  }
}

function buildSummary(entry: CatalogEntry, config: ConfigState) {
  const summary: string[] = [`Producto: ${entry.name}`]
  const quantity = formatSummaryValue(config.quantity, 'uds')
  const area = formatSummaryValue(config.area, 'm2')
  const meters = formatSummaryValue(config.meters, 'm')

  if (quantity) summary.push(`Cantidad: ${quantity}`)
  if (area) summary.push(`Superficie: ${area}`)
  if (meters) summary.push(`Metraje: ${meters}`)
  if (config.size) summary.push(`Tamano: ${config.size}`)
  if (config.file) summary.push(`Archivo: ${config.file}`)

  return summary
}

export function createCatalogCartItem(entry: CatalogEntry, config: ConfigState, pricing: CatalogPricingResult, uploadMeta?: UploadMeta): CartItem {
  const itemId = `${entry.category}-${Date.now()}`
  const notes = uploadMeta?.notes ?? config.notes?.trim() ?? ''
  const fileName = uploadMeta?.fileName ?? config.file ?? 'Sin archivo adjunto'

  return {
    id: itemId,
    productType: mapProductType(entry),
    productName: entry.name,
    configuration: {
      quantity: config.quantity ? Number(config.quantity) : undefined,
      areaM2: config.area ? Number(config.area) : undefined,
      meters: config.meters ? Number(config.meters) : undefined,
      size: config.size || undefined,
      variant: entry.name,
      summary: buildSummary(entry, config),
      notes,
    },
    pricing: {
      unitPrice: pricing.unitPrice ?? 0,
      unitLabel: pricing.unitLabel ?? entry.unitLabel,
      subtotal: pricing.subtotal,
      extras: 0,
      total: pricing.total,
      quoteRequired: pricing.quoteRequired,
    },
    artwork: {
      id: `upload-${Date.now()}`,
      itemId,
      fileName,
      fileType: uploadMeta?.fileType ?? 'text/plain',
      fileSize: uploadMeta?.fileSize ?? 0,
      formatLabel: uploadMeta?.formatLabel ?? (fileName === 'Sin archivo adjunto' ? 'PENDIENTE' : 'ARCHIVO'),
      status: 'pending_review',
      uploadedAt: new Date().toISOString(),
      notes,
    },
  }
}
