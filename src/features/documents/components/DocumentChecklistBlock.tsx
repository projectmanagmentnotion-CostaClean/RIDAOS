type DocumentChecklistBlockProps = {
  block: Extract<import('../types/documents').DocumentBlock, { type: 'checklist' }>
}

export function DocumentChecklistBlock({ block }: DocumentChecklistBlockProps) {
  return (
    <section className="document-block">
      <h3>{block.title}</h3>
      <ul className="document-checklist">
        {block.items.map((item) => (
          <li key={`${block.id}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
