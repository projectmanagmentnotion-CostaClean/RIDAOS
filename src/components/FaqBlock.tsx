import FAQSection from './FAQSection'
import { getFaqForEntry } from '../catalog/content/contentSelectors'

type FaqBlockProps = {
  entryId: string
  title?: string
}

function FaqBlock({ entryId, title = 'FAQ' }: FaqBlockProps) {
  const items = getFaqForEntry(entryId)

  if (!items.length) {
    return null
  }

  return (
    <section className="content-section faq-block">
      <div className="content-card faq-block-header">
        <p className="section-label">FAQ</p>
        <h3>{title}</h3>
      </div>
      <FAQSection items={items} />
    </section>
  )
}

export default FaqBlock
