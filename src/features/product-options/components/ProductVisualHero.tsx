import type { CSSProperties } from 'react'
import type { ProductHeroVisual } from '../types/productOptions'

type ProductVisualHeroProps = {
  hero: ProductHeroVisual
  primaryHref?: string
  secondaryHref?: string
}

export function ProductVisualHero({ hero, primaryHref, secondaryHref }: ProductVisualHeroProps) {
  const style = {
    '--product-hero-accent': hero.accent,
    '--product-hero-image': hero.asset.expectedPath ? `url("${hero.asset.expectedPath}")` : 'none',
  } as CSSProperties

  return (
    <section className="product-visual-hero content-card" data-product-reveal style={style}>
      <div className="product-visual-hero__main">
        <div className="product-visual-hero__copy">
          <p className="eyebrow type-kicker">{hero.eyebrow}</p>
          <h1 className="section-title type-condensed">{hero.title}</h1>
          <p className="product-visual-hero__claim">{hero.claim}</p>
          <p className="section-copy">{hero.description}</p>
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
          <div className="product-visual-hero__backdrop" aria-hidden="true" />
          <div className="product-visual-hero__grid" aria-hidden="true" />
          <div className="product-visual-hero__glow" aria-hidden="true" />
          <div className="product-visual-hero__image" aria-hidden="true" />
          <div className="product-visual-hero__asset-card">
            <p className="section-label">{hero.asset.label}</p>
            <strong>Referencia principal del producto</strong>
            <span>Preparado para configuracion, revision y produccion.</span>
            <p>{hero.asset.purpose}</p>
          </div>
        </div>
      </div>
      <div className="product-visual-hero__benefits">
        {hero.benefitChips.map((chip) => (
          <article className="product-visual-hero__benefit" key={chip}>
            <span className="product-visual-hero__benefit-line" aria-hidden="true" />
            <strong>{chip}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
