import type { DocumentBlock } from '../types/documents'

type MetricGridBlock = Extract<DocumentBlock, { type: 'metric_grid' }>

type DocumentMetricGridProps = {
  block: MetricGridBlock
}

export function DocumentMetricGrid({ block }: DocumentMetricGridProps) {
  return (
    <section className="document-block">
      <h3>{block.title}</h3>
      <div className="document-metric-grid">
        {block.metrics.map((metric) => (
          <article className="document-metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            {metric.note ? <small>{metric.note}</small> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
