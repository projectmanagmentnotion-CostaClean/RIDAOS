export const DTI_INNURO_PRICE_PER_METER: 15
export const DTI_INNURO_MINIMUM_METERS: 1
export const DTI_INNURO_VAT_RATE: 0.21
export const DTI_INNURO_SHIPPING_PRICE: 5
export const DTI_INNURO_ADAPTATION_HOURLY_RATE: 35
export const DTI_INNURO_CUTOFF_HOUR: 18
export const DTI_INNURO_CUTOFF_MINUTE: 30
export const DTI_INNURO_TIME_ZONE: 'Europe/Madrid'

export function calculateDtiInnuroPrice(meters: number): {
  meters: number
  valid: boolean
  unitPrice: number
  net: number
  vatIncluded: number
  total: number
}

export function calculateDtiAdaptationRate(hours: number): {
  hours: number
  net: number
  vat: number
  total: number
}

export function getDtiPreparationPlan(meters: number): {
  workingDays: number | null
  label: string
}

export function getDtiCutoffStatus(date?: Date): {
  hour: number
  minute: number
  isWeekend: boolean
  afterCutoff: boolean
  startsNextWorkingDay: boolean
}
