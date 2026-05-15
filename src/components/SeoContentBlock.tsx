import { getContentByEntryId } from '../catalog/content/contentSelectors'

type SeoContentBlockProps = {
  entryId: string
  mode?: 'benefits' | 'useCases'
  title?: string
}

function SeoContentBlock({
  entryId,
  mode = 'benefits',
  title,
}: SeoContentBlockProps) {
  const content = getContentByEntryId(entryId)

  if (!content) {
    return null
  }

  const items = mode === 'useCases' ? content.useCases : content.benefits

  if (!items.length) {
    return null
  }

  return (
    <article className="content-card panel-integrated content-readable seo-content-block">
      <p className="section-label">{mode === 'useCases' ? 'Casos de uso' : 'Beneficios'}</p>
      <h3>{title ?? (mode === 'useCases' ? 'Donde encaja mejor.' : 'Por que encaja en el flujo.')}</h3>
      <ul className="hint-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

export default SeoContentBlock
