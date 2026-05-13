import type { ReactNode } from 'react'

type AdminSectionProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

function AdminSection({ title, description, actions, children }: AdminSectionProps) {
  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <div>
          <p className="section-label">Operaciones</p>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="admin-section-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}

export default AdminSection
