import SectionHeader from '../../components/SectionHeader'
import HomeVehicleScrollSequence from '../../components/home/HomeVehicleScrollSequence'
import { homeHeroContent } from '../../content/homeContent'
import { useCmsPreviewDocument } from '../../features/cms-preview'
import { getPublicCtaHref } from '../../lib/navigation'
import type { HomeContent } from './homeData'

type HeroSectionProps = {
  content: HomeContent
}

/**
 * Editable Zone: HOME_HERO
 * Content: src/content/homeContent.ts
 * Visual component: src/sections/home/HeroSection.tsx
 */
function HeroSection({ content }: HeroSectionProps) {
  const previewHeroContent = useCmsPreviewDocument(
    'src/content/homeContent.ts',
    homeHeroContent,
    (document: { homeHeroContent?: typeof homeHeroContent }) => document.homeHeroContent,
  )

  return (
    <section className="home-sequence-scroll" data-scene="HERO_CINEMATIC" data-zone="HOME_HERO">
      <div className="home-sequence-sticky">
        <HomeVehicleScrollSequence />
        <div className="home-hero-stage" data-animate="hero">
          <SectionHeader
            className="premium-hero home-hero-copy type-split"
            description={previewHeroContent.fallbackDescription}
            eyebrow={previewHeroContent.fallbackEyebrow}
            hero
            stickerWords={['DTF', 'pedido']}
            title={content?.h1 ? `RidaosPrint ${content.h1}` : 'RidaosPrint DTF por metro.'}
            titleLines={['RIDAOSPRINT', 'DTF POR', 'METRO']}
          />
          <div className="home-hero-direct-flow cursor-interest" data-cursor-zone="conversion">
            <div className="hero-orbit-stack">
              {previewHeroContent.orbitLines.map((line) => (
                <div className="hero-orbit-line" key={line}>
                  <span className="orbit-dot" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
            <div className="catalog-cta-row home-hero-actions">
              <a className="action-button action-link-button" data-cursor="interest" href={getPublicCtaHref('dtf')}>
                {previewHeroContent.primaryCtaLabel}
              </a>
              <a className="action-button action-button-muted action-link-button" data-cursor="interest" href={getPublicCtaHref('catalogo')}>
                {previewHeroContent.secondaryCtaLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
