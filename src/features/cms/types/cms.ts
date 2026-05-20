import type { EditableZone, EditableZoneType } from '../../../config/siteMap'

export type CmsDocumentType = EditableZoneType

export type CmsDocumentDefinition = {
  id: string
  label: string
  description: string
  sourcePath: string
  type: CmsDocumentType
  zoneIds: string[]
  payload: unknown
}

export type CmsDocument = CmsDocumentDefinition & {
  updatedAt: string | null
  isModified: boolean
}

export type CmsSnapshotRecord = {
  sourcePath: string
  payload: unknown
  updatedAt: string
}

export type CmsSnapshot = {
  version: 1
  exportedAt: string
  records: CmsSnapshotRecord[]
}

export type CmsZoneStatus = 'default' | 'modified'

export type CmsZoneView = EditableZone & {
  status: CmsZoneStatus
  documentId?: string
}

export type CmsRepository = {
  getZones: () => Promise<CmsZoneView[]>
  getDocuments: () => Promise<CmsDocument[]>
  getDocumentBySourcePath: (sourcePath: string) => Promise<CmsDocument | null>
  saveDocument: (sourcePath: string, payload: unknown) => Promise<CmsDocument>
  resetDocument: (sourcePath: string) => Promise<CmsDocument>
  resetAll: () => Promise<void>
  exportSnapshot: () => Promise<CmsSnapshot>
  importSnapshot: (snapshot: CmsSnapshot) => Promise<void>
}
