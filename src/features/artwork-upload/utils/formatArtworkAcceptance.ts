import type { ArtworkReferenceAcceptance } from '../../../domain/storage'

export function getArtworkAcceptanceDisplayStatus(acceptance?: ArtworkReferenceAcceptance | null) {
  if (!acceptance) {
    return 'Archivo pendiente'
  }

  if (acceptance.designerHelpRequested) {
    return 'Ayuda de diseno solicitada'
  }

  switch (acceptance.status) {
    case 'no-file':
      return 'Archivo pendiente'
    case 'uploaded':
      return 'Archivo recibido'
    case 'checking':
      return 'Comprobando archivo'
    case 'needs-correction':
      return 'Necesita correccion'
    case 'needs-designer':
      return 'Ayuda de diseno solicitada'
    case 'ready-for-approval':
      return 'Listo para revisar'
    case 'client-approved':
    case 'accepted-for-production':
      return 'Archivo aceptado'
    default:
      return acceptance.statusLabel
  }
}

export function formatArtworkAcceptanceStatus(acceptance?: ArtworkReferenceAcceptance | null) {
  return getArtworkAcceptanceDisplayStatus(acceptance)
}

export function getArtworkAcceptanceDecisionLabel(acceptance?: ArtworkReferenceAcceptance | null) {
  if (!acceptance) {
    return 'Pendiente'
  }

  if (acceptance.designerHelpRequested) {
    return 'Con ayuda de diseno'
  }

  if (acceptance.clientAccepted || acceptance.status === 'accepted-for-production') {
    return 'Aceptado'
  }

  return 'Pendiente'
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
