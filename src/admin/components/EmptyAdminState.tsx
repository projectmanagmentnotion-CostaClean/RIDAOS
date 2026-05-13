type EmptyAdminStateProps = {
  title: string
  description: string
}

function EmptyAdminState({ title, description }: EmptyAdminStateProps) {
  return (
    <article className="content-card empty-admin-state">
      <p className="section-label">Sin resultados</p>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

export default EmptyAdminState
