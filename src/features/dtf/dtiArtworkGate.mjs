export function dtiArtworkFileWasAccepted(file, acceptedFile) {
  return Boolean(file && file === acceptedFile)
}

export function dtiArtworkCanEnterCart(file, acceptance) {
  return Boolean(file && acceptance && (acceptance.clientAccepted || acceptance.designerHelpRequested))
}
