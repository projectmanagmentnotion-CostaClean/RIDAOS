import type { ArtworkProductRuleKey } from '../../../domain/storage'
import { artworkProductRules } from '../../artwork-upload/product-rules/artworkProductRules'
import type { ProductPrepressRuleset } from '../types/prepress'

function baseChecks() {
  return [
    'file_format_check',
    'file_size_check',
    'dpi_check',
    'bleed_check',
    'safe_area_check',
    'color_mode_check',
    'scale_check',
    'orientation_check',
  ] as const
}

const ruleBuilder = (key: ArtworkProductRuleKey, overrides: Partial<ProductPrepressRuleset>): ProductPrepressRuleset => {
  const rule = artworkProductRules[key]
  return {
    key,
    label: rule.label,
    requiredChecks: [...baseChecks()],
    optionalChecks: ['transparency_check', 'vector_check', 'font_outline_check', 'layer_structure_check'],
    blockingChecks: ['file_format_check', 'file_size_check'],
    thresholds: {
      recommendedMinDpi: rule.recommendedMinResolutionDpi,
      warningMinDpi: Math.round(rule.recommendedMinResolutionDpi * 0.7),
      preferredColorMode: key === 'dtf_meter' || key === 'textile' ? 'RGB' : 'CMYK',
      maxFileSizeMb: rule.maxFileSizeMb,
      safeAreaToleranceMm: rule.guide.safeMarginMm,
      bleedRequiredMm: rule.guide.bleedMm,
    },
    customerFriendlyCopy: rule.helperCopy,
    templateRecommendation: `Plantilla recomendada para ${rule.label.toLowerCase()}.`,
    ...overrides,
  }
}

export const productPrepressRulesets: Record<ArtworkProductRuleKey, ProductPrepressRuleset> = {
  business_cards: ruleBuilder('business_cards', {
    requiredChecks: [...baseChecks(), 'card_trim_check', 'vector_check', 'font_outline_check'],
    blockingChecks: ['file_format_check', 'file_size_check', 'card_trim_check'],
    customerFriendlyCopy: 'Antes de imprimir revisamos corte, sangrado y textos cerca del borde para evitar sorpresas.',
  }),
  stickers: ruleBuilder('stickers', {
    requiredChecks: [...baseChecks(), 'cutline_check', 'sticker_contour_check', 'transparency_check'],
    blockingChecks: ['file_format_check', 'file_size_check', 'cutline_check'],
    customerFriendlyCopy: 'Para pegatinas revisamos linea de corte, contorno y margen de seguridad antes de validar.',
  }),
  dtf_meter: ruleBuilder('dtf_meter', {
    requiredChecks: ['file_format_check', 'file_size_check', 'dpi_check', 'safe_area_check', 'scale_check', 'orientation_check', 'dtf_spacing_check'],
    optionalChecks: ['color_mode_check', 'transparency_check'],
    blockingChecks: ['file_format_check', 'file_size_check', 'dpi_check'],
    customerFriendlyCopy: 'Para DTF analizamos ancho util, resolucion y separacion entre disenos sobre el rollo.',
  }),
  printed_vinyl: ruleBuilder('printed_vinyl', {
    requiredChecks: [...baseChecks(), 'cutline_check', 'vinyl_panel_check', 'layer_structure_check'],
    blockingChecks: ['file_format_check', 'file_size_check', 'vinyl_panel_check'],
    customerFriendlyCopy: 'En vinilo impreso comprobamos escala, panelado visible y margen de montaje.',
  }),
  signage: ruleBuilder('signage', {
    requiredChecks: [...baseChecks(), 'scale_check', 'vector_check'],
    optionalChecks: ['layer_structure_check', 'transparency_check'],
    customerFriendlyCopy: 'Para carteleria medimos legibilidad, resolucion efectiva y margen seguro segun formato.',
  }),
  textile: ruleBuilder('textile', {
    requiredChecks: ['file_format_check', 'file_size_check', 'dpi_check', 'safe_area_check', 'vector_check', 'transparency_check', 'orientation_check'],
    blockingChecks: ['file_format_check', 'file_size_check'],
    customerFriendlyCopy: 'En textil nos centramos en legibilidad, transparencia y calidad final del marcaje.',
  }),
  paper: ruleBuilder('paper', {
    requiredChecks: [...baseChecks(), 'card_trim_check', 'font_outline_check'],
    blockingChecks: ['file_format_check', 'file_size_check'],
    customerFriendlyCopy: 'En papeleria revisamos sangrado, corte y textos para que el acabado quede limpio.',
  }),
}
