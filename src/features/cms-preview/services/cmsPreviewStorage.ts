import { cmsDefaultDocuments } from '../../cms/data/cmsDefaultDocuments'
import { CMS_MOCK_STORAGE_KEY } from '../../cms/services/mockContentRepository'

export const CMS_PREVIEW_FLAG_KEY = 'ridaosprint-cms-preview-enabled'
export const CMS_PREVIEW_QUERY_KEY = 'cmsPreview'
export const CMS_PREVIEW_EVENT = 'ridaosprint:cms-preview-toggled'

type StoredOverride = {
  sourcePath: string
  payload: unknown
  updatedAt: string
}

type StoredState = {
  version: 1
  overrides: Record<string, StoredOverride>
}

const knownSourcePaths = new Set(cmsDefaultDocuments.map((document) => document.sourcePath))

function getStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

export function getCmsPreviewEnabledFromStorage() {
  const storage = getStorage()
  if (!storage) {
    return false
  }

  return storage.getItem(CMS_PREVIEW_FLAG_KEY) === '1'
}

export function setCmsPreviewEnabledInStorage(enabled: boolean) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.setItem(CMS_PREVIEW_FLAG_KEY, enabled ? '1' : '0')

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CMS_PREVIEW_EVENT))
  }
}

export function syncCmsPreviewFlagFromQuery() {
  if (typeof window === 'undefined') {
    return null
  }

  const params = new URLSearchParams(window.location.search)
  const value = params.get(CMS_PREVIEW_QUERY_KEY)

  if (value === '1') {
    setCmsPreviewEnabledInStorage(true)
    return true
  }

  if (value === '0') {
    setCmsPreviewEnabledInStorage(false)
    return false
  }

  return null
}

export function getCmsPreviewEnabledFromEnvironment() {
  if (typeof window === 'undefined') {
    return false
  }

  const params = new URLSearchParams(window.location.search)
  const value = params.get(CMS_PREVIEW_QUERY_KEY)

  if (value === '1') {
    return true
  }

  if (value === '0') {
    return false
  }

  return getCmsPreviewEnabledFromStorage()
}

export function readCmsPreviewOverrideMap() {
  const storage = getStorage()
  if (!storage) {
    return {}
  }

  const raw = storage.getItem(CMS_MOCK_STORAGE_KEY)
  if (!raw) {
    return {}
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredState>
    if (parsed.version !== 1 || typeof parsed.overrides !== 'object' || !parsed.overrides) {
      return {}
    }

    return Object.fromEntries(
      Object.values(parsed.overrides)
        .filter((record) => record && typeof record.sourcePath === 'string' && knownSourcePaths.has(record.sourcePath))
        .map((record) => [record.sourcePath, record.payload]),
    )
  } catch {
    return {}
  }
}
