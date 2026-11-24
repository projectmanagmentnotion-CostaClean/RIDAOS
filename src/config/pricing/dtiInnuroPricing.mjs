export const DTI_INNURO_PRICE_PER_METER = 15
export const DTI_INNURO_MINIMUM_METERS = 1
export const DTI_INNURO_VAT_RATE = 0.21
export const DTI_INNURO_SHIPPING_PRICE = 5
export const DTI_INNURO_ADAPTATION_HOURLY_RATE = 35
export const DTI_INNURO_CUTOFF_HOUR = 18
export const DTI_INNURO_CUTOFF_MINUTE = 30
export const DTI_INNURO_TIME_ZONE = 'Europe/Madrid'

const roundCurrency = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100

export function calculateDtiInnuroPrice(meters) {
  const safeMeters = Number.isFinite(meters) ? meters : 0
  const valid = safeMeters >= DTI_INNURO_MINIMUM_METERS
  const total = valid ? roundCurrency(safeMeters * DTI_INNURO_PRICE_PER_METER) : 0
  const net = roundCurrency(total / (1 + DTI_INNURO_VAT_RATE))

  return {
    meters: safeMeters,
    valid,
    unitPrice: DTI_INNURO_PRICE_PER_METER,
    net,
    vatIncluded: roundCurrency(total - net),
    total,
  }
}

export function calculateDtiAdaptationRate(hours) {
  const safeHours = Number.isFinite(hours) && hours > 0 ? hours : 0
  const net = roundCurrency(safeHours * DTI_INNURO_ADAPTATION_HOURLY_RATE)
  const vat = roundCurrency(net * DTI_INNURO_VAT_RATE)

  return { hours: safeHours, net, vat, total: roundCurrency(net + vat) }
}

export function getDtiPreparationPlan(meters) {
  if (!Number.isFinite(meters) || meters < DTI_INNURO_MINIMUM_METERS) {
    return { workingDays: null, label: 'Pedido mínimo: 1 m' }
  }

  if (meters <= 5) return { workingDays: 2, label: '48 horas laborables' }
  if (meters <= 10) return { workingDays: 3, label: '3 días laborables' }
  return { workingDays: null, label: 'Plazo bajo consulta' }
}

export function getDtiCutoffStatus(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: DTI_INNURO_TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const value = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]))
  const hour = Number(value.hour)
  const minute = Number(value.minute)
  const isWeekend = value.weekday === 'Sat' || value.weekday === 'Sun'
  const afterCutoff = hour > DTI_INNURO_CUTOFF_HOUR || (hour === DTI_INNURO_CUTOFF_HOUR && minute >= DTI_INNURO_CUTOFF_MINUTE)

  return { hour, minute, isWeekend, afterCutoff, startsNextWorkingDay: isWeekend || afterCutoff }
}
