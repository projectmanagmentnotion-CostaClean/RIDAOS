import type { PrepressCheckDefinition, PrepressCheckStatus } from '../../../domain/storage'
import type { PrepressAnalysisPayload } from '../types/prepress'

const previewableTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'application/pdf']
const vectorFormats = ['PDF', 'AI', 'EPS', 'SVG']
const transparentFormats = ['PNG', 'WEBP', 'SVG']

function estimatedDpi(payload: PrepressAnalysisPayload) {
  const { metadata } = payload
  if (!metadata.widthPx || !metadata.heightPx) {
    return null
  }

  return Math.round(Math.min(metadata.widthPx, metadata.heightPx) / 4)
}

function statusFromBoolean(valid: boolean, failStatus: PrepressCheckStatus = 'fail'): PrepressCheckStatus {
  return valid ? 'pass' : failStatus
}

export function buildPrepressChecks(payload: PrepressAnalysisPayload): PrepressCheckDefinition[] {
  const { metadata, productRule, ruleset } = payload
  const dpi = estimatedDpi(payload)
  const isVectorLike = vectorFormats.includes(metadata.formatLabel)
  const canPreview = metadata.canPreview || previewableTypes.includes(metadata.formatLabel)
  const lowResolution = dpi !== null && dpi < ruleset.thresholds.warningMinDpi
  const missingBleed = productRule.guide.showBleedZone && productRule.guide.bleedMm > 0
  const orientationMismatch =
    productRule.guide.preferredOrientation !== 'free' &&
    metadata.orientation !== 'free' &&
    metadata.orientation !== productRule.guide.preferredOrientation

  const checks: PrepressCheckDefinition[] = [
    {
      id: 'file_format_check',
      status: statusFromBoolean(productRule.acceptedFormats.includes(metadata.formatLabel)),
      severity: 'critical',
      title: 'Formato del archivo',
      description: `${metadata.formatLabel} ${productRule.acceptedFormats.includes(metadata.formatLabel) ? 'entra' : 'no entra'} en los formatos previstos.`,
      recommendation: `Usa uno de estos formatos: ${productRule.acceptedFormats.join(', ')}.`,
      productApplicability: [productRule.key],
      productionImpact: 'Un formato incorrecto frena la entrada a produccion.',
      blocking: true,
    },
    {
      id: 'file_size_check',
      status: statusFromBoolean(metadata.fileSize <= ruleset.thresholds.maxFileSizeMb * 1024 * 1024, 'warning'),
      severity: metadata.fileSize <= ruleset.thresholds.maxFileSizeMb * 1024 * 1024 ? 'low' : 'high',
      title: 'Peso del archivo',
      description: `Peso detectado: ${metadata.fileSizeLabel}. Limite orientativo: ${ruleset.thresholds.maxFileSizeMb} MB.`,
      recommendation: 'Reduce recursos incrustados o exporta una version mas limpia si el archivo pesa demasiado.',
      productApplicability: [productRule.key],
      productionImpact: 'Archivos pesados hacen mas lenta la revision y el rip.',
      blocking: false,
    },
    {
      id: 'dpi_check',
      status:
        dpi === null ? 'info' : dpi >= ruleset.thresholds.recommendedMinDpi ? 'pass' : dpi >= ruleset.thresholds.warningMinDpi ? 'warning' : 'fail',
      severity: dpi === null ? 'medium' : lowResolution ? 'critical' : dpi < ruleset.thresholds.recommendedMinDpi ? 'medium' : 'low',
      title: 'Resolucion aproximada',
      description:
        dpi === null
          ? 'No podemos leer DPI exactos en este mock. Hace falta validacion tecnica.'
          : `Resolucion estimada ${dpi} dpi frente a recomendacion de ${ruleset.thresholds.recommendedMinDpi} dpi.`,
      recommendation: 'Si el diseño va justo, exporta una version a mayor resolucion o pide revision manual.',
      productApplicability: [productRule.key],
      productionImpact: 'Una resolucion baja puede afectar nitidez, texto y bordes.',
      blocking: lowResolution,
    },
    {
      id: 'bleed_check',
      status: missingBleed ? 'warning' : 'info',
      severity: missingBleed ? 'medium' : 'low',
      title: 'Sangrado',
      description: missingBleed
        ? `Este producto requiere sangrado de ${productRule.guide.bleedMm} mm.`
        : 'Este producto no depende de sangrado clasico.',
      recommendation: missingBleed
        ? 'Extiende fondos hasta la linea exterior de sangrado.'
        : 'Mantiene controlado el margen interior aunque no haya sangrado clasico.',
      productApplicability: [productRule.key],
      productionImpact: 'Un sangrado corto puede dejar bordes blancos al cortar.',
      blocking: false,
    },
    {
      id: 'safe_area_check',
      status: productRule.guide.showSafeZone ? 'warning' : 'info',
      severity: productRule.guide.showSafeZone ? 'medium' : 'low',
      title: 'Zona segura',
      description: `Margen recomendado: ${productRule.guide.safeMarginMm} mm desde el corte.`,
      recommendation: 'Mantén textos y logos dentro de la zona segura.',
      productApplicability: [productRule.key],
      productionImpact: 'Elementos cerca del corte pueden quedar comprometidos.',
      blocking: false,
    },
    {
      id: 'cutline_check',
      status: productRule.guide.showCutline ? (isVectorLike ? 'warning' : 'fail') : 'info',
      severity: productRule.guide.showCutline ? (isVectorLike ? 'medium' : 'high') : 'low',
      title: 'Linea de corte',
      description: productRule.guide.showCutline
        ? 'El producto pide una referencia clara de corte o contorno.'
        : 'La linea de corte no es requisito principal en este producto.',
      recommendation: productRule.guide.showCutline
        ? 'Usa una cutline vectorial o descarga la plantilla recomendada.'
        : 'No hace falta cutline especifica para este flujo.',
      productApplicability: [productRule.key],
      productionImpact: 'Sin cutline clara, el acabado puede requerir revision manual.',
      blocking: productRule.key === 'stickers',
    },
    {
      id: 'vector_check',
      status: isVectorLike ? 'pass' : 'warning',
      severity: isVectorLike ? 'low' : 'medium',
      title: 'Vector / trazados',
      description: isVectorLike ? 'El formato sugiere estructura vectorial o preparada.' : 'El archivo parece rasterizado o no vectorial.',
      recommendation: 'Si el diseño lleva texto o corte, un formato vectorial facilita preprensa.',
      productApplicability: [productRule.key],
      productionImpact: 'Los vectores ayudan a preservar bordes, tipografia y corte.',
      blocking: false,
    },
    {
      id: 'color_mode_check',
      status: ruleset.thresholds.preferredColorMode === 'CMYK' ? 'warning' : 'info',
      severity: 'low',
      title: 'Modo de color',
      description: `Check informativo mock. Recomendado para este producto: ${ruleset.thresholds.preferredColorMode}.`,
      recommendation: 'Si puedes, exporta una version final preparada para impresion o pide comprobacion manual.',
      productApplicability: [productRule.key],
      productionImpact: 'El modo de color puede alterar el resultado frente a pantalla.',
      blocking: false,
    },
    {
      id: 'transparency_check',
      status: transparentFormats.includes(metadata.formatLabel) ? 'pass' : 'info',
      severity: 'low',
      title: 'Transparencia',
      description: transparentFormats.includes(metadata.formatLabel)
        ? 'El formato admite transparencia util para fondos complejos.'
        : 'No podemos garantizar transparencia limpia en este formato.',
      recommendation: 'Si el producto lo requiere, usa PNG, WEBP o SVG con fondo transparente.',
      productApplicability: [productRule.key],
      productionImpact: 'Afecta montajes sobre prendas, vinilo o fondos complejos.',
      blocking: false,
    },
    {
      id: 'font_outline_check',
      status: isVectorLike ? 'warning' : 'info',
      severity: 'medium',
      title: 'Textos y contornos',
      description: isVectorLike ? 'Conviene revisar que las fuentes estén trazadas.' : 'No podemos revisar el trazado de fuentes en este mock.',
      recommendation: 'Traza tipografias antes de enviar arte final si trabajas en vector.',
      productApplicability: [productRule.key],
      productionImpact: 'Fuentes sin trazar pueden cambiar al abrir el archivo.',
      blocking: false,
    },
    {
      id: 'layer_structure_check',
      status: isVectorLike ? 'warning' : 'info',
      severity: 'low',
      title: 'Estructura de capas',
      description: 'Check mock para separar arte, guias y posibles capas de corte.',
      recommendation: 'Mantén capas limpias y nombra los elementos técnicos si el producto lo requiere.',
      productApplicability: [productRule.key],
      productionImpact: 'Una estructura limpia acelera revisión y producción.',
      blocking: false,
    },
    {
      id: 'scale_check',
      status: canPreview ? 'pass' : 'warning',
      severity: canPreview ? 'low' : 'medium',
      title: 'Escala física estimada',
      description: `Referencia base: ${productRule.recommendedPhysicalSizeLabel}.`,
      recommendation: 'Confirma el tamaño final antes de aprobar producción.',
      productApplicability: [productRule.key],
      productionImpact: 'Una escala mal interpretada afecta lectura y ajuste final.',
      blocking: false,
    },
    {
      id: 'orientation_check',
      status: orientationMismatch ? 'warning' : 'pass',
      severity: orientationMismatch ? 'medium' : 'low',
      title: 'Orientacion',
      description: `Detectada ${metadata.orientation}; recomendada ${productRule.guide.preferredOrientation}.`,
      recommendation: 'Gira o reencuadra el diseño si la orientación no coincide con el formato final.',
      productApplicability: [productRule.key],
      productionImpact: 'Puede alterar montaje, imposición o aprovechamiento.',
      blocking: false,
    },
    {
      id: 'dtf_spacing_check',
      status: productRule.key === 'dtf_meter' ? 'warning' : 'info',
      severity: productRule.key === 'dtf_meter' ? 'medium' : 'low',
      title: 'Separacion entre diseños',
      description: productRule.key === 'dtf_meter' ? 'En DTF conviene separar artes sobre el rollo.' : 'No aplica a este producto.',
      recommendation: productRule.key === 'dtf_meter' ? 'Deja hueco suficiente entre diseños para corte y aprovechamiento.' : 'Sin accion requerida.',
      productApplicability: ['dtf_meter'],
      productionImpact: 'Reduce errores de corte y montaje en el rollo.',
      blocking: false,
    },
    {
      id: 'sticker_contour_check',
      status: productRule.key === 'stickers' ? (isVectorLike ? 'warning' : 'fail') : 'info',
      severity: productRule.key === 'stickers' ? 'high' : 'low',
      title: 'Contorno de pegatina',
      description: productRule.key === 'stickers' ? 'Las pegatinas funcionan mejor con contorno/cutline vectorial.' : 'No aplica a este producto.',
      recommendation: productRule.key === 'stickers' ? 'Aporta una cutline clara o descarga la plantilla recomendada.' : 'Sin accion requerida.',
      productApplicability: ['stickers'],
      productionImpact: 'Sin contorno claro, la revisión pasa a manual.',
      blocking: productRule.key === 'stickers',
    },
    {
      id: 'card_trim_check',
      status: productRule.key === 'business_cards' || productRule.key === 'paper' ? 'warning' : 'info',
      severity: productRule.key === 'business_cards' || productRule.key === 'paper' ? 'medium' : 'low',
      title: 'Corte y trim',
      description:
        productRule.key === 'business_cards' || productRule.key === 'paper'
          ? 'Revisamos corte rectangular, margen interior y sangrado del formato.'
          : 'No aplica a este producto.',
      recommendation:
        productRule.key === 'business_cards' || productRule.key === 'paper'
          ? 'Usa la plantilla de corte recomendada para evitar elementos al borde.'
          : 'Sin accion requerida.',
      productApplicability: ['business_cards', 'paper'],
      productionImpact: 'Mejora precisión del corte final y la consistencia entre copias.',
      blocking: false,
    },
    {
      id: 'vinyl_panel_check',
      status: productRule.key === 'printed_vinyl' ? 'warning' : 'info',
      severity: productRule.key === 'printed_vinyl' ? 'medium' : 'low',
      title: 'Panelado y área visible',
      description: productRule.key === 'printed_vinyl' ? 'En vinilo impreso conviene revisar panelado, zonas visibles y remates.' : 'No aplica a este producto.',
      recommendation: productRule.key === 'printed_vinyl' ? 'Comprueba panelado y puntos de unión antes de validar producción.' : 'Sin accion requerida.',
      productApplicability: ['printed_vinyl'],
      productionImpact: 'Reduce incidencias de montaje y empalme.',
      blocking: false,
    },
  ]

  return checks.filter((check) => ruleset.requiredChecks.includes(check.id) || ruleset.optionalChecks.includes(check.id))
}
