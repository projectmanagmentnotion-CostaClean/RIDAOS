import { useMemo } from 'react'
import CtaPanel from '../components/CtaPanel'
import ConversionTrustBlock from '../components/ConversionTrustBlock'
import MetricCard from '../components/MetricCard'
import PageShell from '../components/PageShell'
import SeoContentBlock from '../components/SeoContentBlock'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'
import { getContentByEntryId } from '../catalog/content/contentSelectors'
import {
  getCatalogSections,
  getFeaturedProducts,
  resolveCtaForEntry,
} from '../lib/catalogSelectors'
import { getPublicCtaHref } from '../lib/navigation'
import { catalogCategories } from '../lib/products'
import type { CatalogEntry } from '../types/product'

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
  const featuredProduct = useMemo(() => getFeaturedProducts()[0], [])
  const catalogSections = useMemo(() => getCatalogSections(), [])
  const categorySections = useMemo(
    () => catalogSections.filter((section) => section.key !== 'featured'),
    [catalogSections],
  )
  const featuredContent = useMemo(
    () => (featuredProduct ? getContentByEntryId(featuredProduct.id) : null),
    [featuredProduct],
  )

  return (
    <PageShell className="catalog-page premium-page">
      <SectionHeader
        className="catalog-hero premium-hero type-split"
        description={featuredContent?.metaDescription ?? 'El catalogo marca la estructura completa del ecommerce: que se compra directo, que pasa a propuesta y que requiere archivo o comprobacion tecnica.'}
        eyebrow={featuredContent?.eyebrow ?? 'Catalogo pro'}
        hero
        stickerWords={['directa', 'presupuesto']}
        title="Compra directa donde importa, presupuesto donde aporta valor."
        titleLines={['COMPRA DIRECTA', 'DONDE IMPORTA', 'PRESUPUESTO', 'DONDE APORTA VALOR']}
      />

      {featuredProduct ? (
        <CtaPanel
          actions={
            <div className="catalog-cta-row">
              <a className="action-button action-link-button" href={featuredProduct.route}>
                {featuredContent?.primaryCta.label ?? featuredProduct.cta.label}
              </a>
              <a className="action-button action-button-muted action-link-button" href={getPublicCtaHref('guia')}>
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

      {featuredProduct ? (
        <div className="featured-product-panel flagship-metrics">
          <MetricCard className="featured-metric hover-lift" label="Modalidad" note="Fuente: catalogo central" value={featuredProduct.purchaseMode === 'direct' ? 'Compra directa' : 'Hibrido'} />
          <MetricCard className="featured-metric hover-lift" label="Base actual" note="Tarifa de partida" value={featuredProduct.basePrice ? `${featuredProduct.basePrice.toFixed(2)} EUR/metro` : 'Consultar'} />
          <MetricCard className="featured-metric hover-lift" label="Comprobacion" note="Lectura comercial" value={featuredProduct.manualReviewRequired ? 'Asistencia tecnica' : 'Flujo directo'} />
        </div>
      ) : null}

      {featuredProduct ? (
        <section className="content-section content-grid-two">
          <SeoContentBlock entryId={featuredProduct.id} title="Que hacemos desde el catalogo" />
          <SeoContentBlock entryId={featuredProduct.id} mode="useCases" title="Como leer esta oferta" />
        </section>
      ) : null}

      {featuredProduct ? (
        <section className="content-section content-grid-two">
          <ConversionTrustBlock entryId={featuredProduct.id} title="Por que empezar por el catalogo" />
          <article className="content-card seo-content-block">
            <p className="section-label">Catalogo</p>
            <h3>Como se organiza la compra.</h3>
            <ul className="detail-list">
              <li>Compra directa para productos con precio claro y configuracion controlada.</li>
              <li>Presupuesto para proyectos donde material, medida o instalacion cambian el resultado final.</li>
              <li>Comprobacion tecnica cuando el archivo o el soporte lo exigen.</li>
            </ul>
          </article>
        </section>
      ) : null}

      <section className="catalog-section">
        <SectionHeader eyebrow="Categorias" title="Lectura rapida de la oferta." />
        <div className="category-grid">
          {catalogCategories.map((category) => (
            <article className="content-card category-card hover-lift" key={category.key} tabIndex={0}>
              <p className="section-label">{category.label}</p>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section">
        <SectionHeader eyebrow="Servicios y productos" title="Compra o solicita propuesta desde el catalogo." />
        {categorySections.map((section) => (
          <div className="catalog-section-block" key={section.key}>
            <SectionHeader eyebrow={section.title} title={section.description} />
            <div className="catalog-product-grid">
              {section.entries.map((entry) => {
                const statusCopy = getStatusCopy(entry)
                const cta = resolveCtaForEntry(entry)

                return (
                  <article
                    className={`product-card catalog-product-card hover-lift${
                      entry.featured ? ' flagship-product-card' : ''
                    }`}
                    key={entry.id}
                    tabIndex={0}
                  >
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
                        <a className="card-link" href={cta.href}>
                          Solicitar presupuesto
                        </a>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  )
}

export default Catalogo
