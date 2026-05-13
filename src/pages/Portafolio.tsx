import { useEffect, useRef } from 'react'
import CtaPanel from '../components/CtaPanel'
import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import {
  initCinematicScroll,
  initCursorAwareReveals,
  initUrbanTextMotion,
} from '../lib/animations'

const filters = ['Todos', 'Rotulacion', 'DTF/Textil', 'Vinilos', 'Lonas', 'Diseno grafico']

const projects = [
  {
    category: 'Rotulacion',
    title: 'Vehicle wrap de reparto urbano',
    description: 'Cobertura completa para flota ligera con lectura de marca agresiva y acabado resistente.',
    tags: ['laminado', 'instalacion', 'flota'],
    metric: '+42% visibilidad local',
  },
  {
    category: 'DTF/Textil',
    title: 'DTF textile run para drop capsula',
    description: 'Serie corta con colores solidos y ritmo de reposicion preparado para campanas rapidas.',
    tags: ['premium', 'drop', 'reposicion'],
    metric: '320 prendas / 48h',
  },
  {
    category: 'Vinilos',
    title: 'Storefront vinyl para retail',
    description: 'Vinilo de escaparate orientado a lanzamiento de temporada con alta legibilidad en calle.',
    tags: ['retail', 'escaparate', 'apertura'],
    metric: '3 fachadas coordinadas',
  },
  {
    category: 'Lonas',
    title: 'Banner de lona para evento outdoor',
    description: 'Sistema grafico de gran formato para fachada y entrada principal con montaje agil.',
    tags: ['gran formato', 'evento', 'fachada'],
    metric: '18 m lineales',
  },
  {
    category: 'Vinilos',
    title: 'Sticker pack para marca urbana',
    description: 'Pack de adhesivos pensado para producto, activacion y comunidad con estetica de street label.',
    tags: ['pack', 'merch', 'adhesivos'],
    metric: '6 referencias lanzadas',
  },
  {
    category: 'Diseno grafico',
    title: 'Urban brand kit para identidad visual',
    description: 'Sistema de piezas graficas preparado para impresion, senaletica y activacion comercial.',
    tags: ['branding', 'sistema', 'arte final'],
    metric: '12 activos listos',
  },
]

const selectedProjects = [
  {
    index: '01',
    label: 'Wrap / Mobility',
    title: 'Vehicle wrap con silueta de flota y capa de lectura urbana.',
    detail: 'Direccion visual y montaje pensados para superficie en movimiento.',
    href: '#/presupuesto',
    action: 'Quiero este enfoque',
    visual: 'vehicle',
  },
  {
    index: '02',
    label: 'Sheet / DTF',
    title: 'DTF textile run con preview abstracto de plancha viva.',
    detail: 'Series cortas y drops visuales listos para ritmo de reposicion.',
    href: '#/producto/dtf',
    action: 'Abrir producto',
    visual: 'dtf',
  },
  {
    index: '03',
    label: 'Pack / Stickers',
    title: 'Sticker pack y vinilo con mosaico de cortes sugeridos.',
    detail: 'Pack visual para comunidad, retail y activacion de marca.',
    href: '#/presupuesto',
    action: 'Solicitar resultado',
    visual: 'stickers',
  },
]

function Portafolio() {
  const pageRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const scope = pageRef.current

    if (!scope) {
      return
    }

    const textContext = initUrbanTextMotion(scope)
    const cursorContext = initCursorAwareReveals(scope)
    const scrollContext = initCinematicScroll(scope)

    return () => {
      scrollContext.revert()
      textContext.revert()
      cursorContext.revert()
    }
  }, [])

  return (
    <PageShell className="portfolio-page premium-page" ref={pageRef}>
      <section className="cinematic-scene portfolio-cinematic-scene" data-animate="hero" data-motion="poster-stack" data-scroll-scene="portfolio-cinematic">
        <div className="cinematic-scene-copy">
          <p className="eyebrow">Portfolio / selected work</p>
          <div className="cinematic-word cinematic-word-compact type-condensed type-negative" data-cursor="fisheye">
            <span>WRAP</span>
            <span>WORK</span>
          </div>
        </div>
        <div className="cinematic-mask" data-cursor="invert">
          <div aria-label="Imagen placeholder: rotulacion vehiculo" className="cinematic-image image-placeholder image-placeholder-vehicle">
            <span className="image-placeholder-label">Imagen placeholder: rotulacion vehiculo</span>
          </div>
        </div>
        <div className="scroll-bridge">
          <span className="bridge-chip">vehicle wrap</span>
          <span className="bridge-chip">dtf run</span>
          <span className="bridge-chip">vinyl retail</span>
          <span className="bridge-chip">banner</span>
        </div>
      </section>

      <div className="portfolio-hero-stage" data-animate="hero" data-scroll-scene="portfolio-hero" data-scroll-section>
        <SectionHeader
          className="portfolio-hero premium-hero type-split"
          description="Casos, acabados y resultados pensados para convertir inspiracion visual en solicitud comercial real."
          eyebrow="Portfolio pro"
          hero
          stickerWords={['calle', 'impacto']}
          title="Resultados que venden calle, marca e impacto."
          titleLines={['RESULTADOS', 'QUE VENDEN', 'CALLE, MARCA', 'E IMPACTO']}
        />

        <aside
          className="content-card portfolio-side-card hover-lift"
          data-animate="panel"
          data-cursor="invert"
          data-depth="0.07"
          data-parallax="soft"
          tabIndex={0}
        >
          <p className="section-label">Direccion visual</p>
          <h2 className="section-heading">Acabado urbano con lectura comercial.</h2>
          <p>
            RidaosPrint combina rotulacion, textil, vinilos, lonas y diseno para proyectos que necesitan impacto visual y ejecucion clara.
          </p>
          <div className="flagship-product-meta">
            <span>acabado</span>
            <span>instalacion</span>
            <span>arte final</span>
          </div>
        </aside>
      </div>

      <section className="portfolio-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="portfolio-filters">
        <SectionHeader eyebrow="Filtros visuales" title="Lectura rapida por tipo de proyecto." />
        <div className="filter-pill-row" aria-label="Filtros visuales del portfolio">
          {filters.map((filter, index) => (
            <span className={`filter-pill${index === 0 ? ' is-active' : ''}`} key={filter}>
              {filter}
            </span>
          ))}
        </div>
      </section>

      <section className="portfolio-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="portfolio-selected">
        <SectionHeader eyebrow="Selected work" title="Filas editoriales con respuesta de portfolio." />
        <div className="editorial-row-list">
          {selectedProjects.map((row) => (
            <a
              className={`editorial-row work-row editorial-visual-${row.visual}`}
              data-animate="row"
              data-cursor="fisheye"
              data-scroll-row
              href={row.href}
              key={row.index}
            >
              <div className="editorial-row-index">
                <span>{row.index}</span>
                <span className="editorial-row-slash">/</span>
              </div>
              <div className="editorial-row-main">
                <p className="section-label">{row.label}</p>
                <h2 data-animate-heading>
                  {row.title.split(' ').map((word) => (
                    <span className="heading-segment" key={`${row.index}-${word}`}>
                      {word}
                    </span>
                  ))}
                </h2>
                <p>{row.detail}</p>
              </div>
              <div className="editorial-row-preview" aria-hidden="true">
                <div className="editorial-ghost-panel">
                  <div className="ghost-mark ghost-mark-primary" />
                  <div className="ghost-mark ghost-mark-secondary" />
                  <div className="ghost-mark ghost-mark-tertiary" />
                </div>
                <span className="editorial-row-arrow">{row.action}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="portfolio-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="portfolio-projects">
        <SectionHeader eyebrow="Proyectos" title="Seleccion de trabajos con lenguaje premium y comercial." />
        <div className="portfolio-grid" data-motion="grid-shuffle">
          {projects.map((project, index) => (
            <article
              className={`content-card portfolio-card hover-lift${index === 0 ? ' flagship-product-card' : ''}`}
              data-animate="panel"
              data-cursor="fisheye"
              key={project.title}
              tabIndex={0}
            >
              <div
                aria-label={
                  project.category === 'Rotulacion'
                    ? 'Imagen placeholder: rotulacion vehiculo'
                    : project.category === 'DTF/Textil'
                      ? 'Imagen placeholder: pliego DTF'
                      : project.category === 'Vinilos'
                        ? 'Imagen placeholder: escaparate vinilo'
                        : project.category === 'Lonas'
                          ? 'Imagen placeholder: lona publicitaria'
                          : 'Imagen placeholder: sticker pack'
                }
                className={`image-placeholder card-image-placeholder ${
                  project.category === 'Rotulacion'
                    ? 'image-placeholder-vehicle'
                    : project.category === 'DTF/Textil'
                      ? 'image-placeholder-dtf-sheet'
                      : project.category === 'Vinilos'
                        ? 'image-placeholder-storefront'
                        : project.category === 'Lonas'
                          ? 'image-placeholder-banner'
                          : 'image-placeholder-stickers'
                }`}
              >
                <span className="image-placeholder-label">
                  {project.category === 'Rotulacion'
                    ? 'Imagen placeholder: rotulacion vehiculo'
                    : project.category === 'DTF/Textil'
                      ? 'Imagen placeholder: pliego DTF'
                      : project.category === 'Vinilos'
                        ? 'Imagen placeholder: escaparate vinilo'
                        : project.category === 'Lonas'
                          ? 'Imagen placeholder: lona publicitaria'
                          : 'Imagen placeholder: sticker pack'}
                </span>
              </div>
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
              <a className="action-button action-link-button" data-cursor="magnetic" href="#/presupuesto">
                Quiero un resultado asi
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="negative-type-scene" data-animate="reveal" data-scroll-scene="portfolio-negative">
        <p className="type-kicker">Negative portfolio moment</p>
        <div className="negative-type-title type-mega type-condensed type-negative" data-cursor="fisheye">
          <span>WRAP</span>
          <span>VISION</span>
        </div>
        <p className="negative-type-copy">
          Un punto de contraste para conectar resultado visual, superficie y propuesta personalizada.
        </p>
        <div className="image-placeholder image-placeholder-vehicle" aria-label="Imagen placeholder: rotulacion vehiculo" data-cursor="invert">
          <span className="image-placeholder-label">Imagen placeholder: rotulacion vehiculo</span>
        </div>
      </section>

      <CtaPanel
        actions={
          <>
            <a className="action-button action-link-button" data-cursor="invert" href="#/presupuesto">
              Quiero un resultado asi
            </a>
            <a className="card-link" data-cursor="invert" href="#/catalogo">
              Ver catalogo completo
            </a>
          </>
        }
        className="portfolio-cta-panel"
        description="Si el proyecto requiere una mezcla de fabricacion, instalacion o direccion grafica, el siguiente paso es una propuesta personalizada."
        label="Servicio a medida"
        title="Activa tu propuesta personalizada."
      />
    </PageShell>
  )
}

export default Portafolio
