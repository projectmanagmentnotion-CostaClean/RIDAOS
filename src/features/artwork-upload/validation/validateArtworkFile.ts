import { runMockPrepressAnalysis } from '../../prepress'
import type { ArtworkPreviewMetadata, ArtworkPreviewSummary, ArtworkProductRuleKey } from '../types/artworkUpload'

export function validateArtworkFile(ruleKey: ArtworkProductRuleKey, metadata: ArtworkPreviewMetadata): ArtworkPreviewSummary {
  return runMockPrepressAnalysis(ruleKey, metadata)
}
