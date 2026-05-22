type DocumentTimelineBlockProps = {
  block: Extract<import('../types/documents').DocumentBlock, { type: 'timeline' }>
}

export function DocumentTimelineBlock({ block }: DocumentTimelineBlockProps) {
  return (
    <section className="document-block">
      <h3>{block.title}</h3>
      <div className="document-timeline">
        {block.items.map((item) => (
          <article className="document-timeline-item" key={`${block.id}-${item.label}-${item.value}`}>
            <strong>{item.label}</strong>
            <span>{item.value}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
