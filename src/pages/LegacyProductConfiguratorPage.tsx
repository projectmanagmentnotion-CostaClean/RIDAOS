import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import { getCanonicalProductHref, getPublicCtaHref } from '../lib/navigation'

function LegacyProductConfiguratorPage() {
  return (
    <PageShell className="premium-page">
      <section className="page-hero premium-hero">
        <SectionHeader
          description="Esta ruta ha cambiado. Elige un producto para configurarlo."
          eyebrow="Ruta actualizada"
          hero
          title="Accede al producto correcto sin pasar por rutas antiguas."
        />
      </section>

      <section className="split-grid">
        <article className="content-card">
          <p className="section-label">Productos principales</p>
          <div className="catalog-card-actions">
            <a className="action-button action-link-button" href={getCanonicalProductHref('dtf')}>
              DTI por metro
            </a>
            <a className="action-button action-button-muted action-link-button" href={getCanonicalProductHref('tarjetas')}>
              Tarjetas de visita
            </a>
            <a className="action-button action-button-muted action-link-button" href={getCanonicalProductHref('flyers')}>
              Flyers personalizados
            </a>
            <a className="card-link" href={getPublicCtaHref('catalogo')}>
              Ver catalogo
            </a>
          </div>
        </article>
      </section>
    </PageShell>
  )
}

export default LegacyProductConfiguratorPage
