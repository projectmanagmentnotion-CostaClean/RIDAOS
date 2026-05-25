import type { DiscoverabilityLink } from '../types/discoverability'

type RelatedGuidesSectionProps = {
  items: readonly DiscoverabilityLink[]
}

export function RelatedGuidesSection({ items }: RelatedGuidesSectionProps) {
  if (!items.length) {
    return null
  }

  return (
    <section className="content-section discoverability-section" data-product-reveal>
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Guias relacionadas</p>
          <h2>Respuestas y guias para decidir mejor.</h2>
        </div>
      </div>
      <div className="commerce-recommendations__grid">
        {items.map((item) => (
          <article className="content-card discoverability-card" key={item.id}>
            <p className="section-label">{item.tag ?? 'Guia'}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a className="card-link" href={item.href}>
              Abrir guia
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
