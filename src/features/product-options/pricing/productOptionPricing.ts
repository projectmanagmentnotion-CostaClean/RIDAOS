import type { ConfigState } from '../../../lib/configuratorState'
import type { CatalogEntry } from '../../../types/product'
import type { CatalogPricingResult } from '../../../catalog/adapters/catalogPricingAdapter'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value)

const round = (value: number) => Math.round(value * 100) / 100

function quantityDiscount(quantity: number, rules: Array<{ min: number; discount: number }>) {
  return rules.reduce((selected, rule) => (quantity >= rule.min ? rule.discount : selected), 0)
}

function createResult(input: Omit<CatalogPricingResult, 'currency'>): CatalogPricingResult {
  return {
    currency: 'EUR',
    ...input,
  }
}

function formatRange(min: number, max: number) {
  return `${formatCurrency(min)} - ${formatCurrency(max)}`
}

function getQuantity(value: string | undefined) {
  return Number(value ?? '0')
}

function getArea(value: string | undefined) {
  return Number(value ?? '0')
}

function getMeters(value: string | undefined) {
  return Number(value ?? '0')
}

function buildFieldSummary(label: string, value: string) {
  return `${label}: ${value}`
}

function calculateStickerPricing(_entry: CatalogEntry, config: ConfigState): CatalogPricingResult {
  const quantity = getQuantity(config.quantity)
  if (!Number.isFinite(quantity) || quantity < 50) {
    return createResult({
      subtotal: 0,
      total: 0,
      pricingLabel: 'A consultar',
      breakdown: [],
      warnings: ['La cantidad minima visible para pegatinas es 50 uds.'],
      canAddToCart: false,
      validationMessage: 'Define una cantidad valida.',
    })
  }

  const quantityBase =
    quantity >= 1000 ? 0.46 :
    quantity >= 500 ? 0.54 :
    quantity >= 250 ? 0.67 :
    quantity >= 100 ? 0.82 :
    0.96

  const sizeFactorMap: Record<string, number> = {
    '5x5': 1,
    '10x10': 1.18,
    '15x15': 1.42,
    '20x20': 1.74,
    '30x50': 2.38,
    custom: 1.95,
  }

  const materialExtras: Record<string, number> = {
    white: 0,
    transparent: 18,
    'outdoor-vinyl': 24,
    'adhesive-paper': -8,
    repositionable: 14,
  }

  const finishExtras: Record<string, number> = {
    matte: 0,
    gloss: 8,
    'premium-clear': 18,
    'outdoor-protect': 20,
  }

  const shapeExtras: Record<string, number> = {
    square: 0,
    rectangular: 0,
    circle: 8,
    oval: 10,
    custom: 22,
    'full-cut': 12,
    'kiss-cut': 14,
  }

  const base = round(quantity * quantityBase * (sizeFactorMap[config.sizePreset || '10x10'] ?? 1))
  const extras =
    (materialExtras[config.material || 'white'] ?? 0) +
    (finishExtras[config.finish || 'matte'] ?? 0) +
    (shapeExtras[config.shape || 'square'] ?? 0)
  const discount = quantityDiscount(quantity, [
    { min: 500, discount: 0.06 },
    { min: 1000, discount: 0.12 },
  ])
  const subtotal = round(base + extras)
  const total = round(subtotal * (1 - discount))

  return createResult({
    subtotal,
    total,
    unitPrice: round(total / quantity),
    unitLabel: 'ud',
    pricingLabel: formatCurrency(total),
    breakdown: [
      buildFieldSummary('Cantidad', `${quantity} uds`),
      buildFieldSummary('Troquel', config.shape || 'square'),
      buildFieldSummary('Material', config.material || 'white'),
      buildFieldSummary('Acabado', config.finish || 'matte'),
      discount > 0 ? `Descuento volumen: -${Math.round(discount * 100)}%` : 'Sin descuento por volumen',
    ],
    warnings: config.shape === 'custom' ? ['La forma personalizada debe entrar con contorno claro en el archivo.'] : [],
    canAddToCart: true,
  })
}

function calculateBusinessCardPricing(config: ConfigState): CatalogPricingResult {
  const quantity = getQuantity(config.quantity)
  if (!Number.isFinite(quantity) || quantity < 100) {
    return createResult({
      subtotal: 0,
      total: 0,
      pricingLabel: 'A consultar',
      breakdown: [],
      warnings: ['La cantidad minima visible para tarjetas es 100 uds.'],
      canAddToCart: false,
      validationMessage: 'Define una cantidad valida.',
    })
  }

  const baseByQuantity =
    quantity >= 5000 ? 88 :
    quantity >= 2500 ? 76 :
    quantity >= 1000 ? 62 :
    quantity >= 500 ? 48 :
    quantity >= 250 ? 39 :
    32

  const formatExtras: Record<string, number> = {
    standard: 0,
    european: 4,
    compact: 2,
    square: 14,
    rounded: 11,
  }
  const paperStockExtras: Record<string, number> = {
    'coated-350': 0,
    'premium-400': 14,
    'recycled-300': 10,
    'textured-special': 22,
  }
  const laminationExtras: Record<string, number> = {
    none: 0,
    matte: 8,
    gloss: 8,
    'soft-touch': 18,
  }
  const specialFinishExtras: Record<string, number> = {
    none: 0,
    'varnish-3d': 24,
    'foil-gold': 28,
    'foil-silver': 28,
  }
  const reviewExtras: Record<string, number> = { basic: 0, advanced: 12, assisted: 24 }
  const formatLabels: Record<string, string> = {
    standard: 'Estandar 85 x 55 mm',
    european: 'Europeo 90 x 50 mm',
    compact: 'Compacto 85 x 50 mm',
    square: 'Cuadrada 55 x 55 mm',
    rounded: 'Esquinas redondeadas',
  }
  const paperStockLabels: Record<string, string> = {
    'coated-350': 'Estucado 350 g',
    'premium-400': 'Premium 400 g',
    'recycled-300': 'Reciclado 300 g',
    'textured-special': 'Texturizado especial',
  }
  const laminationLabels: Record<string, string> = {
    none: 'Sin laminado',
    matte: 'Laminado mate',
    gloss: 'Laminado brillo',
    'soft-touch': 'Soft touch',
  }
  const specialFinishLabels: Record<string, string> = {
    none: 'Ninguno',
    'foil-gold': 'Foil oro',
    'foil-silver': 'Foil plata',
    'varnish-3d': 'Barniz 3D',
  }
  const reviewLabels: Record<string, string> = {
    basic: 'Revision basica incluida',
    advanced: 'Revision avanzada',
    assisted: 'Ayuda con archivo',
  }
  const sideFactor = config.printSides === 'double' ? 1.22 : config.printSides === 'back-only' ? 1.08 : 1
  const base = round(
    (baseByQuantity +
      (formatExtras[config.format || 'standard'] ?? 0) +
      (paperStockExtras[config.paperStock || 'coated-350'] ?? 0) +
      (laminationExtras[config.lamination || 'none'] ?? 0) +
      (specialFinishExtras[config.specialFinish || 'none'] ?? 0) +
      (reviewExtras[config.fileReview || 'basic'] ?? 0)) *
      sideFactor,
  )
  const total = base

  return createResult({
    subtotal: total,
    total,
    unitPrice: round(total / quantity),
    unitLabel: 'ud',
    pricingLabel: formatCurrency(total),
    breakdown: [
      buildFieldSummary('Cantidad', `${quantity} uds`),
      buildFieldSummary('Formato', formatLabels[config.format || 'standard'] ?? 'Estandar 85 x 55 mm'),
      buildFieldSummary('Papel', paperStockLabels[config.paperStock || 'coated-350'] ?? 'Estucado 350 g'),
      buildFieldSummary('Laminado', laminationLabels[config.lamination || 'none'] ?? 'Sin laminado'),
      buildFieldSummary('Acabado exclusivo', specialFinishLabels[config.specialFinish || 'none'] ?? 'Ninguno'),
      buildFieldSummary('Impresion', config.printSides === 'double' ? 'Anverso y reverso' : config.printSides === 'back-only' ? 'Solo reverso' : 'Solo anverso'),
      buildFieldSummary('Revision', reviewLabels[config.fileReview || 'basic'] ?? 'Revision basica incluida'),
    ],
    warnings:
      config.specialFinish === 'varnish-3d'
        ? ['El barniz 3D requiere una capa de acabado bien separada en el archivo.']
        : config.specialFinish?.startsWith('foil')
          ? ['Los acabados oro/plata se confirman tras revisar la reserva del acabado.']
          : config.fileReview === 'assisted'
            ? ['La ayuda con archivo cubre ajuste comercial y lectura preprensa antes de validar la tirada.']
          : [],
    canAddToCart: true,
  })
}

function calculateFlyerPricing(entry: CatalogEntry, config: ConfigState): CatalogPricingResult {
  const quantity = getQuantity(config.quantity)
  if (!Number.isFinite(quantity) || quantity < 100) {
    return createResult({
      subtotal: 0,
      total: 0,
      pricingLabel: 'A consultar',
      breakdown: [],
      warnings: ['La cantidad minima visible para flyers es 100 uds.'],
      canAddToCart: false,
      validationMessage: 'Define una cantidad valida.',
    })
  }

  const formatFactor: Record<string, number> = {
    a5: 1.34,
    a4: 1.92,
    a3: 2.65,
    a6: 1,
    dl: 1.16,
  }
  const paperStockFactor: Record<string, number> = {
    '135-gloss': 1,
    '170-matte': 1.12,
    '250-matte': 1.34,
    '300-matte': 1.52,
    '170-recycled': 1.18,
  }
  const finishExtras: Record<string, number> = { none: 0, matte: 10, gloss: 10, 'soft-touch': 18 }
  const reviewExtras: Record<string, number> = { basic: 0, advanced: 12, assisted: 24 }
  const formatLabels: Record<string, string> = {
    a3: 'A3',
    a4: 'A4',
    a5: 'A5',
    a6: 'A6',
    dl: 'DL 99 x 210 mm',
  }
  const paperStockLabels: Record<string, string> = {
    '135-gloss': '135 g estucado',
    '170-matte': '170 g estucado',
    '250-matte': '250 g premium',
    '300-matte': '300 g rigido',
    '170-recycled': 'Reciclado 170 g',
  }
  const finishLabels: Record<string, string> = {
    none: 'Sin acabado',
    matte: 'Mate',
    gloss: 'Brillo',
    'soft-touch': 'Soft touch',
  }
  const reviewLabels: Record<string, string> = {
    basic: 'Revision basica incluida',
    advanced: 'Revision avanzada',
    assisted: 'Ayuda con archivo',
  }
  const doubleSideFactor = config.printSides === 'double' ? 1.18 : 1
  const volumeDiscount = quantityDiscount(quantity, [
    { min: 1000, discount: 0.08 },
    { min: 2500, discount: 0.13 },
    { min: 5000, discount: 0.18 },
  ])
  const baseUnit = entry.id === 'flyer-a5' ? 0.18 : 0.14
  const subtotal = round(
    quantity *
      baseUnit *
      (formatFactor[config.format || 'a5'] ?? 1) *
      (paperStockFactor[config.paperStock || '135-gloss'] ?? 1) *
      doubleSideFactor +
      (finishExtras[config.finish || 'none'] ?? 0) +
      (reviewExtras[config.fileReview || 'basic'] ?? 0),
  )
  const total = round(subtotal * (1 - volumeDiscount))

  return createResult({
    subtotal,
    total,
    unitPrice: round(total / quantity),
    unitLabel: 'ud',
    pricingLabel: formatCurrency(total),
    breakdown: [
      buildFieldSummary('Formato', formatLabels[config.format || 'a5'] ?? 'A5'),
      buildFieldSummary('Orientacion', config.orientation || 'vertical'),
      buildFieldSummary('Caras', config.printSides === 'double' ? 'Dos caras' : 'Una cara'),
      buildFieldSummary('Papel', paperStockLabels[config.paperStock || '135-gloss'] ?? '135 g estucado'),
      buildFieldSummary('Acabado', finishLabels[config.finish || 'none'] ?? 'Sin acabado'),
      buildFieldSummary('Revision', reviewLabels[config.fileReview || 'basic'] ?? 'Revision basica incluida'),
      volumeDiscount > 0 ? `Descuento volumen: -${Math.round(volumeDiscount * 100)}%` : 'Sin descuento por volumen',
    ],
    warnings:
      config.fileReview === 'assisted'
        ? ['La ayuda con archivo suma revision comercial y preparacion antes de validar la impresion.']
        : [],
    canAddToCart: entry.purchaseMode !== 'quote',
    quoteRequired: entry.purchaseMode === 'quote',
    rangeLabel: entry.purchaseMode === 'quote' ? formatRange(round(total * 0.92), round(total * 1.18)) : undefined,
  })
}

function calculateDtiPricing(config: ConfigState): CatalogPricingResult {
  const meters = getMeters(config.meters)
  if (!Number.isFinite(meters) || meters <= 0) {
    return createResult({
      subtotal: 0,
      total: 0,
      pricingLabel: 'A consultar',
      breakdown: [],
      warnings: ['Introduce el metraje real del pedido.'],
      canAddToCart: false,
      validationMessage: 'Completa el metraje.',
    })
  }

  const basePerMeter = config.quality === 'premium' ? 17.2 : 14.5
  const widthExtra = config.usableWidth === '60' ? 0.9 : 0
  const urgencyExtras: Record<string, number> = { '72h': 0, '48h': 8, '24h': 18 }
  const reviewExtra = config.professionalReview === 'review' ? 12 : 0
  const artworkHelpExtra = config.artworkMode === 'need-help' ? 8 : 0
  const volumeDiscount = quantityDiscount(meters, [
    { min: 10, discount: 0.05 },
    { min: 25, discount: 0.1 },
  ])
  const rawSubtotal = round(meters * (basePerMeter + widthExtra))
  const subtotal = round(rawSubtotal + urgencyExtras[config.urgency || '72h'] + reviewExtra + artworkHelpExtra)
  const total = round(subtotal * (1 - volumeDiscount))

  return createResult({
    subtotal,
    total,
    unitPrice: round(total / meters),
    unitLabel: 'metro',
    pricingLabel: `${formatCurrency(total)} total`,
    breakdown: [
      buildFieldSummary('Metros', `${meters} m`),
      buildFieldSummary('Ancho util', `${config.usableWidth || '58'} cm`),
      buildFieldSummary('Calidad', config.quality === 'premium' ? 'Premium' : 'Estandar'),
      buildFieldSummary('Urgencia', config.urgency || '72h'),
      buildFieldSummary('Archivo', config.artworkMode === 'need-help' ? 'Necesito ayuda' : 'Listo'),
      volumeDiscount > 0 ? `Descuento por volumen: -${Math.round(volumeDiscount * 100)}%` : 'Sin descuento por volumen',
    ],
    warnings:
      config.spacing === 'tight'
        ? ['La separacion ajustada entre disenos puede requerir una revision mas fina en preprensa.']
        : [],
    canAddToCart: true,
  })
}

function calculateVehicleWrapPricing(entry: CatalogEntry, config: ConfigState): CatalogPricingResult {
  const vehicleBaseMap: Record<string, number> = {
    'van-small': 320,
    'van-medium': 520,
    'van-large': 860,
    car: 420,
    company: 680,
    fleet: 1200,
  }
  const wrapTypeExtra: Record<string, number> = {
    partial: 0,
    half: 220,
    'integral-lite': 540,
    integral: 1200,
    'cut-vinyl': -60,
    'printed-vinyl': 180,
    'design-install': 260,
    fleet: 1600,
  }
  const designExtra = config.designService === 'studio-support' ? 220 : 0
  const installExtra = config.installation === 'material-only' ? -140 : 180
  const vinylExtra = config.vinylTier === 'premium' ? 180 : config.vinylTier === 'cast' ? 420 : 0
  const base = vehicleBaseMap[config.vehicleType || 'van-medium'] ?? 520
  const wrapExtra = wrapTypeExtra[config.wrapType || 'partial'] ?? 0
  const fleetUnits = Math.max(1, getQuantity(config.fleetUnits) || 1)
  const subtotal = round((base + wrapExtra + designExtra + installExtra + vinylExtra) * fleetUnits)
  const quoteRequired =
    (config.wrapType || '').includes('integral') ||
    config.vehicleType === 'fleet' ||
    fleetUnits > 1 ||
    entry.id === 'rotulacion-full-wrap'
  const min = quoteRequired ? round(subtotal * 0.92) : round(subtotal * 0.95)
  const max = quoteRequired ? round(subtotal * 1.18) : round(subtotal * 1.08)

  return createResult({
    subtotal,
    total: max,
    pricingLabel: quoteRequired ? formatRange(min, max) : `${formatCurrency(max)} orientativo`,
    rangeLabel: formatRange(min, max),
    breakdown: [
      buildFieldSummary('Vehiculo', config.vehicleType || 'van-medium'),
      buildFieldSummary('Cobertura', config.wrapType || 'partial'),
      buildFieldSummary('Diseno', config.designService === 'studio-support' ? 'Estudio' : 'Aportado'),
      buildFieldSummary('Instalacion', config.installation === 'material-only' ? 'Solo material' : 'Con instalacion'),
      buildFieldSummary('Vinilo', config.vinylTier || 'standard'),
    ],
    warnings: ['La referencia final se confirma tras medir soporte, juntas, pliegues y calendario real de instalacion.'],
    canAddToCart: false,
    quoteRequired: true,
  })
}

function calculateTextilePricing(entry: CatalogEntry, config: ConfigState): CatalogPricingResult {
  const quantity = getQuantity(config.quantity)
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return createResult({
      subtotal: 0,
      total: 0,
      pricingLabel: 'A consultar',
      breakdown: [],
      warnings: ['Indica la cantidad de prendas.'],
      canAddToCart: false,
      validationMessage: 'Completa la cantidad.',
    })
  }

  const baseByEntry: Record<string, number> = {
    'camiseta-basica': 13,
    'camiseta-premium': 22,
    sudadera: 24,
    'gorra-camionero': 9,
    'polo-corto': 18,
  }
  const placementExtra: Record<string, number> = { front: 0, 'front-back': 3, 'chest-sleeve': 2 }
  const turnaroundExtra: Record<string, number> = { standard: 0, fast: 18 }
  const reviewExtra = config.artworkSupport === 'review' ? 10 : 0
  const volumeDiscount = quantityDiscount(quantity, [
    { min: 10, discount: 0.06 },
    { min: 25, discount: 0.12 },
  ])
  const baseUnit = baseByEntry[entry.id] ?? 16
  const subtotal = round(quantity * (baseUnit + (placementExtra[config.printPlacement || 'front'] ?? 0)) + (turnaroundExtra[config.turnaround || 'standard'] ?? 0) + reviewExtra)
  const total = round(subtotal * (1 - volumeDiscount))

  return createResult({
    subtotal,
    total,
    unitPrice: round(total / quantity),
    unitLabel: 'ud',
    pricingLabel: formatCurrency(total),
    breakdown: [
      buildFieldSummary('Prenda', entry.name),
      buildFieldSummary('Marcaje', config.printPlacement || 'front'),
      buildFieldSummary('Urgencia', config.turnaround || 'standard'),
      volumeDiscount > 0 ? `Descuento volumen: -${Math.round(volumeDiscount * 100)}%` : 'Sin descuento por volumen',
    ],
    warnings: config.artworkSupport === 'review' ? ['La revision del archivo se suma antes de fabricar.'] : [],
    canAddToCart: true,
  })
}

function calculatePrintedVinylPricing(entry: CatalogEntry, config: ConfigState): CatalogPricingResult {
  const area = getArea(config.area)
  if (!Number.isFinite(area) || area <= 0) {
    return createResult({
      subtotal: 0,
      total: 0,
      pricingLabel: 'A consultar',
      breakdown: [],
      warnings: ['Introduce la superficie aproximada en m2.'],
      canAddToCart: false,
      validationMessage: 'Completa la superficie.',
    })
  }

  const baseByEntry: Record<string, number> = {
    'vinilo-monomerico': 32,
    'vinilo-microperforado': 38,
    'vinilo-polimerico': 41,
    'vinilo-pared': 44,
  }
  const laminationExtra: Record<string, number> = { none: 0, matte: 4, gloss: 4 }
  const installationExtra: Record<string, number> = { 'material-only': 0, install: 18 }
  const urgencyExtra: Record<string, number> = { standard: 0, priority: 22 }
  const unitPrice = baseByEntry[entry.id] ?? 32
  const subtotal = round(area * (unitPrice + (laminationExtra[config.lamination || 'none'] ?? 0) + (installationExtra[config.installation || 'material-only'] ?? 0)) + (urgencyExtra[config.urgency || 'standard'] ?? 0))
  const quoteRequired = area > 12 || config.installation === 'install'

  return createResult({
    subtotal,
    total: subtotal,
    unitPrice,
    unitLabel: 'm2',
    pricingLabel: quoteRequired ? `${formatCurrency(subtotal)} desde` : formatCurrency(subtotal),
    breakdown: [
      buildFieldSummary('Superficie', `${area} m2`),
      buildFieldSummary('Laminado', config.lamination || 'none'),
      buildFieldSummary('Montaje', config.installation || 'material-only'),
    ],
    warnings: quoteRequired ? ['Las instalaciones y superficies amplias se cierran con propuesta personalizada.'] : [],
    canAddToCart: !quoteRequired,
    quoteRequired,
  })
}

export function getEnhancedProductPricing(entry: CatalogEntry, config: ConfigState): CatalogPricingResult | null {
  switch (entry.id) {
    case 'pegatina-sin-laminar':
    case 'pegatina-laminada':
      return calculateStickerPricing(entry, config)
    case 'tarjetas-estandar':
      return calculateBusinessCardPricing(config)
    case 'flyer-a6':
    case 'flyer-a5':
      return calculateFlyerPricing(entry, config)
    case 'dtf-metro':
      return calculateDtiPricing(config)
    case 'rotulacion-basica':
    case 'rotulacion-parcial':
    case 'rotulacion-semi':
    case 'rotulacion-full-wrap':
      return calculateVehicleWrapPricing(entry, config)
    case 'camiseta-basica':
    case 'camiseta-premium':
    case 'gorra-camionero':
    case 'polo-corto':
    case 'sudadera':
      return calculateTextilePricing(entry, config)
    case 'vinilo-monomerico':
    case 'vinilo-microperforado':
    case 'vinilo-polimerico':
    case 'vinilo-pared':
      return calculatePrintedVinylPricing(entry, config)
    default:
      return null
  }
}
