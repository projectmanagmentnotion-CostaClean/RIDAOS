import { siteMap, siteMapById } from '../../../config/siteMap'
import { cmsDefaultDocuments } from '../data/cmsDefaultDocuments'
import type { ContentRepository } from './contentRepository'
import type { CmsDocument, CmsSnapshot, CmsZoneStatus, CmsZoneView } from '../types/cms'
import { cloneCmsPayload } from '../utils/cmsSerialization'
import { isCmsSnapshot } from '../utils/cmsValidation'

export const CMS_MOCK_STORAGE_KEY = 'ridaosprint-mock-cms:v1'
export const CMS_MOCK_STORAGE_EVENT = 'ridaosprint:cms-storage-updated'

type StoredOverride = {
  sourcePath: string
  payload: unknown
  updatedAt: string
}

type StoredState = {
  version: 1
  overrides: Record<string, StoredOverride>
}

const defaultDocumentsMap = Object.fromEntries(cmsDefaultDocuments.map((document) => [document.sourcePath, document]))

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

function readStoredState(): StoredState {
  const storage = getStorage()

  if (!storage) {
    return { version: 1, overrides: {} }
  }

  const raw = storage.getItem(CMS_MOCK_STORAGE_KEY)

  if (!raw) {
    return { version: 1, overrides: {} }
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredState>

    if (parsed.version !== 1 || typeof parsed.overrides !== 'object' || !parsed.overrides) {
      return { version: 1, overrides: {} }
    }

    return {
      version: 1,
      overrides: parsed.overrides as Record<string, StoredOverride>,
    }
  } catch {
    return { version: 1, overrides: {} }
  }
}

function writeStoredState(state: StoredState) {
  const storage = getStorage()

  if (!storage) {
    return
  }

  storage.setItem(CMS_MOCK_STORAGE_KEY, JSON.stringify(state))

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CMS_MOCK_STORAGE_EVENT))
  }
}

function buildResolvedDocuments(): CmsDocument[] {
  const storedState = readStoredState()

  return cmsDefaultDocuments.map((document) => {
    const override = storedState.overrides[document.sourcePath]

    return {
      ...document,
      payload: cloneCmsPayload(override?.payload ?? document.payload),
      updatedAt: override?.updatedAt ?? null,
      isModified: Boolean(override),
    }
  })
}

function getZoneStatus(zoneId: string, documents: CmsDocument[]): CmsZoneStatus {
  const relatedDocument = documents.find((document) => document.zoneIds.includes(zoneId))
  return relatedDocument?.isModified ? 'modified' : 'default'
}

export class MockContentRepository implements ContentRepository {
  async getZones(): Promise<CmsZoneView[]> {
    const documents = buildResolvedDocuments()

    return siteMap.map((zone) => {
      const document = documents.find((item) => item.zoneIds.includes(zone.id))

      return {
        ...zone,
        status: getZoneStatus(zone.id, documents),
        documentId: document?.id,
      }
    })
  }

  async getDocuments(): Promise<CmsDocument[]> {
    return buildResolvedDocuments()
  }

  async getDocumentBySourcePath(sourcePath: string): Promise<CmsDocument | null> {
    return buildResolvedDocuments().find((document) => document.sourcePath === sourcePath) ?? null
  }

  async saveDocument(sourcePath: string, payload: unknown): Promise<CmsDocument> {
    const document = defaultDocumentsMap[sourcePath]

    if (!document) {
      throw new Error(`Unknown CMS source path: ${sourcePath}`)
    }

    const storedState = readStoredState()
    storedState.overrides[sourcePath] = {
      sourcePath,
      payload: cloneCmsPayload(payload),
      updatedAt: new Date().toISOString(),
    }
    writeStoredState(storedState)

    return {
      ...document,
      payload: cloneCmsPayload(payload),
      updatedAt: storedState.overrides[sourcePath].updatedAt,
      isModified: true,
    }
  }

  async resetDocument(sourcePath: string): Promise<CmsDocument> {
    const document = defaultDocumentsMap[sourcePath]

    if (!document) {
      throw new Error(`Unknown CMS source path: ${sourcePath}`)
    }

    const storedState = readStoredState()
    delete storedState.overrides[sourcePath]
    writeStoredState(storedState)

    return {
      ...document,
      payload: cloneCmsPayload(document.payload),
      updatedAt: null,
      isModified: false,
    }
  }

  async resetAll(): Promise<void> {
    writeStoredState({ version: 1, overrides: {} })
  }

  async exportSnapshot(): Promise<CmsSnapshot> {
    const storedState = readStoredState()

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      records: Object.values(storedState.overrides).map((override) => ({
        sourcePath: override.sourcePath,
        payload: cloneCmsPayload(override.payload),
        updatedAt: override.updatedAt,
      })),
    }
  }

  async importSnapshot(snapshot: CmsSnapshot): Promise<void> {
    if (!isCmsSnapshot(snapshot)) {
      throw new Error('Invalid CMS snapshot.')
    }

    const validRecords = snapshot.records.filter((record) => record.sourcePath in defaultDocumentsMap)

    const overrides = Object.fromEntries(
      validRecords.map((record) => [
        record.sourcePath,
        {
          sourcePath: record.sourcePath,
          payload: cloneCmsPayload(record.payload),
          updatedAt: record.updatedAt,
        },
      ]),
    )

    writeStoredState({
      version: 1,
      overrides,
    })
  }
}

export const mockContentRepository = new MockContentRepository()

export function getEditableZoneDocumentSourcePath(zoneId: string) {
  const zone = siteMapById[zoneId]
  return zone?.editableContentPath ?? zone?.filePath ?? null
}
