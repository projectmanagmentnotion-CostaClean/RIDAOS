import ConversionTrustBlock from '../../components/ConversionTrustBlock'
import UploadGuidanceBlock from '../../components/UploadGuidanceBlock'
import { dtfEntry } from '../../catalog/products/dtf'
import { homePreparationContent } from '../../content/homeContent'

/**
 * Editable Zone: HOME_PREPARATION
 * Content: src/content/homeContent.ts
 * Visual component: src/sections/home/PreparationSection.tsx
 */
function PreparationSection() {
  return (
    <section className="content-section content-grid-two" data-animate="reveal" data-zone="HOME_PREPARATION">
      <UploadGuidanceBlock entryId={dtfEntry.id} title={homePreparationContent.uploadTitle} />
      <ConversionTrustBlock entryId={dtfEntry.id} title={homePreparationContent.trustTitle} />
    </section>
  )
}

export default PreparationSection
