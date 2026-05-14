import { runtimeConfig } from '../config/runtime'
import { listOrders } from './orderRepository'
import type { ArtworkUpload } from '../types/backend'

function flattenUploads(uploads: ArtworkUpload[]) {
  return uploads.sort((left, right) => right.uploadedAt.localeCompare(left.uploadedAt))
}

export async function listUploads(): Promise<ArtworkUpload[]> {
  switch (runtimeConfig.dataMode) {
    case 'demo': {
      const orders = await listOrders()
      return flattenUploads(orders.flatMap((order) => order.items.map((item) => item.artwork)))
    }
    case 'supabase': {
      // Supabase-backed upload listing will plug in here later.
      const orders = await listOrders()
      return flattenUploads(orders.flatMap((order) => order.items.map((item) => item.artwork)))
    }
  }
}

export async function getUploadByOrderId(orderId: string): Promise<ArtworkUpload | undefined> {
  const uploads = await listUploads()
  return uploads.find((upload) => upload.orderId === orderId)
}
