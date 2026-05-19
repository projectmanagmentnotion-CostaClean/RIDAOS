export type CinematicZoneId =
  | 'HOME_HERO'
  | 'HOME_METRICS'
  | 'HOME_FOUNDATION'
  | 'HOME_PROCESS'
  | 'HOME_EDITORIAL'
  | 'HOME_PREPARATION'
  | 'HOME_TRUST'
  | 'HOME_FAQ'
  | 'HOME_FINAL_CTA'

export type CinematicSceneId =
  | 'HERO_CINEMATIC'
  | 'TEXTILE_DTF_TRANSITION'
  | 'VEHICLE_WRAP_TRANSITION'
  | 'PRODUCTION_DETAIL_TRANSITION'
  | 'FINAL_BRAND_REVEAL'

export type CinematicAssetKey =
  | 'textileHoodieTransparent'
  | 'dtfRollTransparent'
  | 'vehicleWrapCarTransparent'
  | 'printMachineDetail'
  | 'finalBrandObject'

export type CinematicAssetDefinition = {
  key: CinematicAssetKey
  label: string
  expectedPath: string
  available: boolean
  recommendedFormat: 'webp' | 'png'
  transparentBackground: boolean
  orientation: 'portrait' | 'landscape' | 'square'
  recommendedSize: string
  notes: string
  priority: 'high' | 'medium' | 'low'
}

export type CinematicSceneDefinition = {
  id: CinematicSceneId
  label: string
  description: string
  triggerZoneId: CinematicZoneId
  assetKey: CinematicAssetKey
  className: string
  accent: string
  depth: number
}
