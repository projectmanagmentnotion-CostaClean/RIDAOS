import { useEffect, useRef } from 'react'
import CtaPanel from '../components/CtaPanel'
import FAQSection from '../components/FAQSection'
import MetricCard from '../components/MetricCard'
import PageShell from '../components/PageShell'
import ProcessSteps from '../components/ProcessSteps'
import SectionHeader from '../components/SectionHeader'
import TrustGrid from '../components/TrustGrid'
import {
  initCinematicScroll,
  initCursorAwareReveals,
  initUrbanTextMotion,
} from '../lib/animations'

const stats = [
  { label: 'Base', value: '14,50 EUR/metro' },
  { label: 'Flujo', value: 'Configura, sube y pide' },
  { label: 'Estado', value: 'Frontend base listo' },
]

const homeFaq = [
  {
    question: 'DTF por metro',
    answer: 'Configuras el metraje, subes archivo y revisas el resumen antes de seguir.',
  },
  {
    question: 'Archivos',
    answer: 'La guia resume formatos y criterios basicos antes de producir.',
  },
  {
    question: 'Produccion',
    answer: 'Los trabajos quedan sujetos a revision y aprobacion previa cuando aplique.',
  },
]

const selectedRows = [
  {
    index: '01',
    label: 'Directo / DTF por metro',
    title: 'DTF listo para sheet preview y pedido directo.',
    detail: 'Configuracion, archivo y precio vivo sin salir del flujo.',
    href: '#/producto/dtf',
    action: 'Configurar',
    visual: 'dtf',
  },
  {
    index: '02',
    label: 'Servicio / Vinilos',
    title: 'Vinilo y retail con lectura de produccion clara.',
    detail: 'Lineas preparadas para presupuesto con preview abstracto de reticula.',
    href: '#/catalogo',
    action: 'Ver linea',
    visual: 'vinyl',
  },
  {
    index: '03',
    label: 'Showcase / Portfolio',
    title: 'Wrap, sticker pack y piezas urbanas para mostrar capacidad.',
    detail: 'Casos y acabados pensados para convertir interes en propuesta.',
    href: '#/portafolio',
    action: 'Abrir portfolio',
    visual: 'vehicle',
  },
]

const narrativeSteps = [
  {
    number: '01',
    title: 'Configura',
    detail: 'Define el metraje y prepara el pedido base sin romper el ritmo comercial.',
  },
  {
    number: '02',
    title: 'Sube archivo',
    detail: 'Activa la carga y deja el arte final listo para lectura visual.',
  },
  {
    number: '03',
    title: 'Revision tecnica',
    detail: 'El archivo pasa por checks previos antes de comprometer produccion.',
  },
  {
    number: '04',
    title: 'Produccion',
    detail: 'La aprobacion da paso al flujo interno con tiempos y prioridad definidos.',
  },
  {
    number: '05',
    title: 'Entrega',
    detail: 'El pedido queda listo para recogida o envio cuando la capa operativa se active.',
  },
]

function Home() {
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
    <PageShell className="hero-page premium-page" ref={pageRef}>
      <section className="cinematic-scene home-cinematic-scene" data-animate="hero" data-motion="hero-stage" data-scroll-scene="home-cinematic" data-scroll-section>
        <div className="hero-flash-band" aria-hidden="true" />
        <div className="cinematic-scene-copy">
          <p className="eyebrow type-kicker" data-motion="subheadline">DTF por metro / cinematic system</p>
          <div className="cinematic-word type-mega type-condensed type-negative" data-cursor="fisheye">
            <span>DTF</span>
            <span>POR</span>
            <span>METRO</span>
          </div>
          <p className="cinematic-scene-note">
            Un arranque visual donde el texto abre la imagen y la imagen arrastra el siguiente bloque comercial.
          </p>
        </div>

        <div className="cinematic-mask" data-cursor="invert">
          <div
            aria-label="Imagen placeholder: rotulacion vehiculo"
            className="cinematic-image image-placeholder image-placeholder-vehicle"
          >
            <span className="image-placeholder-label">Imagen placeholder: rotulacion vehiculo</span>
          </div>
        </div>

        <div className="scroll-bridge">
          <span className="bridge-chip">vehicle wrap</span>
          <span className="bridge-chip">dtf sheet</span>
          <span className="bridge-chip">sticker pack</span>
          <span className="bridge-chip">storefront vinyl</span>
        </div>

        <div className="giant-marquee" aria-hidden="true">
          PRODUCCION FLEXIBLE / PREVIEW / PEDIDO / REVISION / ENTREGA
        </div>
      </section>

      <div className="home-hero-stage" data-motion="hero-stage" data-scroll-scene="home-hero" data-scroll-section>
        <div className="hero-flash-band" aria-hidden="true" />
        <SectionHeader
          className="premium-hero home-hero-copy type-split"
          description="Compra DTF por metro lineal con una base clara para pedidos agiles: configura tu tirada, sube tus disenos y avanza a produccion sin una capa extra de complejidad."
          eyebrow="DTF por metro para produccion flexible"
          hero
          stickerWords={['DTF', 'produccion']}
          title="RidaosPrint DTF por metro."
          titleLines={['RIDAOSPRINT', 'DTF POR', 'METRO']}
        />

        <aside
          className="content-card home-hero-orbit hover-lift"
          data-animate="panel"
          data-depth="0.08"
          data-parallax="soft"
          data-scroll-scene="home-positioning"
          tabIndex={0}
        >
          <p className="section-label">Posicionamiento</p>
          <h2 className="section-heading">Produccion flexible con lectura premium.</h2>
          <div className="hero-orbit-stack">
            <div className="hero-orbit-line">
              <span className="orbit-dot" />
              <span>Configuracion directa por metro lineal</span>
            </div>
            <div className="hero-orbit-line">
              <span className="orbit-dot" />
              <span>Previsualizacion antes de pasar al pedido</span>
            </div>
            <div className="hero-orbit-line">
              <span className="orbit-dot" />
              <span>Base lista para validacion y automatizacion futura</span>
            </div>
          </div>
          <div className="catalog-cta-row">
            <a className="action-button action-link-button" data-cursor="magnetic" href="#/producto/dtf">
              Configurar DTF
            </a>
            <a className="action-button action-button-muted action-link-button" data-cursor="magnetic" href="#/catalogo">
              Ver catalogo
            </a>
          </div>
          <div
            aria-label="Imagen placeholder: rotulacion vehiculo"
            className="image-placeholder image-placeholder-vehicle hero-visual-placeholder"
            data-cursor="invert"
          >
            <span className="image-placeholder-label">Imagen placeholder: rotulacion vehiculo</span>
          </div>
        </aside>
      </div>

      <div aria-label="Resumen" className="stats-grid" data-animate="reveal" data-scroll-scene="home-stats">
        {stats.map((stat) => (
          <MetricCard className="hover-lift premium-value-card" key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="split-grid home-lower-grid" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="home-base" data-scroll-section>
        <CtaPanel
          actions={
            <>
              <a className="action-button action-link-button" data-cursor="magnetic" href="#/catalogo">
                Ver catalogo
              </a>
              <a className="card-link" data-cursor="magnetic" href="#/guia">
                Ver guia de archivos
              </a>
            </>
          }
          className="home-foundation-panel"
          description="Esta fase organiza la web en paginas simples y listas para crecer hacia configuracion, carrito y checkout sin introducir dependencias pesadas."
          label="Base comercial"
          title="Un frente claro para ventas DTF por metro."
        />

        <article className="content-card home-quick-panel hover-lift" data-animate="panel" tabIndex={0}>
          <SectionHeader title="Accesos rapidos" />
          <ul className="placeholder-list">
            <li>
              <a className="card-link" href="#/catalogo">
                Ver catalogo
              </a>
            </li>
            <li>
              <a className="card-link" data-cursor="invert" href="#/producto/dtf">
                Abrir pagina DTF por metro
              </a>
            </li>
            <li>
              <a className="card-link" data-cursor="invert" href="#/guia">
                Revisar guia de archivos
              </a>
            </li>
          </ul>
        </article>
      </div>

      <section className="content-section" data-animate="reveal" data-motion="poster-stack" data-scroll-pin="dtf-narrative" data-scroll-scene="home-narrative">
        <div className="split-grid narrative-layout">
          <article className="content-card narrative-copy-panel" data-cursor="invert">
            <SectionHeader eyebrow="DTF por metro" title="Un bloque narrativo para conectar producto, archivo y entrega." />
            <p>
              Esta escena une el posicionamiento del producto con el avance operativo para que el scroll lea el servicio como una secuencia continua.
            </p>
          </article>

          <article className="content-card narrative-steps-panel" data-cursor="invert">
            <div className="narrative-progress-track">
              <div className="narrative-progress-fill" data-step-progress />
            </div>
            <div className="narrative-steps-list">
              {narrativeSteps.map((step, index) => (
                <div className={`narrative-step${index === 0 ? ' is-active' : ''}`} data-step-index={index} key={step.number}>
                  <div className="narrative-step-number">{step.number}</div>
                  <div className="narrative-step-body">
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="content-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="home-selected">
        <SectionHeader eyebrow="Selected work / services" title="Filas editoriales para activar interes rapido." />
        <div className="editorial-row-list">
          {selectedRows.map((row) => (
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

      <section className="negative-type-scene" data-animate="reveal" data-scroll-scene="home-negative">
        <p className="type-kicker">Negative text moment</p>
        <div className="negative-type-title type-mega type-condensed type-negative" data-cursor="fisheye">
          <span>NEGATIVE</span>
          <span>PRINT</span>
        </div>
        <p className="negative-type-copy">
          Un bloque corto para remarcar lectura editorial, contraste y direccion visual sin vaciar el flujo comercial.
        </p>
        <div className="image-placeholder image-placeholder-dtf-sheet" aria-label="Imagen placeholder: DTF sheet" data-cursor="invert">
          <span className="image-placeholder-label">Imagen placeholder: DTF sheet</span>
        </div>
      </section>

      <section className="manifesto-section" data-motion="manifesto" data-scroll-scene="home-manifesto">
        <div className="manifesto-grid">
          {['IMPRESION', 'CALLE', 'ARCHIVO', 'PRODUCCION', 'RIDAOS'].map((word, index) => (
            <span
              className={`manifesto-word${index === 1 || index === 3 ? ' is-sticker' : ''}${index === 4 ? ' type-negative' : ''}`}
              data-cursor={index === 4 ? 'fisheye' : 'invert'}
              key={word}
            >
              {word}
            </span>
          ))}
        </div>
      </section>

      <section className="marquee-section" data-motion="marquee" data-scroll-scene="home-marquee">
        <div className="marquee-track">
          <span className="marquee-word">DTF</span>
          <span className="marquee-word type-outline">VINILO</span>
          <span className="marquee-word type-negative">ROTULACION</span>
          <span className="marquee-word">TEXTIL</span>
          <span className="marquee-word type-outline">STICKERS</span>
        </div>
        <div className="marquee-track marquee-track-alt">
          <span className="marquee-word type-outline">DTF</span>
          <span className="marquee-word type-negative">VINILO</span>
          <span className="marquee-word">ROTULACION</span>
          <span className="marquee-word type-outline">TEXTIL</span>
          <span className="marquee-word">STICKERS</span>
        </div>
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="home-process">
        <SectionHeader eyebrow="Como funciona" title="Proceso base de pedido." />
        <ProcessSteps />
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="home-trust">
        <SectionHeader eyebrow="Confianza" title="Estructura operativa visible desde el inicio." />
        <TrustGrid />
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="home-faq">
        <SectionHeader eyebrow="FAQ" title="Preguntas rapidas antes de pedir." />
        <FAQSection items={homeFaq} />
      </section>

      <section className="cta-overload-section" data-motion="cta-overload" data-scroll-scene="home-overload-cta">
        <div className="overload-band" aria-hidden="true" />
        <p className="type-kicker">Final system overload</p>
        <div className="overload-title">
          <div className="overload-layer type-outline">ACTIVA TU PEDIDO</div>
          <div className="overload-layer type-negative">ACTIVA TU PEDIDO</div>
          <div className="overload-layer overload-layer-main">ACTIVA TU PEDIDO</div>
        </div>
        <p className="negative-type-copy">Configura, sube archivo y empuja el flujo comercial sin romper la lectura visual.</p>
        <a className="action-button action-link-button overload-button" data-cursor="magnetic" href="#/producto/dtf">
          Configurar DTF ahora
        </a>
      </section>
    </PageShell>
  )
}

export default Home
