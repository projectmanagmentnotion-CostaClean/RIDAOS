import FaqBlock from '../../components/FaqBlock'
import ObjectionHandlerBlock from '../../components/ObjectionHandlerBlock'
import { dtfEntry } from '../../catalog/products/dtf'
import { faqContent } from '../../content/faqContent'

/**
 * Editable Zone: HOME_FAQ
 * Content: src/content/faqContent.ts
 * Visual component: src/sections/home/AnswersSection.tsx
 */
function AnswersSection() {
  return (
    <section className="content-section" data-animate="reveal" data-zone="HOME_FAQ">
      <ObjectionHandlerBlock entryId={dtfEntry.id} title={faqContent.home.objectionsTitle} />
      <FaqBlock entryId={dtfEntry.id} title={faqContent.home.faqTitle} />
    </section>
  )
}

export default AnswersSection
