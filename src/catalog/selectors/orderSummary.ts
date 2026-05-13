import type { OrderItem } from '../../types/backend'

export function getOrderItemSummary(item: Pick<OrderItem, 'configuration' | 'artwork'>) {
  if (item.configuration.summary && item.configuration.summary.length > 0) {
    return item.configuration.summary
  }

  const summary: string[] = []

  if (item.configuration.meters) summary.push(`${item.configuration.meters} m`)
  if (item.configuration.quantity) summary.push(`${item.configuration.quantity} uds`)
  if (item.configuration.areaM2) summary.push(`${item.configuration.areaM2} m2`)
  if (item.configuration.variant) summary.push(item.configuration.variant)
  if (item.configuration.size) summary.push(item.configuration.size)
  if (item.artwork.fileName && item.artwork.fileName !== 'Sin archivo adjunto') summary.push(item.artwork.fileName)

  return summary
}
