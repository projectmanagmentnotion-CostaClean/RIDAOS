type PriceCardProps = {
  label: string
  value: string
  note?: string
  className?: string
}

function PriceCard({ label, value, note, className = '' }: PriceCardProps) {
  return (
    <article className={`content-card price-card ${className}`.trim()}>
      <p className="section-label">{label}</p>
      <h3>{value}</h3>
      {note ? <p>{note}</p> : null}
    </article>
  )
}

export default PriceCard
