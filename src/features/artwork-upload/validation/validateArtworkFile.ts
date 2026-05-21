import { artworkProductRules } from '../product-rules/artworkProductRules'
import type {
  ArtworkPreviewMetadata,
  ArtworkPreviewSummary,
  ArtworkProductRuleKey,
  ArtworkRecommendation,
  ArtworkValidationCheck,
  ArtworkValidationState,
} from '../types/artworkUpload'

function statusRank(status: ArtworkValidationState) {
  switch (status) {
    case 'blocked':
      return 4
    case 'needs_review':
      return 3
    case 'warning':
      return 2
    case 'ready':
    default:
      return 1
  }
}

function deriveWorkflowStatus(checks: ArtworkValidationCheck[]): ArtworkValidationState {
  return checks.reduce<ArtworkValidationState>(
    (current, check) => (statusRank(check.status) > statusRank(current) ? check.status : current),
    'ready',
  )
}

export function validateArtworkFile(
  ruleKey: ArtworkProductRuleKey,
  metadata: ArtworkPreviewMetadata,
): ArtworkPreviewSummary {
  const rule = artworkProductRules[ruleKey]
  const extensionAllowed = rule.acceptedFormats.includes(metadata.formatLabel)
  const maxBytes = rule.maxFileSizeMb * 1024 * 1024
  const estimatedDpi =
    metadata.widthPx && metadata.heightPx
      ? Math.round(Math.min(metadata.widthPx, metadata.heightPx) / 4)
      : null

  const checks: ArtworkValidationCheck[] = [
    {
      id: 'format',
      label: 'Formato permitido',
      status: extensionAllowed ? 'ready' : 'blocked',
      message: extensionAllowed
        ? `${metadata.formatLabel} entra dentro de los formatos previstos para ${rule.label.toLowerCase()}.`
        : `${metadata.formatLabel} no es uno de los formatos recomendados para este producto.`,
    },
    {
      id: 'file-size',
      label: 'Peso del archivo',
      status: metadata.fileSize <= maxBytes ? 'ready' : 'needs_review',
      message:
        metadata.fileSize <= maxBytes
          ? `Peso correcto para el flujo mock (${metadata.fileSizeLabel}).`
          : `El archivo supera el peso orientativo de ${rule.maxFileSizeMb} MB.`,
    },
    {
      id: 'resolution',
      label: 'Resolución aproximada',
      status:
        estimatedDpi === null
          ? 'warning'
          : estimatedDpi >= rule.recommendedMinResolutionDpi
            ? 'ready'
            : estimatedDpi >= Math.round(rule.recommendedMinResolutionDpi * 0.65)
              ? 'warning'
              : 'needs_review',
      message:
        estimatedDpi === null
          ? 'No podemos leer la resolución exacta en este mock. Conviene revisión técnica.'
          : `Resolución estimada: ${estimatedDpi} dpi frente a recomendación de ${rule.recommendedMinResolutionDpi} dpi.`,
    },
    {
      id: 'orientation',
      label: 'Orientación',
      status:
        rule.guide.preferredOrientation === 'free' ||
        metadata.orientation === 'free' ||
        metadata.orientation === rule.guide.preferredOrientation
          ? 'ready'
          : 'warning',
      message:
        rule.guide.preferredOrientation === 'free'
          ? 'La orientación se revisa según el montaje final.'
          : `Orientación detectada: ${metadata.orientation}. Orientación recomendada: ${rule.guide.preferredOrientation}.`,
    },
    {
      id: 'bleed',
      label: 'Sangrado y zona segura',
      status: rule.guide.showBleedZone ? 'warning' : 'ready',
      message: rule.guide.showBleedZone
        ? `Para ${rule.label.toLowerCase()} revisa sangrado de ${rule.guide.bleedMm} mm y zona segura de ${rule.guide.safeMarginMm} mm.`
        : 'Este producto no depende de sangrado clásico, pero sí de respetar margen interior.',
    },
    {
      id: 'colour-space',
      label: 'Lectura RGB/CMYK',
      status: 'warning',
      message: 'El espacio de color se muestra como check informativo mock; conviene validación final antes de imprimir.',
    },
  ]

  if (ruleKey === 'stickers') {
    checks.push({
      id: 'cutline',
      label: 'Línea de corte',
      status: 'needs_review',
      message: 'Para pegatinas recomendamos una línea de corte vectorial. Este mock no puede detectarla automáticamente.',
    })
  }

  if (ruleKey === 'dtf_meter') {
    checks.push({
      id: 'spacing',
      label: 'Separación entre diseños',
      status: 'warning',
      message: 'Deja separación entre diseños para facilitar el montaje y el aprovechamiento del rollo.',
    })
  }

  const recommendations: ArtworkRecommendation[] = [
    ...rule.recommendations.map((message, index) => ({
      id: `${ruleKey}-base-${index}`,
      message,
      tone: 'info' as const,
    })),
    ...checks
      .filter((check) => check.status !== 'ready')
      .map((check) => ({
        id: `${ruleKey}-${check.id}`,
        message:
          check.id === 'bleed'
            ? 'Extiende el fondo hasta la zona de sangrado y deja textos dentro de la zona segura.'
            : check.id === 'resolution'
              ? 'Tu archivo parece ir justo de resolución. Si quieres, lo revisamos manualmente antes de producir.'
              : check.id === 'cutline'
                ? 'Para pegatinas recomendamos una línea de corte vectorial visible.'
                : check.id === 'spacing'
                  ? 'Para DTF deja separación suficiente entre diseños antes de confirmar.'
                  : check.message,
        tone: (check.status === 'needs_review' || check.status === 'blocked' ? 'critical' : 'warning') as
          | 'critical'
          | 'warning',
      })),
  ]

  return {
    ruleKey,
    workflowStatus: deriveWorkflowStatus(checks),
    orientation: metadata.orientation,
    fileName: metadata.fileName,
    formatLabel: metadata.formatLabel,
    fileSizeLabel: metadata.fileSizeLabel,
    estimatedPhysicalSizeLabel: rule.recommendedPhysicalSizeLabel,
    checks,
    recommendations,
  }
}
