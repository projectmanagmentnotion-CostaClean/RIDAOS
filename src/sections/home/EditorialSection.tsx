import SeoContentBlock from '../../components/SeoContentBlock'
import { dtfEntry } from '../../catalog/products/dtf'

function EditorialSection() {
  return (
    <section className="content-section content-grid-two">
      <SeoContentBlock entryId={dtfEntry.id} title="Que hacemos" />
      <SeoContentBlock entryId={dtfEntry.id} mode="useCases" title="Para quien imprimimos" />
    </section>
  )
}

export default EditorialSection
