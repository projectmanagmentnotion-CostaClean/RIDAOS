import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { CMS_MOCK_STORAGE_EVENT } from '../../cms/services/mockContentRepository'
import type { CmsPreviewContextValue } from '../types/cmsPreview'
import { CmsPreviewContext } from './CmsPreviewContext'
import {
  CMS_PREVIEW_EVENT,
  getCmsPreviewEnabledFromEnvironment,
  getCmsPreviewEnabledFromStorage,
  readCmsPreviewOverrideMap,
  setCmsPreviewEnabledInStorage,
  syncCmsPreviewFlagFromQuery,
} from '../services/cmsPreviewStorage'

type CmsPreviewProviderProps = {
  children: ReactNode
}

export function CmsPreviewProvider({ children }: CmsPreviewProviderProps) {
  const [enabled, setEnabledState] = useState(() => getCmsPreviewEnabledFromEnvironment())
  const [documents, setDocuments] = useState<Record<string, unknown>>(() =>
    getCmsPreviewEnabledFromEnvironment() ? readCmsPreviewOverrideMap() : {},
  )
  const [isHydrated, setIsHydrated] = useState(() => typeof window !== 'undefined')

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    syncCmsPreviewFlagFromQuery()

    const hydrate = () => {
      const nextEnabled = getCmsPreviewEnabledFromStorage()
      setEnabledState(nextEnabled)
      setDocuments(nextEnabled ? readCmsPreviewOverrideMap() : {})
      setIsHydrated(true)
    }

    const handleStorageUpdate = () => {
      hydrate()
    }

    hydrate()
    window.addEventListener(CMS_PREVIEW_EVENT, handleStorageUpdate)
    window.addEventListener(CMS_MOCK_STORAGE_EVENT, handleStorageUpdate)
    window.addEventListener('storage', handleStorageUpdate)

    return () => {
      window.removeEventListener(CMS_PREVIEW_EVENT, handleStorageUpdate)
      window.removeEventListener(CMS_MOCK_STORAGE_EVENT, handleStorageUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
    }
  }, [])

  const setEnabled = (nextEnabled: boolean) => {
    setCmsPreviewEnabledInStorage(nextEnabled)
    setEnabledState(nextEnabled)
    setDocuments(nextEnabled ? readCmsPreviewOverrideMap() : {})
  }

  const value = useMemo<CmsPreviewContextValue>(
    () => ({
      enabled,
      setEnabled,
      documents,
      isHydrated,
    }),
    [documents, enabled, isHydrated],
  )

  return <CmsPreviewContext.Provider value={value}>{children}</CmsPreviewContext.Provider>
}
