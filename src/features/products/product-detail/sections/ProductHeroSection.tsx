import SectionHeader from '../../../../components/SectionHeader'
import { ProductVisualHero } from '../../../product-options'
import type { ProductHeroVisual } from '../../../product-options'

type ProductHeroSectionProps = {
  eyebrow: string
  title: string
  description: string
  stickerWords?: string[]
  heroVisual?: ProductHeroVisual | null
  primaryHref?: string
  secondaryHref?: string
}

export function ProductHeroSection({
  eyebrow,
  title,
  description,
  stickerWords,
  heroVisual,
  primaryHref,
  secondaryHref,
}: ProductHeroSectionProps) {
  if (heroVisual) {
    return <ProductVisualHero hero={heroVisual} primaryHref={primaryHref} secondaryHref={secondaryHref} />
  }

  return (
    <section className="product-experience-hero" data-product-reveal>
      <SectionHeader
        className="premium-hero type-split"
        description={description}
        eyebrow={eyebrow}
        hero
        stickerWords={stickerWords}
        title={title}
      />
      <div className="catalog-cta-row">
        {primaryHref ? (
          <a className="action-button action-link-button" href={primaryHref}>
            Ir al configurador
          </a>
        ) : null}
        {secondaryHref ? (
          <a className="action-button action-button-muted action-link-button" href={secondaryHref}>
            Preparar archivo
          </a>
        ) : null}
      </div>
    </section>
  )
}
