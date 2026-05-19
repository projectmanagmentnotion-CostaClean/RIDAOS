import type { PropsWithChildren } from 'react'

type RecommendedProductCardProps = PropsWithChildren<{
  href: string
  tag: string
  title: string
  priceLabel: string
  description: string
}>

export function RecommendedProductCard({
  href,
  tag,
  title,
  priceLabel,
  description,
}: RecommendedProductCardProps) {
  return (
    <article className="content-card recommendation-card hover-lift" data-cursor="interest">
      <p className="section-label">{tag}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="recommendation-card__footer">
        <strong>{priceLabel}</strong>
        <a className="card-link" href={href}>
          Abrir
        </a>
      </div>
    </article>
  )
}
