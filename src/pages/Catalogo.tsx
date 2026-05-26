import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import CtaPanel from '../components/CtaPanel'
import ConversionTrustBlock from '../components/ConversionTrustBlock'
import MetricCard from '../components/MetricCard'
import PageShell from '../components/PageShell'
import SeoContentBlock from '../components/SeoContentBlock'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'
import { getContentByEntryId } from '../catalog/content/contentSelectors'
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
import { brandTokens } from '../features/brand/brandTokens'
import { catalogFamilies } from '../features/catalog/catalogFamilies'
import StorefrontFamilyVisual from '../features/catalog/components/StorefrontFamilyVisual'
import { initStorefrontRevealAnimations } from '../features/motion/revealAnimations'
import { getCatalogSections, getFeaturedProducts, resolveCtaForEntry } from '../lib/catalogSelectors'
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
  const pageRef = useRef<HTMLElement | null>(null)
  const previewCatalogContent = useCmsPreviewDocument('src/content/catalogContent.ts', catalogContent)
  const featuredProduct = useMemo(() => getFeaturedProducts()[0], [])
  const featuredFamilies = useMemo(() => catalogFamilies.filter((family) => family.featured), [])
  const secondaryFamilies = useMemo(() => catalogFamilies.filter((family) => !family.featured), [])
  const catalogSections = useMemo(() => getCatalogSections(), [])
  const categorySections = useMemo(
    () => catalogSections.filter((section) => section.key !== 'featured'),
    [catalogSections],
  )
  const featuredContent = useMemo(
    () => (featuredProduct ? getContentByEntryId(featuredProduct.id) : null),
    [featuredProduct],
  )

  useEffect(() => {
    if (!pageRef.current) {
      return
    }

    const context = initStorefrontRevealAnimations(pageRef.current)
    return () => context.revert()
  }, [])

  return (
    <PageShell className="catalog-page premium-page" ref={pageRef}>
      <section className="storefront-catalog-hero" data-animate="hero">
        <div className="storefront-catalog-hero__copy">
          <SectionHeader
            className="catalog-hero premium-hero type-split storefront-catalog-hero__header"
            description={previewCatalogContent.hero.fallbackDescription}
            eyebrow={previewCatalogContent.hero.fallbackEyebrow}
            hero
            stickerWords={previewCatalogContent.hero.stickerWords}
            title={previewCatalogContent.hero.title}
            titleLines={previewCatalogContent.hero.titleLines}
          />
          <div className="storefront-catalog-hero__actions">
            <a className="action-button action-link-button" href={getPublicCtaHref('catalogo')}>
              Explorar productos
            </a>
            <a className="action-button action-button-muted action-link-button" href={getProductPageHref('dtf')}>
              Configurar DTI
            </a>
          </div>
          <div className="storefront-catalog-hero__chips">
            <span>DTI por metro</span>
            <span>Rotulacion comercial</span>
            <span>Textil y papeleria</span>
          </div>
        </div>
        <StorefrontFamilyVisual
          accent={brandTokens.neonGreen}
          className="storefront-catalog-hero__visual"
          eyebrow="RidaosPrint"
          image="/assets/cinematic/wrap/wrap-van-side-transparent.webp"
          tags={['DTI', 'Rotulacion', 'Produccion visual']}
          title="Produccion visual para marcas que quieren verse distintas."
          variant="hero"
        />
      </section>

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

      <section className="storefront-catalog-intro content-section content-grid-two">
        <article className="content-card motion-card storefront-copy-card" data-cursor="interactive">
          <SectionHeader
            eyebrow={previewCatalogContent.visualPanel.eyebrow}
            title={previewCatalogContent.visualPanel.title}
          />
          <p>{previewCatalogContent.visualPanel.description}</p>
          <div className="storefront-inline-tags">
            <span>Compra directa</span>
            <span>Revision tecnica</span>
            <span>Produccion e instalacion</span>
          </div>
        </article>
        <article className="content-card seo-content-block storefront-flow-card">
          <p className="section-label">{previewCatalogContent.flowPanel.label}</p>
          <h3>{previewCatalogContent.flowPanel.title}</h3>
          <ol className="storefront-process-list">
            {previewCatalogContent.flowPanel.bullets.map((bullet, index) => (
              <li key={bullet}>
                <span>{`${index + 1}`.padStart(2, '0')}</span>
                <p>{bullet}</p>
              </li>
            ))}
          </ol>
        </article>
      </section>

      {featuredProduct ? (
        <div className="featured-product-panel flagship-metrics">
          <MetricCard
            className="featured-metric hover-lift"
            label="Modalidad"
            note="Como avanza el pedido"
            value={featuredProduct.purchaseMode === 'direct' ? 'Compra directa' : 'Configuracion guiada'}
          />
          <MetricCard
            className="featured-metric hover-lift"
            label="Precio orientativo"
            note="Tarifa de partida"
            value={featuredProduct.basePrice ? `${featuredProduct.basePrice.toFixed(2)} EUR/metro` : 'Consultar'}
          />
          <MetricCard
            className="featured-metric hover-lift"
            label="Revision"
            note="Antes de fabricar"
            value={featuredProduct.manualReviewRequired ? 'Comprobacion tecnica' : 'Flujo directo'}
          />
        </div>
      ) : null}

      {featuredProduct ? (
        <section className="content-section content-grid-two">
          <SeoContentBlock entryId={featuredProduct.id} title="Que resuelves desde aqui" />
          <SeoContentBlock entryId={featuredProduct.id} mode="useCases" title="Donde suele encajar mejor" />
        </section>
      ) : null}

      {featuredProduct ? (
        <section className="content-section content-grid-two">
          <ConversionTrustBlock entryId={featuredProduct.id} title="Por que empezar por el catalogo" />
          <article className="content-card seo-content-block">
            <p className="section-label">Flujo comercial</p>
            <h3>Como pasas de explorar a producir.</h3>
            <ul className="detail-list">
              <li>Explora la familia correcta antes de entrar a configurar.</li>
              <li>Compra directa cuando el producto ya tiene formato, material y acabado resueltos.</li>
              <li>Propuesta guiada cuando medidas, instalacion o cobertura cambian el proyecto.</li>
            </ul>
          </article>
        </section>
      ) : null}

      <section className="catalog-section storefront-family-section">
        <SectionHeader
          eyebrow={previewCatalogContent.categorySection.eyebrow}
          title={previewCatalogContent.categorySection.title}
        />
        <div className="storefront-family-grid storefront-family-grid--featured">
          {featuredFamilies.map((family) => (
            <article
              className="storefront-family-card storefront-family-card--featured hover-lift"
              data-animate="panel"
              data-cursor="interactive"
              key={family.id}
              style={{ '--storefront-accent': family.accent } as CSSProperties}
              tabIndex={0}
            >
              <StorefrontFamilyVisual
                accent={family.accent}
                className="storefront-family-card__visual"
                eyebrow={family.productsCount}
                image={family.image}
                tags={family.tags}
                title={family.title}
                variant="feature"
              />
              <div className="storefront-family-card__content">
                <p className="section-label">Familia destacada</p>
                <h3>{family.title}</h3>
                <p>{family.shortDescription}</p>
                <div className="storefront-inline-tags">
                  {family.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="catalog-card-actions">
                  <a className="action-button action-link-button" href={family.href}>
                    Ver categoria
                  </a>
                  <a className="card-link" href={family.primaryProductHref}>
                    Ir al producto principal
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="storefront-family-grid storefront-family-grid--secondary">
          {secondaryFamilies.map((family) => (
            <article
              className="storefront-family-card storefront-family-card--secondary hover-lift"
              data-animate="panel"
              data-cursor="interactive"
              key={family.id}
              style={{ '--storefront-accent': family.accent } as CSSProperties}
              tabIndex={0}
            >
              <StorefrontFamilyVisual
                accent={family.accent}
                className="storefront-family-card__visual storefront-family-card__visual--compact"
                eyebrow={family.productsCount}
                image={family.image}
                tags={family.tags}
                title={family.title}
              />
              <div className="storefront-family-card__content">
                <p className="section-label">{family.title}</p>
                <p>{family.shortDescription}</p>
                <div className="catalog-card-meta">
                  <span>{family.productsCount}</span>
                  <span>{family.tags.slice(0, 2).join(' · ')}</span>
                </div>
                <div className="catalog-card-actions">
                  <a className="card-link" href={family.href}>
                    Explorar familia
                  </a>
                  <a className="card-link" href={family.primaryProductHref}>
                    Producto principal
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section storefront-spotlight-section">
        <SectionHeader eyebrow="Entradas principales" title="Empieza por lo que mas mueve taller y calle." />
        <div className="storefront-spotlight-grid">
          {catalogFamilies
            .filter((family) => ['dti', 'rotulacion', 'tarjetas'].includes(family.id))
            .map((family) => (
              <article
                className="storefront-spotlight-card hover-lift"
                data-animate="panel"
                data-cursor="interactive"
                key={family.id}
                style={{ '--storefront-accent': family.accent } as CSSProperties}
                tabIndex={0}
              >
                <StorefrontFamilyVisual accent={family.accent} image={family.image} tags={family.tags} title={family.title} />
                <div className="storefront-spotlight-card__content">
                  <StatusBadge status={family.id === 'rotulacion' ? 'quote' : 'direct'}>
                    {family.id === 'rotulacion' ? 'Servicio guiado' : 'Compra directa'}
                  </StatusBadge>
                  <h3>{family.title}</h3>
                  <p>{family.shortDescription}</p>
                  <div className="catalog-card-actions">
                    <a className="action-button action-link-button" href={family.primaryProductHref}>
                      {family.id === 'rotulacion' ? 'Pedir propuesta' : 'Configurar producto'}
                    </a>
                    <a className="card-link" href={family.href}>
                      Ver familia
                    </a>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>

      <ExploreMoreSection
        hubs={discoverabilityHubs.filter((hub) => ['rotulacion', 'dti', 'pegatinas', 'empresas'].includes(hub.id))}
      />

      <PopularLocalServicesSection hubs={localServiceHubs} />

      <RelatedGuidesSection
        items={relatedGuides.filter((guide) =>
          ['guide-dti-vs-dtf', 'guide-wrap-price', 'guide-window-vinyl', 'guide-bleed-cutline'].includes(guide.id),
        )}
      />

      <InternalLinkGrid
        items={[
          {
            id: 'cat-link-rot',
            title: 'Rotulacion comercial',
            description: 'Vehiculos, escaparates y flotas comerciales.',
            href: getCatalogFamilyHref('rotulacion'),
            tag: 'Hub',
          },
          {
            id: 'cat-link-dtf',
            title: 'DTI por metro',
            description: 'Produccion textil y demanda DTI resuelta con flujo claro.',
            href: getProductPageHref('dtf'),
            tag: 'Hub',
          },
          {
            id: 'cat-link-guide',
            title: 'Guia de archivos',
            description: 'Prepara el archivo antes de configurar o pedir.',
            href: '#/guia',
            tag: 'Guide',
          },
        ]}
        title="Entradas principales para navegar mejor"
      />

      <section className="catalog-section">
        <SectionHeader
          eyebrow={previewCatalogContent.productsSection.eyebrow}
          title={previewCatalogContent.productsSection.title}
        />
        {categorySections.map((section) => (
          <div className="catalog-section-block" key={section.key}>
            <SectionHeader eyebrow={section.title} title={section.description} />
            <div className="catalog-product-grid">
              {section.entries.map((entry) => {
                const statusCopy = getStatusCopy(entry)
                const cta = resolveCtaForEntry(entry)
                const primaryAction =
                  entry.purchaseMode === 'quote' ? { href: entry.route, label: 'Ver servicio' } : cta

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
                        <span>
                          {entry.pricingMode === 'volume'
                            ? 'Precio por volumen'
                            : entry.pricingMode === 'm2'
                              ? 'Precio por superficie'
                              : entry.pricingMode === 'range'
                                ? 'Rango orientativo'
                                : 'Precio directo'}
                        </span>
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

      <section className="storefront-final-cta" data-animate="reveal">
        <div className="storefront-final-cta__copy">
          <p className="section-label">Siguiente paso</p>
          <h2>Empieza por DTI o entra en la familia que mejor encaje con tu proyecto.</h2>
          <p>
            Si ya tienes claro el producto, entra a su pagina especifica y configura solo lo que importa. Si todavia
            estas comparando, el catalogo te deja leer la oferta sin perderte en opciones demasiado pronto.
          </p>
        </div>
        <div className="storefront-final-cta__actions">
          <a className="action-button action-link-button" href={getProductPageHref('dtf')}>
            Configurar DTI por metro
          </a>
          <a className="action-button action-button-muted action-link-button" href={getCatalogFamilyHref('rotulacion')}>
            Ver rotulacion
          </a>
        </div>
      </section>
    </PageShell>
  )
}

export default Catalogo
