import ProcessSteps from '../../components/ProcessSteps'
import { homeProcessContent } from '../../content/homeContent'
import SectionHeader from '../../components/SectionHeader'

/**
 * Editable Zone: HOME_PROCESS
 * Content: src/content/homeContent.ts
 * Visual component: src/sections/home/ProcessSection.tsx
 */
function ProcessSection() {
  return (
    <section className="content-section" data-scene="VEHICLE_WRAP_TRANSITION" data-zone="HOME_PROCESS">
      <SectionHeader eyebrow={homeProcessContent.eyebrow} title={homeProcessContent.title} />
      <ProcessSteps />
    </section>
  )
}

export default ProcessSection
