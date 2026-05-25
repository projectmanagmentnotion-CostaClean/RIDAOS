import type { DiscoverabilityLink } from '../types/discoverability'

type RelatedProductsSectionProps = {
  items: readonly DiscoverabilityLink[]
}

export function RelatedProductsSection({ items }: RelatedProductsSectionProps) {
  if (!items.length) {
    return null
  }

  return (
    <section className="content-section discoverability-section" data-product-reveal>
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Productos relacionados</p>
          <h2>Productos que completan mejor este proyecto.</h2>
        </div>
      </div>
      <div className="commerce-recommendations__grid">
        {items.map((item) => (
          <article className="content-card discoverability-card" key={item.id}>
            <p className="section-label">{item.tag ?? 'Producto'}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a className="card-link" href={item.href}>
              Ver producto
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
