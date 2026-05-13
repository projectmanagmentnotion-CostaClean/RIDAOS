import type { AdminTimelineItem } from '../types/adminModels'

type TimelineBlockProps = {
  items: AdminTimelineItem[]
}

function TimelineBlock({ items }: TimelineBlockProps) {
  return (
    <div className="timeline-block">
      {items.map((item) => (
        <article className="timeline-item" key={item.id}>
          <div className={`timeline-dot timeline-dot-${item.tone ?? 'default'}`} />
          <div className="timeline-copy">
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
            <span>{new Date(item.timestamp).toLocaleString('es-ES')}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

export default TimelineBlock
