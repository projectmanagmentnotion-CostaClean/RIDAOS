import { useMemo } from 'react'
import type { ArtworkPreview, ArtworkProductRuleKey } from '../../../domain/storage'
import { runMockPrepressAnalysis } from '../services/runMockPrepressAnalysis'

export function usePrepressAnalysis(ruleKey: ArtworkProductRuleKey, metadata: ArtworkPreview | null) {
  return useMemo(() => {
    if (!metadata) {
      return null
    }

    return runMockPrepressAnalysis(ruleKey, metadata)
  }, [metadata, ruleKey])
}
