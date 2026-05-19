type ProductStoryPanelProps = {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
}

export function ProductStoryPanel({
  eyebrow,
  title,
  description,
  bullets,
}: ProductStoryPanelProps) {
  return (
    <article className="content-card product-story-panel">
      <p className="section-label">{eyebrow}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul className="detail-list">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </article>
  )
}
