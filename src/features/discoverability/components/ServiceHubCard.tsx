import type { DiscoverabilityHub } from '../types/discoverability'

type ServiceHubCardProps = {
  hub: DiscoverabilityHub
}

export function ServiceHubCard({ hub }: ServiceHubCardProps) {
  return (
    <article className="content-card discoverability-card hover-lift" data-cursor="interest">
      <p className="section-label">Hub</p>
      <h3>{hub.title}</h3>
      <p>{hub.description}</p>
      <ul className="detail-list">
        {hub.primaryKeywords.slice(0, 3).map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>
    </article>
  )
}
