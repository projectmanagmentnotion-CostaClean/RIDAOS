import type { DiscoverabilityLink } from '../types/discoverability'

type RelatedServicesSectionProps = {
  items: readonly DiscoverabilityLink[]
}

export function RelatedServicesSection({ items }: RelatedServicesSectionProps) {
  if (!items.length) {
    return null
  }

  return (
    <section className="content-section discoverability-section" data-product-reveal>
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Servicios relacionados</p>
          <h2>Lo que suele acompañar esta necesidad.</h2>
        </div>
      </div>
      <div className="commerce-recommendations__grid">
        {items.map((item) => (
          <article className="content-card discoverability-card" key={item.id}>
            <p className="section-label">{item.tag ?? item.label ?? 'Relacionado'}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a className="card-link" href={item.href}>
              Explorar
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
