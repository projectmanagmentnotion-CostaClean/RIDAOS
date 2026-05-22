import { getArtworkRepository } from '../infrastructure/repositoryFactory'

const wait = (delay = 120) => new Promise((resolve) => window.setTimeout(resolve, delay))

export async function getArtworkHistory() {
  await wait()
  return getArtworkRepository().listArtworkUploads()
}

export async function getArtworkForOrder(orderId: string) {
  await wait()
  return getArtworkRepository().getArtworkUploadByOrderId(orderId)
}
