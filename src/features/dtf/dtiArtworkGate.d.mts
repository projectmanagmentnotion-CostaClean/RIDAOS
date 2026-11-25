type DtiArtworkAcceptance = {
  clientAccepted?: boolean
  designerHelpRequested?: boolean
}

export function dtiArtworkCanEnterCart(file: File | null, acceptance: DtiArtworkAcceptance | null): boolean
export function dtiArtworkFileWasAccepted(file: File | null, acceptedFile: File | null): boolean
