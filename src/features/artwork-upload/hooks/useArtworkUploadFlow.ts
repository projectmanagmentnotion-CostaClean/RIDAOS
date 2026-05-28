import { useEffect, useMemo, useState } from 'react'
import { artworkProductRules } from '../product-rules/artworkProductRules'
import { extractArtworkMetadata } from '../services/extractArtworkMetadata'
import type {
  ArtworkPreviewSummary,
  ArtworkProductRuleKey,
  ArtworkUploadFlowState,
  ArtworkValidationContext,
} from '../types/artworkUpload'
import { buildArtworkAcceptance } from '../utils/artworkAcceptance'
import { validateArtworkFile } from '../validation/validateArtworkFile'

export function useArtworkUploadFlow(
  ruleKey: ArtworkProductRuleKey,
  file: File | null,
  context?: ArtworkValidationContext,
) {
  const rule = artworkProductRules[ruleKey]
  const [metadata, setMetadata] = useState<ArtworkUploadFlowState['metadata']>(null)
  const [summary, setSummary] = useState<ArtworkPreviewSummary | null>(null)
  const [confirmedToken, setConfirmedToken] = useState<string | null>(null)
  const [designerHelpRequested, setDesignerHelpRequested] = useState(false)
  const [acceptedAt, setAcceptedAt] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const fileToken = file ? `${file.name}-${file.size}-${file.lastModified}` : null

  useEffect(() => {
    let cancelled = false

    if (!file) {
      queueMicrotask(() => {
        if (!cancelled) {
          setMetadata(null)
          setSummary(null)
          setAcceptedAt(undefined)
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

  const acceptance = useMemo(
    () =>
      buildArtworkAcceptance({
        ruleKey,
        metadata,
        summary,
        isLoading,
        clientAccepted: Boolean(fileToken) && confirmedToken === fileToken,
        designerHelpRequested,
        acceptedAt,
        context,
      }),
    [acceptedAt, confirmedToken, context, designerHelpRequested, fileToken, isLoading, metadata, ruleKey, summary],
  )

  const steps = useMemo(
    () => [
      'Selecciona producto o formato',
      'Sube tu archivo',
      'Comprobacion inicial',
      'Vista previa con guias',
      'Recomendaciones',
      'Aceptar archivo',
      'Continuar solicitud',
    ],
    [],
  )

  return {
    rule,
    metadata,
    summary,
    acceptance,
    confirmed: acceptance.canContinue,
    setConfirmed: (nextConfirmed: boolean) => {
      if (!fileToken) {
        return
      }

      setConfirmedToken(nextConfirmed ? fileToken : null)
      setAcceptedAt(nextConfirmed ? new Date().toISOString() : undefined)
    },
    requestDesignerHelp: (nextValue: boolean) => {
      setDesignerHelpRequested(nextValue)
      if (nextValue) {
        setConfirmedToken(null)
        setAcceptedAt(undefined)
      }
    },
    isLoading,
    steps,
  }
}
