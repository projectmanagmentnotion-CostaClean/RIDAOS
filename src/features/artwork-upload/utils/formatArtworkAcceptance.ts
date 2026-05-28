import type { ArtworkReferenceAcceptance } from '../../../domain/storage'

export function formatArtworkAcceptanceStatus(acceptance?: ArtworkReferenceAcceptance | null) {
  if (!acceptance) {
    return 'Archivo pendiente'
  }

  if (acceptance.designerHelpRequested) {
    return 'Ayuda de diseno Ridaos solicitada'
  }

  return acceptance.statusLabel
}

export function getArtworkAcceptanceCtaLabel(acceptance?: ArtworkReferenceAcceptance | null) {
  if (!acceptance || acceptance.status === 'no-file') {
    return 'Subir archivo'
  }

  if (acceptance.designerHelpRequested) {
    return 'Ver solicitud'
  }

  if (acceptance.clientAccepted) {
    return 'Archivo aceptado'
  }

  return 'Revisar archivo'
}
