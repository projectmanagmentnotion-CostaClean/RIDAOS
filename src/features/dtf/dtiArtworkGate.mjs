export function dtiArtworkFileWasAccepted(file, acceptedFile) {
  return Boolean(file && file === acceptedFile)
}

export function dtiArtworkCanEnterCart(file, acceptance) {
  return Boolean(file && acceptance && (acceptance.clientAccepted || acceptance.designerHelpRequested))
}

const artworkEditableOrderStatuses = new Set([
  'awaiting_artwork',
  'awaiting_artwork_review',
  'awaiting_manual_timeline',
])

export function dtiOrderCanRetryArtwork(status) {
  if (status == null || status === '') return true
  return artworkEditableOrderStatuses.has(String(status))
}
