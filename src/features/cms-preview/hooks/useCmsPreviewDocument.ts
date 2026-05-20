import { useMemo } from 'react'
import { useCmsPreview } from './useCmsPreview'
import { deepMergeCmsContent } from '../utils/deepMergeCmsContent'

type Selector<TDocument, TSelected> = (document: TDocument) => TSelected

export function resolveCmsContent<TDefault, TDocument = TDefault>(
  fallbackContent: TDefault,
  document: unknown,
  selector?: Selector<TDocument, unknown>,
) {
  if (!document) {
    return fallbackContent
  }

  try {
    const selected = selector ? selector(document as TDocument) : document
    return deepMergeCmsContent(fallbackContent, selected)
  } catch {
    return fallbackContent
  }
}

export function useCmsPreviewDocument<TDefault, TDocument = TDefault>(
  sourcePath: string,
  fallbackContent: TDefault,
  selector?: Selector<TDocument, unknown>,
) {
  const { documents, enabled } = useCmsPreview()

  return useMemo(() => {
    if (!enabled) {
      return fallbackContent
    }

    const override = documents[sourcePath]
    return resolveCmsContent<TDefault, TDocument>(fallbackContent, override, selector)
  }, [documents, enabled, fallbackContent, selector, sourcePath])
}
