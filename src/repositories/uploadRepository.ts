import { getArtworkRepository } from '../infrastructure/repositoryFactory'
import type { ArtworkUpload } from '../types/backend'

export async function listUploads(): Promise<ArtworkUpload[]> {
  return getArtworkRepository().listArtworkUploads()
}

export async function getUploadByOrderId(orderId: string): Promise<ArtworkUpload | undefined> {
  return getArtworkRepository().getArtworkUploadByOrderId(orderId)
}
