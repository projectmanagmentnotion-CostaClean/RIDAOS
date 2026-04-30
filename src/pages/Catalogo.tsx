import { useEffect, useRef } from 'react'
import CtaPanel from '../components/CtaPanel'
import MetricCard from '../components/MetricCard'
import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'
import {
  initCinematicScroll,
  initCursorAwareReveals,
  initUrbanTextMotion,
} from '../lib/animations'
import { getCatalogGroups, productCategories } from '../lib/products'

const filters = [
  'Todos',
  'Compra directa',
  'Presupuesto',
  'Textil',
  'Gran formato',
]

const catalogGroups = getCatalogGroups()

const selectedServices = [
  {
    index: '01',
    label: 'Flagship / Directo',
    title: 'DTF por metro con cockpit de pedido y preview.',
    detail: 'La via rapida para pasar del archivo al carrito sin romper el ritmo.',
    href: '#/producto/dtf',
    action: 'Abrir DTF',
    visual: 'dtf',
  },
  {
    index: '02',
    label: 'Textil / Catalogo',
    title: 'Textil con lectura directa para camisetas, polos y gorras.',
    detail: 'Estimaciones por volumen para lineas que salen a carrito sin backend.',
    href: '#/producto/textil',
    action: 'Abrir textil',
    visual: 'vinyl',
  },
  {
    index: '03',
    label: 'Service / Rotulacion',
    title: 'Rotulacion con bloque de silueta y rangos por tamano.',
    detail: 'Pensado para furgonetas, flotas y piezas de lectura urbana.',
    href: '#/servicios/rotulacion',
    action: 'Ver rangos',
    visual: 'vehicle',
  },
]

function Catalogo() {
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
    <PageShell className="catalog-page premium-page" ref={pageRef}>
      <SectionHeader
        className="catalog-hero premium-hero type-split"
        description="RidaosPrint organiza su oferta para que el producto estrella pueda venderse ya y el resto de lineas mantengan una presentacion comercial seria, clara y preparada para crecer."
        eyebrow="Catalogo pro"
        hero
        stickerWords={['directa', 'presupuesto']}
        title="Compra directa donde importa, presupuesto donde aporta valor."
        titleLines={['COMPRA DIRECTA', 'DONDE IMPORTA', 'PRESUPUESTO', 'DONDE APORTA VALOR']}
      />

      <section className="cinematic-scene catalog-cinematic-scene" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="catalog-cinematic">
        <div className="cinematic-scene-copy">
          <p className="eyebrow">Selected services / flagship</p>
          <div className="cinematic-word cinematic-word-compact type-condensed type-negative" data-cursor="fisheye">
            <span>PRINT</span>
            <span>LINES</span>
          </div>
        </div>
        <div className="cinematic-mask" data-cursor="invert">
          <div aria-label="Imagen placeholder: pliego DTF" className="cinematic-image image-placeholder image-placeholder-dtf-sheet">
            <span className="image-placeholder-label">Imagen placeholder: pliego DTF</span>
          </div>
        </div>
        <div className="scroll-bridge">
          <span className="bridge-chip">directo</span>
          <span className="bridge-chip">presupuesto</span>
          <span className="bridge-chip">textil</span>
          <span className="bridge-chip">gran formato</span>
        </div>
      </section>

      <CtaPanel
        actions={
          <div className="catalog-cta-row">
            <a className="action-button action-link-button" data-cursor="magnetic" href="#/producto/dtf">
              Configurar DTF
            </a>
            <a className="action-button action-button-muted action-link-button" data-cursor="magnetic" href="#/guia">
              Ver guia de archivos
            </a>
          </div>
        }
        className="featured-product-card"
        description="El flujo ya conecta configuracion, carrito y checkout local. Esta es la entrada mas rapida para un pedido repetible con precio visible."
        label="Producto destacado"
        title="DTF por metro listo para configurar."
      />

      <div className="split-grid catalog-visual-layout" data-animate="reveal" data-scroll-scene="catalog-flagship-visual">
        <article className="content-card catalog-flagship-visual" data-cursor="invert">
          <div aria-label="Imagen placeholder: pliego DTF" className="image-placeholder image-placeholder-dtf-sheet">
            <span className="image-placeholder-label">Imagen placeholder: pliego DTF</span>
          </div>
        </article>

        <article className="content-card catalog-flagship-visual" data-cursor="invert">
          <div aria-label="Imagen placeholder: escaparate vinilo" className="image-placeholder image-placeholder-storefront">
            <span className="image-placeholder-label">Imagen placeholder: escaparate vinilo</span>
          </div>
        </article>
      </div>

      <div className="featured-product-panel flagship-metrics" data-animate="panel" data-depth="0.05" data-parallax="soft" data-scroll-scene="catalog-featured">
        <MetricCard className="featured-metric hover-lift" label="Modalidad" note="Compra inmediata" value="Compra directa" />
        <MetricCard className="featured-metric hover-lift" label="Base actual" note="Tarifa de partida" value="14,50 EUR/metro" />
        <MetricCard className="featured-metric hover-lift" label="Estado" note="Venta habilitada" value="Configurador activo" />
      </div>

      <section className="catalog-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="catalog-categories">
        <SectionHeader eyebrow="Categorias" title="Lectura rapida de la oferta." />
        <div className="category-grid">
          {productCategories.map((category) => (
            <article className="content-card category-card hover-lift" data-animate="panel" key={category.key} tabIndex={0}>
              <p className="section-label">{category.label}</p>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="catalog-filters">
        <SectionHeader eyebrow="Filtros visuales" title="Navegacion preparada para evolucionar." />
        <div className="filter-pill-row" aria-label="Filtros visuales del catalogo">
          {filters.map((filter, index) => (
            <span className={`filter-pill${index === 0 ? ' is-active' : ''}`} key={filter}>
              {filter}
            </span>
          ))}
        </div>
      </section>

      <section className="catalog-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="catalog-selected">
        <SectionHeader eyebrow="Selected services" title="Filas de lectura rapida para compra o propuesta." />
        <div className="editorial-row-list">
          {selectedServices.map((row) => (
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

      <section className="catalog-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="catalog-products">
        <SectionHeader eyebrow="Productos" title="Lineas listas para presentar y convertir." />
        <div className="catalog-product-grid" data-motion="grid-shuffle">
          {[...catalogGroups.direct, ...catalogGroups.quote].map((product) => (
            <article
              className={`product-card catalog-product-card hover-lift${
                product.highlight ? ' flagship-product-card' : ''
              }`}
              data-animate="panel"
              data-cursor="fisheye"
              key={product.id}
              tabIndex={0}
            >
              {product.id === 'dtf-metro' ? (
                <div aria-label="Imagen placeholder: pliego DTF" className="image-placeholder image-placeholder-dtf-sheet card-image-placeholder">
                  <span className="image-placeholder-label">Imagen placeholder: pliego DTF</span>
                </div>
              ) : product.category === 'rotulacion' ? (
                <div aria-label="Imagen placeholder: rotulacion vehiculo" className="image-placeholder image-placeholder-vehicle card-image-placeholder">
                  <span className="image-placeholder-label">Imagen placeholder: rotulacion vehiculo</span>
                </div>
              ) : product.category === 'materiales' ? (
                <div aria-label="Imagen placeholder: escaparate vinilo" className="image-placeholder image-placeholder-storefront card-image-placeholder">
                  <span className="image-placeholder-label">Imagen placeholder: escaparate vinilo</span>
                </div>
              ) : product.category === 'accesorios' ? (
                <div aria-label="Imagen placeholder: sticker pack" className="image-placeholder image-placeholder-stickers card-image-placeholder">
                  <span className="image-placeholder-label">Imagen placeholder: sticker pack</span>
                </div>
              ) : product.category === 'carteleria' || product.category === 'neones' ? (
                <div aria-label="Imagen placeholder: lona publicitaria" className="image-placeholder image-placeholder-banner card-image-placeholder">
                  <span className="image-placeholder-label">Imagen placeholder: lona publicitaria</span>
                </div>
              ) : null}
              <div>
                <StatusBadge
                  status={
                    product.salesMode === 'quote'
                      ? 'quote'
                      : 'direct'
                  }
                >
                  {product.badge || (product.salesMode === 'quote' ? 'presupuesto' : 'compra directa')}
                </StatusBadge>
                <h2>{product.name}</h2>
              </div>
              <p>{product.description}</p>
              {product.highlight ? (
                <div className="flagship-product-meta">
                  <span>Compra directa</span>
                  <span>Previsualizacion incluida</span>
                  <span>Carrito listo</span>
                </div>
              ) : null}
              <div className="catalog-card-actions">
                <a
                  className="action-button action-link-button"
                  href={product.route || '#/presupuesto'}
                >
                  {product.salesMode === 'quote' ? 'Solicitar presupuesto' : 'Abrir producto'}
                </a>
                {product.salesMode === 'quote' ? (
                  <a className="card-link" data-cursor="invert" href={`#/presupuesto?service=${product.category}`}>
                    Solicitar presupuesto
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

export default Catalogo
