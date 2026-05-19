import type { PropsWithChildren } from 'react'

type ConfiguratorHighlightProps = PropsWithChildren<{
  eyebrow: string
  title: string
  description: string
}>

export function ConfiguratorHighlight({
  eyebrow,
  title,
  description,
  children,
}: ConfiguratorHighlightProps) {
  return (
    <article className="content-card configurator-highlight" data-cursor="interest">
      <p className="section-label">{eyebrow}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      {children ? <div className="configurator-highlight__body">{children}</div> : null}
    </article>
  )
}
