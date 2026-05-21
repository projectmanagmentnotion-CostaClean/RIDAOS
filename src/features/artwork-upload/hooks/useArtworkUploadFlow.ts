import { useEffect, useMemo, useState } from 'react'
import { artworkProductRules } from '../product-rules/artworkProductRules'
import { extractArtworkMetadata } from '../services/extractArtworkMetadata'
import type { ArtworkPreviewSummary, ArtworkProductRuleKey, ArtworkUploadFlowState } from '../types/artworkUpload'
import { validateArtworkFile } from '../validation/validateArtworkFile'

export function useArtworkUploadFlow(ruleKey: ArtworkProductRuleKey, file: File | null) {
  const rule = artworkProductRules[ruleKey]
  const [metadata, setMetadata] = useState<ArtworkUploadFlowState['metadata']>(null)
  const [summary, setSummary] = useState<ArtworkPreviewSummary | null>(null)
  const [confirmedToken, setConfirmedToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileToken = file ? `${file.name}-${file.size}-${file.lastModified}` : null

  useEffect(() => {
    let cancelled = false

    if (!file) {
      queueMicrotask(() => {
        if (!cancelled) {
          setMetadata(null)
          setSummary(null)
          setIsLoading(false)
        }
      })
      return
    }

    queueMicrotask(() => {
      if (!cancelled) {
        setIsLoading(true)
      }
    })

    void extractArtworkMetadata(file).then((nextMetadata) => {
      if (cancelled) {
        if (nextMetadata.objectUrl) {
          URL.revokeObjectURL(nextMetadata.objectUrl)
        }
        return
      }

      setMetadata((current) => {
        if (current?.objectUrl) {
          URL.revokeObjectURL(current.objectUrl)
        }
        return nextMetadata
      })
      setSummary(validateArtworkFile(ruleKey, nextMetadata))
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [file, ruleKey])

  useEffect(
    () => () => {
      if (metadata?.objectUrl) {
        URL.revokeObjectURL(metadata.objectUrl)
      }
    },
    [metadata],
  )

  const steps = useMemo(
    () => [
      'Selecciona producto o formato',
      'Sube tu archivo',
      'Revisión automática mock',
      'Previsualización con guías',
      'Recomendaciones',
      'Confirmar archivo',
      'Añadir al carrito',
    ],
    [],
  )

  const confirmed = Boolean(fileToken) && confirmedToken === fileToken

  return {
    rule,
    metadata,
    summary,
    confirmed,
    setConfirmed: (nextConfirmed: boolean) => setConfirmedToken(nextConfirmed ? fileToken : null),
    isLoading,
    steps,
  }
}
