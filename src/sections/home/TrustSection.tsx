import SectionHeader from '../../components/SectionHeader'
import TrustGrid from '../../components/TrustGrid'
import { homeTrustContent } from '../../content/homeContent'

/**
 * Editable Zone: HOME_TRUST
 * Content: src/content/homeContent.ts
 * Visual component: src/sections/home/TrustSection.tsx
 */
function TrustSection() {
  return (
    <section className="content-section">
      <SectionHeader eyebrow={homeTrustContent.eyebrow} title={homeTrustContent.title} />
      <TrustGrid />
    </section>
  )
}

export default TrustSection
