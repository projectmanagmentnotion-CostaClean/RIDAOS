import type { DiscoverabilityLink } from '../types/discoverability'

type InternalLinkGridProps = {
  items: readonly DiscoverabilityLink[]
  title?: string
}

export function InternalLinkGrid({ items, title = 'Explorar por intencion' }: InternalLinkGridProps) {
  if (!items.length) {
    return null
  }

  return (
    <section className="content-section discoverability-section">
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Enlaces internos</p>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="category-grid">
        {items.map((item) => (
          <article className="content-card category-card hover-lift" data-cursor="interest" key={item.id}>
            <p className="section-label">{item.tag ?? 'Explorar'}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a className="card-link" href={item.href}>
              Abrir
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
