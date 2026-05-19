import type { PropsWithChildren, ReactNode } from 'react'

type StickySummaryPanelProps = PropsWithChildren<{
  eyebrow: string
  title: string
  description?: string
  footer?: ReactNode
  className?: string
}>

export function StickySummaryPanel({
  eyebrow,
  title,
  description,
  footer,
  className,
  children,
}: StickySummaryPanelProps) {
  return (
    <article className={`content-card sticky-summary-panel${className ? ` ${className}` : ''}`} data-cursor-zone="conversion">
      <p className="section-label">{eyebrow}</p>
      <div className="sticky-summary-panel__header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="sticky-summary-panel__body">{children}</div>
      {footer ? <div className="sticky-summary-panel__footer">{footer}</div> : null}
    </article>
  )
}
