import { useMemo } from 'react'
import CtaPanel from '../components/CtaPanel'
import ConversionTrustBlock from '../components/ConversionTrustBlock'
import MetricCard from '../components/MetricCard'
import MouseMotionVisual from '../components/MouseMotionVisual'
import PageShell from '../components/PageShell'
import SeoContentBlock from '../components/SeoContentBlock'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'
import { catalogContent } from '../content/catalogContent'
import { useCmsPreviewDocument } from '../features/cms-preview'
import {
  ExploreMoreSection,
  InternalLinkGrid,
  PopularLocalServicesSection,
  RelatedGuidesSection,
  discoverabilityHubs,
  localServiceHubs,
  relatedGuides,
} from '../features/discoverability'
import { catalogFamilies } from '../features/catalog/catalogFamilies'
import { getContentByEntryId } from '../catalog/content/contentSelectors'
import {
  getCatalogSections,
  getFeaturedProducts,
  resolveCtaForEntry,
} from '../lib/catalogSelectors'
import { getCatalogFamilyHref, getProductPageHref, getPublicCtaHref } from '../lib/navigation'
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

/**
 * Editable Zone: CATALOG_GRID
 * Content: src/content/catalogContent.ts
 * Visual component: src/pages/Catalogo.tsx
 */
function Catalogo() {
  const previewCatalogContent = useCmsPreviewDocument('src/content/catalogContent.ts', catalogContent)
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
        description={previewCatalogContent.hero.fallbackDescription}
        eyebrow={previewCatalogContent.hero.fallbackEyebrow}
        hero
        stickerWords={previewCatalogContent.hero.stickerWords}
        title={previewCatalogContent.hero.title}
        titleLines={previewCatalogContent.hero.titleLines}
      />

      {featuredProduct ? (
        <CtaPanel
          actions={
            <div className="catalog-cta-row">
              <a className="action-button action-link-button" href={featuredProduct.route}>
                {featuredContent?.primaryCta.label ?? featuredProduct.cta.label}
              </a>
              <a className="action-button action-button-muted action-link-button" href={getPublicCtaHref('guia')}>
                {featuredContent?.secondaryCta.label ?? previewCatalogContent.featured.secondaryCtaLabel}
              </a>
            </div>
          }
          className="featured-product-card"
          description={featuredProduct.shortDescription}
          label={previewCatalogContent.featured.label}
          title={`${featuredProduct.name} ${previewCatalogContent.featured.titleSuffix}`}
        />
      ) : null}

      <section className="content-section content-grid-two">
        <article className="content-card motion-card" data-cursor="interactive">
          <SectionHeader eyebrow={previewCatalogContent.visualPanel.eyebrow} title={previewCatalogContent.visualPanel.title} />
          <p>{previewCatalogContent.visualPanel.description}</p>
          <MouseMotionVisual variant="catalog" />
        </article>
        <article className="content-card seo-content-block">
          <p className="section-label">{previewCatalogContent.flowPanel.label}</p>
          <h3>{previewCatalogContent.flowPanel.title}</h3>
          <ul className="detail-list">
            {previewCatalogContent.flowPanel.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      </section>

      {featuredProduct ? (
        <div className="featured-product-panel flagship-metrics">
          <MetricCard className="featured-metric hover-lift" label="Modalidad" note="Como avanza el pedido" value={featuredProduct.purchaseMode === 'direct' ? 'Compra directa' : 'Configuracion guiada'} />
          <MetricCard className="featured-metric hover-lift" label="Precio orientativo" note="Tarifa de partida" value={featuredProduct.basePrice ? `${featuredProduct.basePrice.toFixed(2)} EUR/metro` : 'Consultar'} />
          <MetricCard className="featured-metric hover-lift" label="Revision" note="Antes de fabricar" value={featuredProduct.manualReviewRequired ? 'Comprobacion tecnica' : 'Flujo directo'} />
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
              <li>Compra directa para productos con precio, formato y cantidad ya definidos.</li>
              <li>Propuesta personalizada cuando material, medida o instalacion cambian el resultado final.</li>
              <li>Comprobacion tecnica cuando el archivo, el soporte o el acabado lo exigen.</li>
            </ul>
          </article>
        </section>
      ) : null}

      <section className="catalog-section">
        <SectionHeader eyebrow={previewCatalogContent.categorySection.eyebrow} title={previewCatalogContent.categorySection.title} />
        <div className="category-grid">
          {catalogFamilies.map((family) => (
            <article className="content-card category-card hover-lift" data-cursor="interactive" key={family.id} tabIndex={0}>
              <p className="section-label">{family.title}</p>
              <p>{family.shortDescription}</p>
              <div className="catalog-card-meta">
                <span>{family.productsCount}</span>
                <span>{family.tags.slice(0, 2).join(' · ')}</span>
              </div>
              <a className="card-link" href={family.href}>
                Ver categoria
              </a>
              <a className="card-link" href={family.primaryProductHref}>
                Ir al producto principal
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section">
        <SectionHeader eyebrow="Familias principales" title="Elige primero la familia. Configura despues el producto." />
        <div className="catalog-product-grid">
          {catalogFamilies
            .filter((family) => family.featured)
            .map((family) => (
              <article className="product-card catalog-product-card hover-lift" data-cursor="interactive" key={family.id} tabIndex={0}>
                <div>
                  <StatusBadge status="quote">familia destacada</StatusBadge>
                  <h2>{family.title}</h2>
                </div>
                <p>{family.shortDescription}</p>
                <div className="catalog-card-meta">
                  <span>{family.productsCount}</span>
                  <span>{family.tags.join(' · ')}</span>
                </div>
                <div className="catalog-card-actions">
                  <a className="action-button action-link-button" href={family.href}>
                    Ver familia
                  </a>
                  <a className="card-link" href={family.primaryProductHref}>
                    Configurar producto
                  </a>
                </div>
              </article>
            ))}
        </div>
      </section>

      <ExploreMoreSection hubs={discoverabilityHubs.filter((hub) => ['rotulacion', 'dti', 'pegatinas', 'empresas'].includes(hub.id))} />

      <PopularLocalServicesSection hubs={localServiceHubs} />

      <RelatedGuidesSection
        items={relatedGuides.filter((guide) =>
          ['guide-dti-vs-dtf', 'guide-wrap-price', 'guide-window-vinyl', 'guide-bleed-cutline'].includes(guide.id),
        )}
      />

      <InternalLinkGrid
        items={[
          { id: 'cat-link-rot', title: 'Rotulacion comercial', description: 'Vehiculos, escaparates y flotas comerciales.', href: getCatalogFamilyHref('rotulacion'), tag: 'Hub' },
          { id: 'cat-link-dtf', title: 'DTI por metro', description: 'Produccion textil y demanda DTI resuelta con flujo claro.', href: getProductPageHref('dtf'), tag: 'Hub' },
          { id: 'cat-link-guide', title: 'Guia de archivos', description: 'Prepara el archivo antes de configurar o pedir.', href: '#/guia', tag: 'Guide' },
        ]}
        title="Entradas principales para navegar mejor"
      />

      <section className="catalog-section">
        <SectionHeader eyebrow={previewCatalogContent.productsSection.eyebrow} title={previewCatalogContent.productsSection.title} />
        {categorySections.map((section) => (
          <div className="catalog-section-block" key={section.key}>
            <SectionHeader eyebrow={section.title} title={section.description} />
            <div className="catalog-product-grid">
              {section.entries.map((entry) => {
                const statusCopy = getStatusCopy(entry)
                const cta = resolveCtaForEntry(entry)
                const primaryAction =
                  entry.purchaseMode === 'quote'
                    ? { href: entry.route, label: 'Ver servicio' }
                    : cta

                return (
                  <article
                    className={`product-card catalog-product-card hover-lift${
                      entry.featured ? ' flagship-product-card' : ''
                    }`}
                    data-cursor-zone="conversion"
                    key={entry.id}
                    tabIndex={0}
                  >
                    <div>
                      <StatusBadge status={statusCopy.status}>{statusCopy.label}</StatusBadge>
                      <h2>{entry.name}</h2>
                    </div>
                    <p>{entry.shortDescription}</p>
                    {entry.featured ? (
                      <div className="flagship-product-meta">
                        <span>{entry.upload.required ? 'Archivo requerido' : 'Archivo opcional'}</span>
                        <span>{entry.manualReviewRequired ? 'Comprobacion tecnica' : 'Flujo directo'}</span>
                        <span>{entry.pricingMode === 'volume' ? 'Precio por volumen' : entry.pricingMode === 'm2' ? 'Precio por superficie' : entry.pricingMode === 'range' ? 'Rango orientativo' : 'Precio directo'}</span>
                      </div>
                    ) : null}
                    <div className="catalog-card-meta">
                      <span>{entry.upload.required ? 'Archivo requerido' : 'Archivo opcional'}</span>
                      <span>{entry.productionTime ?? 'Plazo segun comprobacion y carga de trabajo'}</span>
                    </div>
                    <div className="catalog-card-actions">
                      <a className="action-button action-link-button" data-cursor="sales" href={primaryAction.href}>
                        {primaryAction.label}
                      </a>
                      {entry.route !== primaryAction.href ? (
                        <a className="card-link" href={entry.route}>
                          Ver detalles
                        </a>
                      ) : null}
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
