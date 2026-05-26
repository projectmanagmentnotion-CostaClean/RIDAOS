import { useEffect, useMemo, useRef } from 'react'
import PageShell from '../../components/PageShell'
import SectionHeader from '../../components/SectionHeader'
import { getProductById } from '../../lib/products'
import { getPublicCtaHref } from '../../lib/navigation'
import type { CatalogEntry } from '../../types/product'
import { getCatalogFamilyById, type CatalogFamilyId } from './catalogFamilies'
import { getCategoryContent } from './categoryContent'
import { initStorefrontRevealAnimations } from '../motion/revealAnimations'

type CategoryLandingPageProps = {
  familyId: CatalogFamilyId
}

function FeaturedProductCard({ entry }: { entry: CatalogEntry }) {
  return (
    <article className="product-card catalog-product-card hover-lift" data-animate="panel" data-cursor="interactive">
      <div>
        <p className="section-label">{entry.category}</p>
        <h2>{entry.name}</h2>
      </div>
      <p>{entry.shortDescription}</p>
      <div className="catalog-card-meta">
        <span>{entry.productionTime ?? 'Revision tecnica antes de producir'}</span>
        <span>{entry.purchaseMode === 'quote' ? 'Propuesta personalizada' : 'Configuracion guiada'}</span>
      </div>
      <div className="catalog-card-actions">
        <a className="action-button action-link-button" href={entry.route}>
          {entry.purchaseMode === 'quote' ? 'Ver servicio' : 'Configurar producto'}
        </a>
      </div>
    </article>
  )
}

export function CategoryLandingPage({ familyId }: CategoryLandingPageProps) {
  const pageRef = useRef<HTMLElement | null>(null)
  const family = getCatalogFamilyById(familyId)
  const content = getCategoryContent(familyId)
  const featuredProducts = useMemo(
    () => content.featuredProducts.map((productId) => getProductById(productId)).filter(Boolean) as CatalogEntry[],
    [content.featuredProducts],
  )

  useEffect(() => {
    if (!pageRef.current) {
      return
    }

    const context = initStorefrontRevealAnimations(pageRef.current)
    return () => context.revert()
  }, [])

  if (!family) {
    return null
  }

  return (
    <PageShell className="catalog-page premium-page" ref={pageRef}>
      <SectionHeader
        className="catalog-hero premium-hero type-split"
        description={content.description}
        eyebrow={content.eyebrow}
        hero
        stickerWords={[family.title.split(' ')[0].toLowerCase(), 'ridaosprint']}
        title={content.title}
      />

      <section className="content-section content-grid-two" data-animate="reveal">
        <article
          className="content-card motion-card"
          data-cursor="interactive"
          style={{
            borderColor: content.accentColor,
          }}
        >
          <p className="section-label">Categoria</p>
          <h3>{family.title}</h3>
          <p>{family.shortDescription}</p>
          <div className="catalog-card-meta">
            {family.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="catalog-cta-row">
            <a className="action-button action-link-button" href={content.primaryCtaHref}>
              {content.primaryCtaLabel}
            </a>
            <a className="action-button action-button-muted action-link-button" href={content.secondaryCtaHref}>
              {content.secondaryCtaLabel}
            </a>
          </div>
        </article>

        <article className="content-card seo-content-block">
          <p className="section-label">Donde encaja</p>
          <h3>Una landing para entender la familia antes de entrar a configurar.</h3>
          <ul className="detail-list">
            {content.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="content-section content-grid-two" data-animate="reveal">
        <article className="content-card seo-content-block">
          <p className="section-label">Usos habituales</p>
          <h3>Escenarios de compra y produccion.</h3>
          <ul className="detail-list">
            {content.useCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </article>

        <article className="content-card seo-content-block">
          <p className="section-label">Siguiente paso</p>
          <h3>Configura el producto principal o sigue navegando.</h3>
          <ul className="detail-list">
            <li>El configurador completo vive en la pagina especifica del producto.</li>
            <li>Puedes subir archivo desde la PDP o revisar la guia tecnica antes de pedir.</li>
            <li>La propuesta personalizada sigue disponible cuando el proyecto lo necesita.</li>
          </ul>
          <div className="catalog-cta-row">
            <a className="card-link" href={content.primaryCtaHref}>
              Ir al producto principal
            </a>
            <a className="card-link" href={getPublicCtaHref('catalogo')}>
              Volver al catalogo
            </a>
          </div>
        </article>
      </section>

      <section className="catalog-section" data-animate="reveal">
        <SectionHeader eyebrow="Productos destacados" title="Elige por donde empezar." />
        <div className="catalog-product-grid">
          {featuredProducts.map((entry) => (
            <FeaturedProductCard entry={entry} key={entry.id} />
          ))}
        </div>
      </section>
    </PageShell>
  )
}

export default CategoryLandingPage
