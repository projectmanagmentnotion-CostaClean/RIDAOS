import type { FrequentlyCombinedBundle } from '../types/discoverability'

type FrequentlyCombinedSectionProps = {
  bundles: readonly FrequentlyCombinedBundle[]
}

export function FrequentlyCombinedSection({ bundles }: FrequentlyCombinedSectionProps) {
  if (!bundles.length) {
    return null
  }

  return (
    <section className="content-section discoverability-section" data-product-reveal>
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Combinaciones frecuentes</p>
          <h2>Lo que suele pedirse junto.</h2>
        </div>
      </div>
      <div className="discoverability-bundle-grid">
        {bundles.map((bundle) => (
          <article className="content-card discoverability-bundle-card" key={bundle.id}>
            <h3>{bundle.title}</h3>
            <p>{bundle.description}</p>
            <ul className="detail-list">
              {bundle.items.map((item) => (
                <li key={item.id}>
                  <a className="card-link" href={item.href}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
