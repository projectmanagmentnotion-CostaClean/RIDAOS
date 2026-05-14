import { getUploadRepository } from '../infrastructure/repositoryFactory'
import type { ArtworkUpload } from '../types/backend'

export async function listUploads(): Promise<ArtworkUpload[]> {
  return getUploadRepository().listUploads()
}

export async function getUploadByOrderId(orderId: string): Promise<ArtworkUpload | undefined> {
  return getUploadRepository().getUploadByOrderId(orderId)
}
