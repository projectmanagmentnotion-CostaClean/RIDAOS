import type { ReportDefinition } from '../types/reporting'

type OperationalDocumentCardProps = {
  definition: ReportDefinition
}

export function OperationalDocumentCard({ definition }: OperationalDocumentCardProps) {
  return (
    <article className="content-card admin-quick-action">
      <p className="section-label">{definition.relatedEntity}</p>
      <strong>{definition.label}</strong>
      <p>{definition.description}</p>
      <small>{definition.sections.join(' · ')}</small>
    </article>
  )
}
