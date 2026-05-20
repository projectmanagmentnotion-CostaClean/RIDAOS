import type { CmsSnapshot } from '../types/cms'

export function isCmsSnapshot(value: unknown): value is CmsSnapshot {
  if (!value || typeof value !== 'object') {
    return false
  }

  const snapshot = value as Partial<CmsSnapshot>

  return (
    snapshot.version === 1 &&
    typeof snapshot.exportedAt === 'string' &&
    Array.isArray(snapshot.records) &&
    snapshot.records.every(
      (record) =>
        record &&
        typeof record === 'object' &&
        typeof record.sourcePath === 'string' &&
        typeof record.updatedAt === 'string',
    )
  )
}
