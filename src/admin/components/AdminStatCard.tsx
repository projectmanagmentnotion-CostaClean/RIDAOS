type AdminStatCardProps = {
  label: string
  value: string | number
  note?: string
}

function AdminStatCard({ label, value, note }: AdminStatCardProps) {
  return (
    <article className="content-card admin-stat-card">
      <p className="section-label">{label}</p>
      <strong>{value}</strong>
      {note ? <p>{note}</p> : null}
    </article>
  )
}

export default AdminStatCard
