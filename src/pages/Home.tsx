import { useMemo } from 'react'
import CtaPanel from '../components/CtaPanel'
import ConversionTrustBlock from '../components/ConversionTrustBlock'
import FaqBlock from '../components/FaqBlock'
import HomeVehicleScrollSequence from '../components/home/HomeVehicleScrollSequence'
import MetricCard from '../components/MetricCard'
import MouseMotionVisual from '../components/MouseMotionVisual'
import ObjectionHandlerBlock from '../components/ObjectionHandlerBlock'
import PageShell from '../components/PageShell'
import ProcessSteps from '../components/ProcessSteps'
import SeoContentBlock from '../components/SeoContentBlock'
import SectionHeader from '../components/SectionHeader'
import TrustGrid from '../components/TrustGrid'
import UploadGuidanceBlock from '../components/UploadGuidanceBlock'
import { getContentByEntryId } from '../catalog/content/contentSelectors'
import { dtfEntry } from '../catalog/products/dtf'
import { getPublicCtaHref } from '../lib/navigation'

const stats = [
  { label: 'Base', value: '14,50 EUR/metro' },
  { label: 'Flujo', value: 'Configura, sube y pide' },
  { label: 'Estado', value: 'Pedido claro desde el inicio' },
]

function Home() {
  const homeContent = useMemo(() => getContentByEntryId(dtfEntry.id), [])

  return (
    <PageShell className="hero-page premium-page home-page">
      <section className="home-fullscreen-hero">
        <HomeVehicleScrollSequence />
        <div className="home-hero-stage">
          <SectionHeader
            className="premium-hero home-hero-copy type-split"
            description={homeContent?.intro ?? 'Compra DTF por metro lineal con una base clara para pedidos agiles: configura tu tirada, sube tus disenos y avanza con una experiencia directa y profesional.'}
            eyebrow={homeContent?.eyebrow ?? 'DTF por metro para pedidos agiles'}
            hero
            stickerWords={['DTF', 'pedido']}
            title={homeContent?.h1 ? `RidaosPrint ${homeContent.h1}` : 'RidaosPrint DTF por metro.'}
            titleLines={['RIDAOSPRINT', 'DTF POR', 'METRO']}
          />

          <aside className="content-card home-hero-orbit hover-lift motion-card" tabIndex={0}>
            <p className="section-label">Pedido directo</p>
            <h2 className="section-heading">Configura DTF por metro sin pasos innecesarios.</h2>
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
            <div className="catalog-cta-row">
              <a className="action-button action-link-button" href={getPublicCtaHref('dtf')}>
                {homeContent?.primaryCta.label ?? 'Configurar DTF'}
              </a>
              <a className="action-button action-button-muted action-link-button" href={getPublicCtaHref('catalogo')}>
                Ver catalogo
              </a>
            </div>
            <MouseMotionVisual variant="dtf" />
          </aside>
        </div>
      </section>

      <div aria-label="Resumen" className="stats-grid">
        {stats.map((stat) => (
          <MetricCard className="hover-lift premium-value-card" key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="split-grid home-lower-grid">
        <CtaPanel
          actions={
            <>
              <a className="action-button action-link-button" href={getPublicCtaHref('catalogo')}>
                Ver catalogo
              </a>
              <a className="card-link" href={getPublicCtaHref('guia')}>
                Ver guia de archivos
              </a>
            </>
          }
          className="home-foundation-panel"
          description="Organizamos la experiencia para que puedas pasar del catalogo al pedido con una lectura clara."
          label="Base comercial"
          title="Un frente claro para ventas DTF por metro."
        />

        <article className="content-card home-quick-panel hover-lift" tabIndex={0}>
          <SectionHeader title="Accesos rapidos" />
          <ul className="detail-list">
            <li>
              <a className="card-link" href={getPublicCtaHref('catalogo')}>
                Ver catalogo
              </a>
            </li>
            <li>
              <a className="card-link" href={getPublicCtaHref('dtf')}>
                Abrir pagina DTF por metro
              </a>
            </li>
            <li>
              <a className="card-link" href={getPublicCtaHref('guia')}>
                Revisar guia de archivos
              </a>
            </li>
          </ul>
        </article>
      </div>

      <section className="content-section">
        <SectionHeader eyebrow="Como funciona" title="Proceso base de pedido." />
        <ProcessSteps />
      </section>

      <section className="content-section content-grid-two">
        <SeoContentBlock entryId={dtfEntry.id} title="Que hacemos" />
        <SeoContentBlock entryId={dtfEntry.id} mode="useCases" title="Para quien imprimimos" />
      </section>

      <section className="content-section content-grid-two">
        <UploadGuidanceBlock entryId={dtfEntry.id} title="Como preparar el pedido" />
        <ConversionTrustBlock entryId={dtfEntry.id} title="Por que RidaosPrint" />
      </section>

      <section className="content-section">
        <SectionHeader eyebrow="Confianza" title="Un proceso claro desde el diseno hasta la entrega." />
        <TrustGrid />
      </section>

      <ObjectionHandlerBlock entryId={dtfEntry.id} title="Respuestas rapidas antes de pedir." />
      <FaqBlock entryId={dtfEntry.id} title="Preguntas rapidas antes de pedir." />

      <section className="content-section">
        <CtaPanel
          actions={
            <a className="action-button action-link-button" href={getPublicCtaHref('dtf')}>
              Configurar DTF ahora
            </a>
          }
          description="Configura, sube archivo y avanza con una experiencia clara de principio a fin."
          label="Siguiente paso"
          title="Activa tu pedido DTF."
        />
      </section>
    </PageShell>
  )
}

export default Home
