type MetricCardProps = {
  label: string
  value: string
  note?: string
  className?: string
}

function MetricCard({ label, value, note, className }: MetricCardProps) {
  return (
    <article
      className={className ? `stat-card metric-card ${className}` : 'stat-card metric-card'}
      data-animate="panel"
      tabIndex={0}
    >
      <p className="stat-label">{label}</p>
      <h2>{value}</h2>
      {note ? <p className="metric-note">{note}</p> : null}
    </article>
  )
}

export default MetricCard
