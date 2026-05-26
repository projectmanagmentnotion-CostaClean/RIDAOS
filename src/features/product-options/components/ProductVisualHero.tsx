import type { CSSProperties } from 'react'
import type { ProductHeroVisual } from '../types/productOptions'

type ProductVisualHeroProps = {
  hero: ProductHeroVisual
  primaryHref?: string
  secondaryHref?: string
}

export function ProductVisualHero({ hero, primaryHref, secondaryHref }: ProductVisualHeroProps) {
  const style = { '--product-hero-accent': hero.accent } as CSSProperties

  return (
    <section
      className="product-visual-hero content-card"
      data-product-reveal
      style={style}
    >
      <div className="product-visual-hero__copy">
        <p className="eyebrow type-kicker">{hero.eyebrow}</p>
        <h1 className="section-title type-condensed">{hero.title}</h1>
        <p className="product-visual-hero__claim">{hero.claim}</p>
        <p className="section-copy">{hero.description}</p>
        <div className="premium-pill-row">
          {hero.benefitChips.map((chip) => (
            <span className="premium-pill" key={chip}>
              {chip}
            </span>
          ))}
        </div>
        <div className="catalog-cta-row">
          {primaryHref ? (
            <a className="action-button action-link-button" href={primaryHref}>
              {hero.primaryCtaLabel}
            </a>
          ) : null}
          {secondaryHref && hero.secondaryCtaLabel ? (
            <a className="action-button action-button-muted action-link-button" href={secondaryHref}>
              {hero.secondaryCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
      <div className="product-visual-hero__visual" data-status={hero.asset.status}>
        <div className="product-visual-hero__orb" aria-hidden="true" />
        <div className="product-visual-hero__asset-card">
          <p className="section-label">{hero.asset.label}</p>
          <strong>Referencia visual del producto</strong>
          <span>{hero.asset.status === 'required' ? 'Acabado principal' : hero.asset.status === 'mock' ? 'Visual de referencia' : 'Inspiracion recomendada'}</span>
          <p>{hero.asset.purpose}</p>
        </div>
      </div>
    </section>
  )
}
