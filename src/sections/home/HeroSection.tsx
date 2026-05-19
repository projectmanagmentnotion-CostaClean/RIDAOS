import SectionHeader from '../../components/SectionHeader'
import HomeVehicleScrollSequence from '../../components/home/HomeVehicleScrollSequence'
import { getPublicCtaHref } from '../../lib/navigation'
import type { HomeContent } from './homeData'

type HeroSectionProps = {
  content: HomeContent
}

function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="home-sequence-scroll">
      <div className="home-sequence-sticky">
        <HomeVehicleScrollSequence />
        <div className="home-hero-stage">
          <SectionHeader
            className="premium-hero home-hero-copy type-split"
            description={
              content?.intro ??
              'Compra DTF por metro lineal con una base clara para pedidos agiles: configura tu tirada, sube tus disenos y avanza con una experiencia directa y profesional.'
            }
            eyebrow={content?.eyebrow ?? 'DTF por metro para pedidos agiles'}
            hero
            stickerWords={['DTF', 'pedido']}
            title={content?.h1 ? `RidaosPrint ${content.h1}` : 'RidaosPrint DTF por metro.'}
            titleLines={['RIDAOSPRINT', 'DTF POR', 'METRO']}
          />
          <div className="home-hero-direct-flow cursor-interest" data-cursor-zone="conversion">
            <div className="hero-orbit-stack">
              <div className="hero-orbit-line">
                <span className="orbit-dot" />
                <span>Configuracion por metro lineal</span>
              </div>
              <div className="hero-orbit-line">
                <span className="orbit-dot" />
                <span>Archivo y precio visibles antes de avanzar</span>
              </div>
              <div className="hero-orbit-line">
                <span className="orbit-dot" />
                <span>Comprobacion tecnica antes de fabricar</span>
              </div>
            </div>
            <div className="catalog-cta-row home-hero-actions">
              <a className="action-button action-link-button" data-cursor="interest" href={getPublicCtaHref('dtf')}>
                {content?.primaryCta.label ?? 'Configurar DTF'}
              </a>
              <a className="action-button action-button-muted action-link-button" data-cursor="interest" href={getPublicCtaHref('catalogo')}>
                Ver catalogo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
