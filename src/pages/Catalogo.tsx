import { useEffect, useMemo, useRef } from 'react'
import CtaPanel from '../components/CtaPanel'
import ConversionTrustBlock from '../components/ConversionTrustBlock'
import MetricCard from '../components/MetricCard'
import PageShell from '../components/PageShell'
import SeoContentBlock from '../components/SeoContentBlock'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'
import { getContentByEntryId } from '../catalog/content/contentSelectors'
import {
  initCinematicScroll,
  initCursorAwareReveals,
  initUrbanTextMotion,
} from '../lib/animations'
import {
  getCatalogSections,
  getFeaturedProducts,
  getProductsForCatalogView,
  resolveCtaForEntry,
} from '../lib/catalogSelectors'
import { publicRoutes } from '../lib/navigation'
import { catalogCategories } from '../lib/products'
import type { CatalogEntry } from '../types/product'

function getPlaceholder(entry: CatalogEntry) {
  switch (entry.visualKey) {
    case 'dtf':
      return {
        className: 'image-placeholder image-placeholder-dtf-sheet card-image-placeholder',
        label: 'Imagen placeholder: pliego DTF',
      }
    case 'vehicle':
      return {
        className: 'image-placeholder image-placeholder-vehicle card-image-placeholder',
        label: 'Imagen placeholder: rotulacion vehiculo',
      }
    case 'storefront':
      return {
        className: 'image-placeholder image-placeholder-storefront card-image-placeholder',
        label: 'Imagen placeholder: escaparate vinilo',
      }
    case 'stickers':
      return {
        className: 'image-placeholder image-placeholder-stickers card-image-placeholder',
        label: 'Imagen placeholder: sticker pack',
      }
    case 'banner':
      return {
        className: 'image-placeholder image-placeholder-banner card-image-placeholder',
        label: 'Imagen placeholder: lona publicitaria',
      }
    case 'textile':
      return {
        className: 'image-placeholder image-placeholder-dtf-sheet card-image-placeholder',
        label: 'Imagen placeholder: textil estampado',
      }
    default:
      return null
  }
}

function getStatusCopy(entry: CatalogEntry) {
  if (entry.purchaseMode === 'quote') {
    return {
      status: 'quote' as const,
      label: entry.badge || 'presupuesto',
    }
  }

  if (entry.purchaseMode === 'hybrid') {
    return {
      status: 'quote' as const,
      label: entry.badge || 'hibrido',
    }
  }

  return {
    status: 'direct' as const,
    label: entry.badge || 'compra directa',
  }
}

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

  const featuredProduct = useMemo(() => getFeaturedProducts()[0], [])
  const catalogSections = useMemo(() => getCatalogSections(), [])
  const catalogEntries = useMemo(() => getProductsForCatalogView(), [])

  const selectedRows = useMemo(() => {
    const rotulacionEntry = catalogEntries.find((entry) => entry.category === 'rotulacion')
    const textilEntry = catalogEntries.find((entry) => entry.category === 'textil' && !entry.featured)

    return [featuredProduct, textilEntry, rotulacionEntry].filter(Boolean) as CatalogEntry[]
  }, [catalogEntries, featuredProduct])

  const categorySections = useMemo(
    () => catalogSections.filter((section) => section.key !== 'featured'),
    [catalogSections],
  )
  const featuredContent = useMemo(
    () => (featuredProduct ? getContentByEntryId(featuredProduct.id) : null),
    [featuredProduct],
  )

  return (
    <PageShell className="catalog-page premium-page" ref={pageRef}>
      <SectionHeader
        className="catalog-hero premium-hero type-split"
        description={featuredContent?.metaDescription ?? 'El catalogo marca la estructura completa del ecommerce: que se compra directo, que pasa a propuesta y que requiere archivo o comprobacion tecnica.'}
        eyebrow={featuredContent?.eyebrow ?? 'Catalogo pro'}
        hero
        stickerWords={['directa', 'presupuesto']}
        title="Compra directa donde importa, presupuesto donde aporta valor."
        titleLines={['COMPRA DIRECTA', 'DONDE IMPORTA', 'PRESUPUESTO', 'DONDE APORTA VALOR']}
      />

      <section className="cinematic-scene catalog-cinematic-scene" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="catalog-cinematic">
        <div className="cinematic-scene-copy">
          <p className="eyebrow">Catalog first / flagship</p>
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
          {categorySections.map((section) => (
            <span className="bridge-chip" key={section.key}>
              {section.title.toLowerCase()}
            </span>
          ))}
        </div>
      </section>

      {featuredProduct ? (
        <CtaPanel
          actions={
            <div className="catalog-cta-row">
              <a className="action-button action-link-button" data-cursor="magnetic" href={featuredProduct.route}>
                {featuredContent?.primaryCta.label ?? featuredProduct.cta.label}
              </a>
              <a className="action-button action-button-muted action-link-button" data-cursor="magnetic" href={publicRoutes.guia}>
                {featuredContent?.secondaryCta.label ?? 'Ver guia de archivos'}
              </a>
            </div>
          }
          className="featured-product-card"
          description={featuredContent?.intro ?? featuredProduct.shortDescription}
          label="Producto destacado"
          title={`${featuredProduct.name} listo para configurar.`}
        />
      ) : null}

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

      {featuredProduct ? (
        <div className="featured-product-panel flagship-metrics" data-animate="panel" data-depth="0.05" data-parallax="soft" data-scroll-scene="catalog-featured">
          <MetricCard className="featured-metric hover-lift" label="Modalidad" note="Fuente: catalogo central" value={featuredProduct.purchaseMode === 'direct' ? 'Compra directa' : 'Hibrido'} />
          <MetricCard className="featured-metric hover-lift" label="Base actual" note="Tarifa de partida" value={featuredProduct.basePrice ? `${featuredProduct.basePrice.toFixed(2)} EUR/metro` : 'Consultar'} />
          <MetricCard className="featured-metric hover-lift" label="Comprobacion" note="Lectura comercial" value={featuredProduct.manualReviewRequired ? 'Asistencia tecnica' : 'Flujo directo'} />
        </div>
      ) : null}

      {featuredProduct ? (
        <section className="content-section content-grid-two" data-animate="reveal" data-scroll-scene="catalog-content">
          <SeoContentBlock entryId={featuredProduct.id} title="Que hacemos desde el catalogo" />
          <SeoContentBlock entryId={featuredProduct.id} mode="useCases" title="Como leer esta oferta" />
        </section>
      ) : null}

      {featuredProduct ? (
        <section className="content-section content-grid-two" data-animate="reveal" data-scroll-scene="catalog-trust">
          <ConversionTrustBlock entryId={featuredProduct.id} title="Por que empezar por el catalogo" />
          <article className="content-card seo-content-block">
            <p className="section-label">Catalogo</p>
            <h3>Como se organiza la compra.</h3>
            <ul className="placeholder-list">
              <li>Compra directa para productos con precio claro y configuracion controlada.</li>
              <li>Presupuesto para proyectos donde material, medida o instalacion cambian el resultado final.</li>
              <li>Comprobacion tecnica cuando el archivo o el soporte lo exigen.</li>
            </ul>
          </article>
        </section>
      ) : null}

      <section className="catalog-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="catalog-categories">
        <SectionHeader eyebrow="Categorias" title="Lectura rapida de la oferta." />
        <div className="category-grid">
          {catalogCategories.map((category) => (
            <article className="content-card category-card hover-lift" data-animate="panel" key={category.key} tabIndex={0}>
              <p className="section-label">{category.label}</p>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="catalog-filters">
        <SectionHeader eyebrow="Estructura" title="Secciones derivadas del catalogo central." />
        <div className="filter-pill-row" aria-label="Secciones del catalogo">
          {categorySections.map((section, index) => (
            <span className={`filter-pill${index === 0 ? ' is-active' : ''}`} key={section.key}>
              {section.title}
            </span>
          ))}
        </div>
      </section>

      <section className="catalog-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="catalog-selected">
        <SectionHeader eyebrow="Servicios y productos" title="Filas derivadas del catalogo para compra o propuesta." />
        <div className="editorial-row-list">
          {selectedRows.map((entry, index) => (
            <a
              className={`editorial-row work-row editorial-visual-${entry.visualKey ?? 'dtf'}`}
              data-animate="row"
              data-cursor="fisheye"
              data-scroll-row
              href={entry.route}
              key={entry.id}
            >
              <div className="editorial-row-index">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className="editorial-row-slash">/</span>
              </div>
              <div className="editorial-row-main">
                <p className="section-label">{entry.purchaseMode === 'quote' ? 'Service / Presupuesto' : 'Producto / Directo'}</p>
                <h2 data-animate-heading>
                  {entry.name.split(' ').map((word) => (
                    <span className="heading-segment" key={`${entry.id}-${word}`}>
                      {word}
                    </span>
                  ))}
                </h2>
                <p>{entry.shortDescription}</p>
              </div>
              <div className="editorial-row-preview" aria-hidden="true">
                <div className="editorial-ghost-panel">
                  <div className="ghost-mark ghost-mark-primary" />
                  <div className="ghost-mark ghost-mark-secondary" />
                  <div className="ghost-mark ghost-mark-tertiary" />
                </div>
                <span className="editorial-row-arrow">{resolveCtaForEntry(entry).label}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {categorySections.map((section) => (
        <section className="catalog-section" data-animate="reveal" data-motion="poster-stack" data-scroll-scene={`catalog-section-${section.key}`} key={section.key}>
          <SectionHeader eyebrow={section.title} title={section.description} />
          <div className="catalog-product-grid" data-motion="grid-shuffle">
            {section.entries.map((entry) => {
              const statusCopy = getStatusCopy(entry)
              const placeholder = getPlaceholder(entry)
              const cta = resolveCtaForEntry(entry)

              return (
                <article
                  className={`product-card catalog-product-card hover-lift${
                    entry.featured ? ' flagship-product-card' : ''
                  }`}
                  data-animate="panel"
                  data-cursor="fisheye"
                  key={entry.id}
                  tabIndex={0}
                >
                  {placeholder ? (
                    <div aria-label={placeholder.label} className={placeholder.className}>
                      <span className="image-placeholder-label">{placeholder.label}</span>
                    </div>
                  ) : null}
                  <div>
                    <StatusBadge status={statusCopy.status}>{statusCopy.label}</StatusBadge>
                    <h2>{entry.name}</h2>
                  </div>
                  <p>{entry.description}</p>
                  {entry.featured ? (
                    <div className="flagship-product-meta">
                      <span>{entry.upload.required ? 'Archivo requerido' : 'Archivo opcional'}</span>
                      <span>{entry.manualReviewRequired ? 'Comprobacion tecnica' : 'Flujo directo'}</span>
                      <span>{entry.pricingMode}</span>
                    </div>
                  ) : null}
                  <div className="catalog-card-actions">
                    <a className="action-button action-link-button" href={cta.href}>
                      {cta.label}
                    </a>
                    {cta.type === 'request_quote' ? (
                      <a className="card-link" data-cursor="invert" href={cta.href}>
                        Solicitar presupuesto
                      </a>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </PageShell>
  )
}

export default Catalogo
