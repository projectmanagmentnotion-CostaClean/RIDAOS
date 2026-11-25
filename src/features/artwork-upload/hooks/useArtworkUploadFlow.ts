import { useEffect, useMemo, useState } from 'react'
import { artworkProductRules } from '../product-rules/artworkProductRules'
import { dtiArtworkFileWasAccepted } from '../../dtf/dtiArtworkGate.mjs'
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
  const [confirmation, setConfirmation] = useState<{ file: File; acceptedAt: string } | null>(null)
  const [designerHelpFile, setDesignerHelpFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const clientAccepted = dtiArtworkFileWasAccepted(file, confirmation?.file ?? null)
  const designerHelpRequested = dtiArtworkFileWasAccepted(file, designerHelpFile)

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

  const acceptance = useMemo(
    () =>
      buildArtworkAcceptance({
        ruleKey,
        metadata,
        summary,
        isLoading,
        clientAccepted,
        designerHelpRequested,
        acceptedAt: clientAccepted ? confirmation?.acceptedAt : undefined,
        context,
      }),
    [clientAccepted, confirmation?.acceptedAt, context, designerHelpRequested, file, isLoading, metadata, ruleKey, summary],
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
      if (!file) {
        return
      }

      setConfirmation(nextConfirmed ? { file, acceptedAt: new Date().toISOString() } : null)
    },
    requestDesignerHelp: (nextValue: boolean) => {
      setDesignerHelpFile(nextValue ? file : null)
      if (nextValue) {
        setConfirmation(null)
      }
    },
    isLoading,
    steps,
  }
}
