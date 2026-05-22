import type { PrepressCheckDefinition } from '../../../domain/storage'

export const prepressCheckCatalogOrder: PrepressCheckDefinition['id'][] = [
  'file_format_check',
  'file_size_check',
  'dpi_check',
  'bleed_check',
  'safe_area_check',
  'cutline_check',
  'vector_check',
  'color_mode_check',
  'transparency_check',
  'font_outline_check',
  'layer_structure_check',
  'scale_check',
  'orientation_check',
  'dtf_spacing_check',
  'sticker_contour_check',
  'card_trim_check',
  'vinyl_panel_check',
]
