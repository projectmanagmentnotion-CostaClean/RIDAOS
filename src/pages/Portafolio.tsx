import CtaPanel from '../components/CtaPanel'
import MouseMotionVisual from '../components/MouseMotionVisual'
import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import { getPublicCtaHref } from '../lib/navigation'

const projects = [
  {
    category: 'Rotulacion',
    title: 'Rotulacion de flota ligera',
    description: 'Cobertura para vehiculo comercial con lectura de marca clara y acabado resistente.',
    tags: ['laminado', 'instalacion', 'flota'],
    metric: '+42% visibilidad en zona',
  },
  {
    category: 'Textil',
    title: 'Serie textil para lanzamiento',
    description: 'Tirada corta con colores solidos y preparacion para campanas rapidas.',
    tags: ['premium', 'serie corta', 'reposicion'],
    metric: '320 prendas / 48h',
  },
  {
    category: 'Vinilos',
    title: 'Vinilo de escaparate para retail',
    description: 'Pieza orientada a lanzamiento de temporada con alta legibilidad en calle.',
    tags: ['retail', 'escaparate', 'apertura'],
    metric: '3 fachadas coordinadas',
  },
]

function Portafolio() {
  return (
    <PageShell className="portfolio-page premium-page">
      <SectionHeader
        className="portfolio-hero premium-hero type-split"
        description="Casos, acabados y resultados pensados para convertir inspiracion visual en solicitud comercial real."
        eyebrow="Portfolio pro"
        hero
        stickerWords={['calle', 'impacto']}
        title="Resultados que venden calle, marca e impacto."
        titleLines={['RESULTADOS', 'QUE VENDEN', 'CALLE, MARCA', 'E IMPACTO']}
      />

      <section className="portfolio-section">
        <SectionHeader eyebrow="Proyectos" title="Seleccion de trabajos con lectura comercial." />
        <article className="content-card motion-card">
          <SectionHeader eyebrow="Movimiento visual" title="Acabados, superficies y propuesta en una vista limpia." />
          <MouseMotionVisual variant="portfolio" />
        </article>
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <article
              className={`content-card portfolio-card hover-lift${index === 0 ? ' flagship-product-card' : ''}`}
              key={project.title}
              tabIndex={0}
            >
              <div>
                <p className="section-label">{project.category}</p>
                <h2>{project.title}</h2>
              </div>
              <p>{project.description}</p>
              <div className="portfolio-tag-row">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="portfolio-metric">
                <span className="meta-label">Resultado</span>
                <strong>{project.metric}</strong>
              </div>
              <a className="action-button action-link-button" href={getPublicCtaHref('presupuesto')}>
                Quiero un resultado asi
              </a>
            </article>
          ))}
        </div>
      </section>

      <CtaPanel
        actions={
          <>
            <a className="action-button action-link-button" href={getPublicCtaHref('presupuesto')}>
              Quiero un resultado asi
            </a>
            <a className="card-link" href={getPublicCtaHref('catalogo')}>
              Ver catalogo completo
            </a>
          </>
        }
        className="portfolio-cta-panel"
        description="Si el proyecto requiere fabricacion, instalacion o direccion grafica, el siguiente paso es una propuesta personalizada."
        label="Servicio a medida"
        title="Activa tu propuesta personalizada."
      />
    </PageShell>
  )
}

export default Portafolio
