export function dtiArtworkCanEnterCart(file, acceptance) {
  return Boolean(file && acceptance && (acceptance.clientAccepted || acceptance.designerHelpRequested))
}
