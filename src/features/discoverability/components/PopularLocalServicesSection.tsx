import type { LocalServiceHub } from '../types/discoverability'

type PopularLocalServicesSectionProps = {
  hubs: readonly LocalServiceHub[]
}

export function PopularLocalServicesSection({ hubs }: PopularLocalServicesSectionProps) {
  if (!hubs.length) {
    return null
  }

  return (
    <section className="content-section discoverability-section">
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Servicios locales</p>
          <h2>Lectura por ciudad y necesidad comercial.</h2>
        </div>
      </div>
      <div className="discoverability-local-grid">
        {hubs.map((hub) => (
          <article className="content-card discoverability-card" key={hub.id}>
            <p className="section-label">{hub.locality}</p>
            <h3>{hub.title}</h3>
            <p>{hub.description}</p>
            <ul className="detail-list">
              {hub.links.map((item) => (
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
