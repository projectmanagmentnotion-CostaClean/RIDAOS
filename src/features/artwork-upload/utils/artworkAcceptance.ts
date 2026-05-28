import type {
  ArtworkPreview,
  ArtworkPreviewSummary,
  ArtworkProductRuleKey,
  ArtworkReferenceAcceptance,
  ArtworkReferenceIssue,
} from '../../../domain/storage'
import { artworkProductRules } from '../product-rules/artworkProductRules'
import type { ArtworkValidationContext } from '../types/artworkUpload'

type BuildArtworkAcceptanceInput = {
  ruleKey: ArtworkProductRuleKey
  metadata: ArtworkPreview | null
  summary: ArtworkPreviewSummary | null
  isLoading: boolean
  clientAccepted: boolean
  designerHelpRequested: boolean
  acceptedAt?: string
  context?: ArtworkValidationContext
}

const preferredFormatsByRule: Record<ArtworkProductRuleKey, string[]> = {
  business_cards: ['PDF', 'AI', 'EPS', 'SVG'],
  stickers: ['PDF', 'SVG', 'AI', 'EPS'],
  dtf_meter: ['PNG', 'PDF', 'AI'],
  printed_vinyl: ['PDF', 'AI', 'EPS'],
  signage: ['PDF', 'AI', 'EPS'],
  textile: ['PNG', 'PDF', 'AI'],
  paper: ['PDF', 'AI', 'EPS'],
}

function hasSpecialFinish(configuration?: Partial<Record<string, string>>) {
  const finish = configuration?.specialFinish
  return finish === 'foil-gold' || finish === 'foil-silver' || finish === 'varnish-3d'
}

function prefersDesignerHelp(configuration?: Partial<Record<string, string>>) {
  const values = Object.values(configuration ?? {})
  return values.some((value) =>
    value === 'assisted' ||
    value === 'review' ||
    value === 'need-help' ||
    value === 'studio-support',
  )
}

function buildGeneralIssues(summary: ArtworkPreviewSummary): ArtworkReferenceIssue[] {
  return summary.advancedChecks
    .filter((check) => check.status === 'fail' || check.status === 'warning')
    .slice(0, 4)
    .map((check) => ({
      id: check.id,
      severity: check.status === 'fail' ? 'critical' : 'warning',
      title: check.title,
      description: check.description,
      whyItMatters: check.productionImpact,
      correctionHint: check.recommendation,
    }))
}

function buildProductSpecificIssues(
  ruleKey: ArtworkProductRuleKey,
  metadata: ArtworkPreview | null,
  context?: ArtworkValidationContext,
): ArtworkReferenceIssue[] {
  const configuration = context?.configuration
  const issues: ArtworkReferenceIssue[] = []
  const format = metadata?.formatLabel ?? ''

  if ((ruleKey === 'business_cards' || ruleKey === 'paper') && format && format !== 'PDF') {
    issues.push({
      id: 'print-format-recommended',
      severity: 'warning',
      title: 'Formato recomendado para impresion',
      description: 'Este producto funciona mejor con un PDF final preparado para imprenta.',
      whyItMatters: 'Un PDF bien exportado reduce incidencias de fuentes, sangrado y paginas.',
      correctionHint: 'Si puedes, exporta una version final en PDF antes de cerrar la solicitud.',
    })
  }

  if (ruleKey === 'paper' && configuration?.printSides === 'double' && format && format !== 'PDF') {
    issues.push({
      id: 'double-sided-file-check',
      severity: 'warning',
      title: 'Archivo a doble cara',
      description: 'Para piezas a dos caras recomendamos PDF multipagina o archivos claramente separados.',
      whyItMatters: 'Ayuda a evitar errores entre anverso y reverso durante la preparacion.',
      correctionHint: 'Sube un PDF con ambas caras o indica con claridad como va cada lado.',
    })
  }

  if (hasSpecialFinish(configuration)) {
    issues.push({
      id: 'special-finish-layer',
      severity: 'critical',
      title: 'Capa separada para acabado especial',
      description: 'Foil oro, foil plata y barniz 3D necesitan una capa o pagina separada para marcar la reserva.',
      whyItMatters: 'Sin esa reserva no podemos interpretar con precision donde aplicar el acabado.',
      correctionHint: 'Prepara una capa o pagina separada con la reserva en negro 100% o solicita ayuda de diseño Ridaos.',
    })
  }

  if (ruleKey === 'stickers' && (configuration?.shape === 'custom' || configuration?.shape === 'kiss-cut')) {
    issues.push({
      id: 'sticker-cutline-required',
      severity: 'warning',
      title: 'Contorno o linea de corte',
      description: 'El troquel personalizado necesita una linea de corte clara o una indicacion precisa del contorno.',
      whyItMatters: 'El corte define la silueta final y evita interpretaciones manuales.',
      correctionHint: 'Aporta una cutline vectorial o pide ayuda de diseño para preparar el troquel.',
    })
  }

  if (ruleKey === 'dtf_meter' && metadata && !['PNG', 'PDF', 'AI'].includes(format)) {
    issues.push({
      id: 'dtf-format-recommended',
      severity: 'warning',
      title: 'Formato recomendado para DTI',
      description: 'Para DTI por metro recomendamos PNG con fondo limpio o PDF preparado.',
      whyItMatters: 'Facilita revisar transparencia, separacion de diseños y aprovechamiento del rollo.',
      correctionHint: 'Exporta una version mas limpia o solicita ayuda para revisar el archivo antes de producir.',
    })
  }

  if (ruleKey === 'textile' && metadata && !['PNG', 'PDF', 'AI', 'SVG'].includes(format)) {
    issues.push({
      id: 'textile-format-recommended',
      severity: 'warning',
      title: 'Formato recomendado para textil',
      description: 'En textil recomendamos PNG transparente, PDF o vector para revisar mejor el marcaje.',
      whyItMatters: 'Ayuda a confirmar fondo, zona de impresion y nitidez final sobre la prenda.',
      correctionHint: 'Sube una version con fondo transparente o solicita ayuda de diseño Ridaos.',
    })
  }

  return issues
}

function getStatusLabel(status: ArtworkReferenceAcceptance['status']) {
  switch (status) {
    case 'no-file':
      return 'Archivo pendiente'
    case 'uploaded':
      return 'Archivo recibido'
    case 'checking':
      return 'Comprobando archivo'
    case 'needs-correction':
      return 'Necesita correccion'
    case 'needs-designer':
      return 'Ayuda de diseño solicitada'
    case 'ready-for-approval':
      return 'Listo para revisar'
    case 'client-approved':
      return 'Aprobado por el cliente'
    case 'accepted-for-production':
      return 'Aceptado para preparar impresion'
    default:
      return 'Archivo pendiente'
  }
}

export function buildArtworkAcceptance({
  ruleKey,
  metadata,
  summary,
  isLoading,
  clientAccepted,
  designerHelpRequested,
  acceptedAt,
  context,
}: BuildArtworkAcceptanceInput): ArtworkReferenceAcceptance {
  const rule = artworkProductRules[ruleKey]
  const preferredFormats = preferredFormatsByRule[ruleKey]
  const formatRecommended = metadata ? preferredFormats.includes(metadata.formatLabel) : false
  const guidanceLabel =
    summary?.suggestedActionLabel ??
    (designerHelpRequested
      ? 'Seguiremos la solicitud contigo antes de preparar impresion.'
      : 'Sube un archivo para activar la comprobacion inicial.')
  const baseIssues = summary ? buildGeneralIssues(summary) : []
  const productIssues = buildProductSpecificIssues(ruleKey, metadata, context)
  const issues = [...baseIssues, ...productIssues]
  const hasCriticalIssue = issues.some((issue) => issue.severity === 'critical')
  const requestedDesigner = designerHelpRequested || prefersDesignerHelp(context?.configuration)

  const status: ArtworkReferenceAcceptance['status'] = requestedDesigner
    ? 'needs-designer'
    : !metadata
      ? 'no-file'
      : isLoading
        ? 'checking'
        : !summary
          ? 'uploaded'
          : clientAccepted
            ? 'client-approved'
            : hasCriticalIssue || summary.workflowStatus === 'blocked'
              ? 'needs-correction'
              : 'ready-for-approval'

  return {
    status,
    statusLabel: getStatusLabel(status),
    acceptanceRequired: Boolean(metadata) && !requestedDesigner,
    clientAccepted,
    designerHelpRequested: requestedDesigner,
    canContinue:
      requestedDesigner ||
      !metadata ||
      status === 'client-approved',
    formatRecommended,
    preferredFormats,
    lastCheckedAt: metadata ? new Date().toISOString() : undefined,
    acceptedAt,
    guidanceLabel,
    warnings: summary?.recommendations.map((recommendation) => recommendation.message) ?? rule.recommendations,
    issues,
  }
}

export function promoteArtworkAcceptanceForOrder(
  acceptance: ArtworkReferenceAcceptance | undefined,
): ArtworkReferenceAcceptance | undefined {
  if (!acceptance || !acceptance.clientAccepted) {
    return acceptance
  }

  return {
    ...acceptance,
    status: 'accepted-for-production',
    statusLabel: getStatusLabel('accepted-for-production'),
    canContinue: true,
  }
}
