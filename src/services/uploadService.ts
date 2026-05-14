import { runtimeConfig } from '../config/runtime'
import { getUploadByOrderId, listUploads } from '../repositories/uploadRepository'

const wait = (delay = 120) => new Promise((resolve) => window.setTimeout(resolve, delay))

export async function getArtworkHistory() {
  switch (runtimeConfig.dataMode) {
    case 'demo':
      await wait()
      return listUploads()
    case 'supabase':
      // Supabase-backed upload history will plug in here later.
      await wait()
      return listUploads()
  }
}

export async function getArtworkForOrder(orderId: string) {
  switch (runtimeConfig.dataMode) {
    case 'demo':
      await wait()
      return getUploadByOrderId(orderId)
    case 'supabase':
      // Supabase-backed upload retrieval will plug in here later.
      await wait()
      return getUploadByOrderId(orderId)
  }
}
