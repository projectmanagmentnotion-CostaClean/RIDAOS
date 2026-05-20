import { useCallback, useMemo, useState } from 'react'
import type { CmsDocument, CmsDocumentType, CmsSnapshot, CmsZoneView } from '../types/cms'
import { mockContentRepository } from '../services/mockContentRepository'
import { cloneCmsPayload, stringifyCmsPayload } from '../utils/cmsSerialization'

type DraftState = {
  sourcePath: string | null
  payload: unknown
  rawJson: string
}

type UseContentStudioState = {
  allZones: CmsZoneView[]
  zones: CmsZoneView[]
  documents: CmsDocument[]
  search: string
  filter: CmsDocumentType | 'all'
  selectedZoneId: string | null
  selectedZone: CmsZoneView | null
  selectedDocument: CmsDocument | null
  draftPayload: unknown
  rawJson: string
  statusMessage: string
  isLoading: boolean
  hasUnsavedChanges: boolean
  setSearch: (value: string) => void
  setFilter: (value: CmsDocumentType | 'all') => void
  setSelectedZoneId: (value: string) => void
  setDraftPayload: (value: unknown) => void
  setRawJson: (value: string) => void
  saveDocument: () => Promise<void>
  resetDocument: () => Promise<void>
  resetAll: () => Promise<void>
  exportSnapshot: () => Promise<void>
  importSnapshot: (file: File) => Promise<void>
  applyRawJson: () => void
}

async function loadStudioState() {
  const [zones, documents] = await Promise.all([
    mockContentRepository.getZones(),
    mockContentRepository.getDocuments(),
  ])

  return { zones, documents }
}

function buildDraftFromDocument(document: CmsDocument | null): DraftState {
  if (!document) {
    return {
      sourcePath: null,
      payload: null,
      rawJson: '',
    }
  }

  const payload = cloneCmsPayload(document.payload)

  return {
    sourcePath: document.sourcePath,
    payload,
    rawJson: stringifyCmsPayload(payload),
  }
}

const initialStudioState = await loadStudioState()

export function useContentStudio(): UseContentStudioState {
  const [allZones, setAllZones] = useState<CmsZoneView[]>(initialStudioState.zones)
  const [documents, setDocuments] = useState<CmsDocument[]>(initialStudioState.documents)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<CmsDocumentType | 'all'>('all')
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(initialStudioState.zones[0]?.id ?? null)
  const [statusMessage, setStatusMessage] = useState('Modo mock/local only.')
  const [draftState, setDraftState] = useState<DraftState>(() => {
    const firstDocument = initialStudioState.documents.find((document) =>
      document.zoneIds.includes(initialStudioState.zones[0]?.id ?? ''),
    ) ?? null

    return buildDraftFromDocument(firstDocument)
  })

  const zones = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return allZones.filter((zone) => {
      const matchesFilter = filter === 'all' || zone.type === filter
      const matchesSearch =
        normalizedSearch.length === 0 ||
        zone.id.toLowerCase().includes(normalizedSearch) ||
        zone.label.toLowerCase().includes(normalizedSearch) ||
        zone.description.toLowerCase().includes(normalizedSearch)

      return matchesFilter && matchesSearch
    })
  }, [allZones, filter, search])

  const activeZoneId = useMemo(() => {
    if (!zones.length) {
      return null
    }

    return selectedZoneId && zones.some((zone) => zone.id === selectedZoneId) ? selectedZoneId : zones[0].id
  }, [selectedZoneId, zones])

  const selectedZone = useMemo(
    () => allZones.find((zone) => zone.id === activeZoneId) ?? null,
    [activeZoneId, allZones],
  )

  const selectedDocument = useMemo(() => {
    if (!selectedZone) {
      return null
    }

    return documents.find((document) => document.zoneIds.includes(selectedZone.id)) ?? null
  }, [documents, selectedZone])

  const effectiveDraft = useMemo(() => {
    if (!selectedDocument) {
      return {
        payload: null,
        rawJson: '',
      }
    }

    if (draftState.sourcePath === selectedDocument.sourcePath) {
      return {
        payload: draftState.payload,
        rawJson: draftState.rawJson,
      }
    }

    const nextDraft = buildDraftFromDocument(selectedDocument)
    return {
      payload: nextDraft.payload,
      rawJson: nextDraft.rawJson,
    }
  }, [draftState.payload, draftState.rawJson, draftState.sourcePath, selectedDocument])

  const setDraftPayload = useCallback(
    (value: unknown) => {
      if (!selectedDocument) {
        return
      }

      setDraftState({
        sourcePath: selectedDocument.sourcePath,
        payload: value,
        rawJson: stringifyCmsPayload(value),
      })
    },
    [selectedDocument],
  )

  const setRawJson = useCallback(
    (value: string) => {
      if (!selectedDocument) {
        return
      }

      const basePayload =
        draftState.sourcePath === selectedDocument.sourcePath
          ? draftState.payload
          : cloneCmsPayload(selectedDocument.payload)

      setDraftState({
        sourcePath: selectedDocument.sourcePath,
        payload: basePayload,
        rawJson: value,
      })
    },
    [draftState.payload, draftState.sourcePath, selectedDocument],
  )

  const hasUnsavedChanges = useMemo(() => {
    if (!selectedDocument) {
      return false
    }

    return stringifyCmsPayload(effectiveDraft.payload) !== stringifyCmsPayload(selectedDocument.payload)
  }, [effectiveDraft.payload, selectedDocument])

  const refresh = useCallback(async () => {
    const nextState = await loadStudioState()
    setAllZones(nextState.zones)
    setDocuments(nextState.documents)
    return nextState
  }, [])

  const saveDocument = useCallback(async () => {
    if (!selectedDocument) {
      return
    }

    const saved = await mockContentRepository.saveDocument(selectedDocument.sourcePath, effectiveDraft.payload)
    setDocuments((current) => current.map((document) => (document.sourcePath === saved.sourcePath ? saved : document)))
    const nextZones = await mockContentRepository.getZones()
    setAllZones(nextZones)
    setDraftState(buildDraftFromDocument(saved))
    setStatusMessage(`Guardado mock en localStorage para ${saved.label}.`)
  }, [effectiveDraft.payload, selectedDocument])

  const resetDocument = useCallback(async () => {
    if (!selectedDocument) {
      return
    }

    const reset = await mockContentRepository.resetDocument(selectedDocument.sourcePath)
    setDocuments((current) => current.map((document) => (document.sourcePath === reset.sourcePath ? reset : document)))
    const nextZones = await mockContentRepository.getZones()
    setAllZones(nextZones)
    setDraftState(buildDraftFromDocument(reset))
    setStatusMessage(`Reset aplicado: ${reset.label} vuelve al default del repositorio.`)
  }, [selectedDocument])

  const resetAll = useCallback(async () => {
    await mockContentRepository.resetAll()
    const nextState = await refresh()
    const firstZone = nextState.zones[0] ?? null
    const firstDocument = firstZone
      ? nextState.documents.find((document) => document.zoneIds.includes(firstZone.id)) ?? null
      : null
    setSelectedZoneId(firstZone?.id ?? null)
    setDraftState(buildDraftFromDocument(firstDocument))
    setStatusMessage('Snapshot mock eliminado. Todo vuelve a defaults locales.')
  }, [refresh])

  const exportSnapshot = useCallback(async () => {
    const snapshot = await mockContentRepository.exportSnapshot()
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ridaosprint-mock-cms-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setStatusMessage('Snapshot exportado en JSON desde localStorage.')
  }, [])

  const importSnapshot = useCallback(
    async (file: File) => {
      const raw = await file.text()
      const parsed = JSON.parse(raw) as CmsSnapshot
      await mockContentRepository.importSnapshot(parsed)
      const nextState = await refresh()
      const currentZone =
        activeZoneId && nextState.zones.some((zone) => zone.id === activeZoneId)
          ? nextState.zones.find((zone) => zone.id === activeZoneId) ?? null
          : nextState.zones[0] ?? null
      const currentDocument = currentZone
        ? nextState.documents.find((document) => document.zoneIds.includes(currentZone.id)) ?? null
        : null
      setSelectedZoneId(currentZone?.id ?? null)
      setDraftState(buildDraftFromDocument(currentDocument))
      setStatusMessage(`Snapshot mock importado desde ${file.name}.`)
    },
    [activeZoneId, refresh],
  )

  const applyRawJson = useCallback(() => {
    const parsed = JSON.parse(effectiveDraft.rawJson)
    if (!selectedDocument) {
      return
    }

    setDraftState({
      sourcePath: selectedDocument.sourcePath,
      payload: parsed,
      rawJson: stringifyCmsPayload(parsed),
    })
    setStatusMessage('JSON aplicado al draft local. Falta guardar para persistir.')
  }, [effectiveDraft.rawJson, selectedDocument])

  return {
    allZones,
    zones,
    documents,
    search,
    filter,
    selectedZoneId: activeZoneId,
    selectedZone,
    selectedDocument,
    draftPayload: effectiveDraft.payload,
    rawJson: effectiveDraft.rawJson,
    statusMessage,
    isLoading: false,
    hasUnsavedChanges,
    setSearch,
    setFilter,
    setSelectedZoneId,
    setDraftPayload,
    setRawJson,
    saveDocument,
    resetDocument,
    resetAll,
    exportSnapshot,
    importSnapshot,
    applyRawJson,
  }
}
