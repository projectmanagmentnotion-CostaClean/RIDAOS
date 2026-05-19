import SeoContentBlock from '../../components/SeoContentBlock'
import { dtfEntry } from '../../catalog/products/dtf'
import { homeEditorialContent } from '../../content/homeContent'

/**
 * Editable Zone: HOME_EDITORIAL
 * Content: src/content/homeContent.ts
 * Visual component: src/sections/home/EditorialSection.tsx
 */
function EditorialSection() {
  return (
    <section className="content-section content-grid-two" data-scene="PRODUCTION_DETAIL_TRANSITION" data-zone="HOME_EDITORIAL">
      <SeoContentBlock entryId={dtfEntry.id} title={homeEditorialContent.primaryTitle} />
      <SeoContentBlock entryId={dtfEntry.id} mode="useCases" title={homeEditorialContent.secondaryTitle} />
    </section>
  )
}

export default EditorialSection
