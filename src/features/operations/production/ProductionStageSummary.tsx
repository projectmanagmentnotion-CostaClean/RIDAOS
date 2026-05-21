type ProductionStageSummaryProps = {
  items: Array<{
    label: string
    value: number
  }>
}

function ProductionStageSummary({ items }: ProductionStageSummaryProps) {
  return (
    <div className="stats-grid">
      {items.map((item) => (
        <article className="stat-card" key={item.label}>
          <p className="section-label">{item.label}</p>
          <strong>{item.value}</strong>
        </article>
      ))}
    </div>
  )
}

export default ProductionStageSummary
