import type { PrepressCheckDefinition, PrepressReadinessState } from '../../../domain/storage'
import type { PrepressScoreBreakdown } from '../types/prepress'

const severityWeight = {
  low: 4,
  medium: 8,
  high: 14,
  critical: 22,
} as const

const statusPenalty = {
  pass: 0,
  info: 2,
  warning: 6,
  fail: 16,
} as const

export function scorePrepressChecks(checks: PrepressCheckDefinition[]): PrepressScoreBreakdown {
  const totalPenalty = checks.reduce((sum, check) => sum + statusPenalty[check.status] + severityWeight[check.severity] * (check.status === 'pass' ? 0 : 0.5), 0)
  const hasBlockingFailure = checks.some((check) => check.blocking && check.status === 'fail')
  const hasFailure = checks.some((check) => check.status === 'fail')
  const hasWarning = checks.some((check) => check.status === 'warning')
  const topSeverity = checks.reduce<PrepressScoreBreakdown['topSeverity']>(
    (current, check) => {
      const order = { low: 1, medium: 2, high: 3, critical: 4 } as const
      return order[check.severity] > order[current] ? check.severity : current
    },
    'low',
  )

  const score = Math.max(0, Math.min(100, Math.round(100 - totalPenalty)))
  let state: PrepressReadinessState = 'print_ready'

  if (hasBlockingFailure) {
    state = 'blocked'
  } else if (hasFailure || score < 60) {
    state = 'needs_review'
  } else if (hasWarning || score < 85) {
    state = 'minor_warnings'
  }

  const productionImpactSummary =
    state === 'blocked'
      ? 'Hay fallos críticos que conviene corregir antes de producir.'
      : state === 'needs_review'
        ? 'El archivo puede fabricarse solo tras revisión técnica manual.'
        : state === 'minor_warnings'
          ? 'El archivo está bastante bien, pero tiene avisos que conviene revisar.'
          : 'El archivo se ve sólido para entrar en comprobación final.'

  return {
    score,
    state,
    topSeverity,
    productionImpactSummary,
  }
}
