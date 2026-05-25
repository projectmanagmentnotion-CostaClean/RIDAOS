import type { ConfigState } from '../../lib/configuratorState'
import type { CartItem } from '../../types/ecommerce'
import type { CatalogEntry, ConfiguratorField } from '../../types/product'
import type { CatalogPricingResult } from './catalogPricingAdapter'
import type { ArtworkPreviewSummary } from '../../domain/storage'

type UploadMeta = {
  fileName?: string
  fileType?: string
  fileSize?: number
  formatLabel?: string
  notes?: string
  previewSummary?: ArtworkPreviewSummary
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

function resolveFieldDisplayValue(field: ConfiguratorField, value: string) {
  if (field.type === 'select' || field.type === 'variant' || field.type === 'size') {
    return field.options.find((option) => option.value === value)?.label ?? value
  }

  if (field.type === 'quantity') {
    return `${value} uds`
  }

  if (field.type === 'meters') {
    return `${value} m`
  }

  if (field.type === 'area') {
    return `${value} m2`
  }

  return value
}

function buildSummary(entry: CatalogEntry, config: ConfigState) {
  const summary: string[] = [`Producto: ${entry.name}`]

  for (const field of entry.configuratorFields) {
    const value = config[field.key]?.trim()
    if (!value || field.key === 'product' || field.key === 'variant' || field.key === 'notes') {
      continue
    }

    if (field.type === 'file') {
      summary.push(`Archivo: ${value}`)
      continue
    }

    summary.push(`${field.label}: ${resolveFieldDisplayValue(field, value)}`)
  }

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
      previewSummary: uploadMeta?.previewSummary,
    },
  }
}
