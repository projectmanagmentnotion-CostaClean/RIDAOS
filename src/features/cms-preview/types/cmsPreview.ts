export type CmsPreviewDocumentMap = Record<string, unknown>

export type CmsPreviewContextValue = {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  documents: CmsPreviewDocumentMap
  isHydrated: boolean
}
