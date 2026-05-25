import type { DiscoverabilityHub } from '../types/discoverability'
import { ServiceHubCard } from './ServiceHubCard'

type ExploreMoreSectionProps = {
  hubs: readonly DiscoverabilityHub[]
}

export function ExploreMoreSection({ hubs }: ExploreMoreSectionProps) {
  if (!hubs.length) {
    return null
  }

  return (
    <section className="content-section discoverability-section">
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Explorar mas</p>
          <h2>Navegacion por tema, no solo por producto.</h2>
        </div>
      </div>
      <div className="category-grid">
        {hubs.map((hub) => (
          <ServiceHubCard hub={hub} key={hub.id} />
        ))}
      </div>
    </section>
  )
}
