import type { ReactNode } from 'react'

type CtaPanelProps = {
  label: string
  title: string
  description: string
  actions: ReactNode
  className?: string
}

function CtaPanel({ label, title, description, actions, className }: CtaPanelProps) {
  return (
    <article
      className={className ? `content-card cta-panel ${className}` : 'content-card cta-panel'}
      data-animate="panel"
      tabIndex={0}
    >
      <p className="section-label">{label}</p>
      <h2 className="section-heading">{title}</h2>
      <p>{description}</p>
      <div className="cta-panel-actions">{actions}</div>
    </article>
  )
}

export default CtaPanel
