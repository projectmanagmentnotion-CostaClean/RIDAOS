import MouseMotionVisual from '../components/MouseMotionVisual'
import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import { getPublicCtaHref } from '../lib/navigation'

function MotionTest() {
  return (
    <PageShell className="premium-page motion-test-page">
      <SectionHeader
        className="premium-hero"
        description="Ruta temporal de comprobacion visual con cursor assist, glow y tarjetas magneticas."
        eyebrow="Motion QA"
        hero
        stickerWords={['cursor', 'motion']}
        title="Motion test"
        titleLines={['MOTION', 'TEST']}
      />
      <section className="content-section content-grid-two motion-test-grid">
        <article className="content-card motion-card motion-test-card">
          <p className="section-label">Cursor assist</p>
          <h2>Punto, aro y glow siguen el mouse.</h2>
          <p>Mueve el cursor por esta tarjeta. El cursor nativo permanece visible y el glow no captura clics.</p>
          <MouseMotionVisual variant="portfolio" />
        </article>
        <article className="content-card motion-card motion-test-card">
          <p className="section-label">Card tilt</p>
          <h2>Tarjeta magnetica con movimiento visible.</h2>
          <p>El movimiento esta ligado a variables CSS y limitado a esta tarjeta para no tapar enlaces ni formularios.</p>
          <MouseMotionVisual variant="catalog" />
          <a className="action-button action-link-button" href={getPublicCtaHref('contacto')}>
            Confirmar CTA clicable
          </a>
        </article>
      </section>
    </PageShell>
  )
}

export default MotionTest
