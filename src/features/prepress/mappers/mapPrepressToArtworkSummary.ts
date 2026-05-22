import type { ArtworkValidationCheck, ArtworkValidationResult, PrepressCheckDefinition } from '../../../domain/storage'

function toLegacyStatus(status: PrepressCheckDefinition['status']): ArtworkValidationCheck['status'] {
  switch (status) {
    case 'fail':
      return 'blocked'
    case 'warning':
      return 'warning'
    case 'info':
      return 'warning'
    case 'pass':
    default:
      return 'ready'
  }
}

export function mapPrepressChecksToLegacyChecks(checks: PrepressCheckDefinition[]): ArtworkValidationCheck[] {
  return checks.map((check) => ({
    id: check.id,
    label: check.title,
    status: toLegacyStatus(check.status),
    message: check.description,
  }))
}

export function mapReadinessToWorkflowStatus(state: ArtworkValidationResult['readinessState']): ArtworkValidationResult['workflowStatus'] {
  switch (state) {
    case 'blocked':
      return 'blocked'
    case 'needs_review':
      return 'needs_review'
    case 'minor_warnings':
      return 'warning'
    case 'print_ready':
    default:
      return 'ready'
  }
}
