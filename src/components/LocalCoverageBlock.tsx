import { getContentByEntryId } from '../catalog/content/contentSelectors'

type LocalCoverageBlockProps = {
  entryId: string
  title?: string
}

function LocalCoverageBlock({ entryId, title = 'Cobertura local y busquedas clave' }: LocalCoverageBlockProps) {
  const content = getContentByEntryId(entryId)
  const groups = content?.localCoverage ?? []

  if (!groups.length) {
    return null
  }

  return (
    <article className="content-card panel-integrated content-readable seo-content-block">
      <p className="section-label">Cobertura local</p>
      <h3>{title}</h3>
      <div className="content-grid-two">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="section-label">{group.label}</p>
            <ul className="hint-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  )
}

export default LocalCoverageBlock
