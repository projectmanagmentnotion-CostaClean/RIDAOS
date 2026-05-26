import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import PageShell from '../../components/PageShell'
import SectionHeader from '../../components/SectionHeader'
import { getProductById } from '../../lib/products'
import { getPublicCtaHref } from '../../lib/navigation'
import type { CatalogEntry } from '../../types/product'
import { initStorefrontRevealAnimations } from '../motion/revealAnimations'
import StorefrontFamilyVisual from './components/StorefrontFamilyVisual'
import { getCatalogFamilyById, type CatalogFamilyId } from './catalogFamilies'
import { getCategoryContent } from './categoryContent'

type CategoryLandingPageProps = {
  familyId: CatalogFamilyId
}

function FeaturedProductCard({ entry }: { entry: CatalogEntry }) {
  return (
    <article className="storefront-category-product-card product-card hover-lift" data-animate="panel" data-cursor="interactive">
      <div>
        <p className="section-label">{entry.category}</p>
        <h3>{entry.name}</h3>
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
    <PageShell className="catalog-page premium-page storefront-category-page" ref={pageRef}>
      <section
        className="storefront-category-hero"
        data-animate="hero"
        style={{ '--storefront-accent': content.accentColor } as CSSProperties}
      >
        <div className="storefront-category-hero__copy">
          <SectionHeader
            className="catalog-hero premium-hero type-split storefront-category-hero__header"
            description={content.description}
            eyebrow={content.eyebrow}
            hero
            stickerWords={[family.title.split(' ')[0].toLowerCase(), 'ridaosprint']}
            title={content.title}
          />
          <div className="storefront-inline-tags">
            {family.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="storefront-catalog-hero__actions">
            <a className="action-button action-link-button" href={content.primaryCtaHref}>
              {content.primaryCtaLabel}
            </a>
            <a className="action-button action-button-muted action-link-button" href={content.secondaryCtaHref}>
              {content.secondaryCtaLabel}
            </a>
          </div>
        </div>
        <StorefrontFamilyVisual
          accent={content.accentColor}
          className="storefront-category-hero__visual"
          eyebrow={family.productsCount}
          image={content.heroImage}
          tags={family.tags}
          title={family.title}
          variant="hero"
        />
      </section>

      <section className="storefront-category-benefits" data-animate="reveal">
        <SectionHeader eyebrow="Beneficios" title="Una familia pensada para decidir con mas rapidez y mejor criterio." />
        <div className="storefront-benefits-grid">
          {content.benefits.map((benefit) => (
            <article className="content-card storefront-benefit-card hover-lift" data-animate="panel" key={benefit}>
              <span className="storefront-benefit-card__accent" />
              <p>{benefit}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section content-grid-two storefront-category-usecases" data-animate="reveal">
        <article className="content-card seo-content-block">
          <p className="section-label">Usos habituales</p>
          <h3>Donde esta familia suele funcionar mejor.</h3>
          <div className="storefront-chip-grid">
            {content.useCases.map((useCase) => (
              <span className="storefront-chip" key={useCase}>
                {useCase}
              </span>
            ))}
          </div>
        </article>
        <article className="content-card seo-content-block">
          <p className="section-label">Preparacion</p>
          <h3>Explora la familia y entra despues al producto correcto.</h3>
          <ul className="detail-list">
            <li>Lee la categoria para comparar materiales, usos y alcance.</li>
            <li>Entra al producto principal cuando ya quieras configurar medida, acabado o cantidad.</li>
            <li>Sube tu archivo dentro de la PDP o revisa la guia tecnica antes de cerrar la solicitud.</li>
          </ul>
        </article>
      </section>

      <section className="storefront-category-primary" data-animate="reveal">
        <article
          className="storefront-category-primary__card"
          style={{ '--storefront-accent': content.accentColor } as CSSProperties}
        >
          <StorefrontFamilyVisual
            accent={content.accentColor}
            className="storefront-category-primary__visual"
            eyebrow="Producto principal"
            image={content.heroImage}
            tags={family.tags}
            title={family.title}
            variant="feature"
          />
          <div className="storefront-category-primary__content">
            <p className="section-label">Producto principal</p>
            <h3>La compra completa vive dentro de la pagina especifica del producto.</h3>
            <p>
              Desde aqui entiendes la familia. En la pagina del producto eliges configuracion, subes archivo y avanzas
              con revision tecnica cuando hace falta.
            </p>
            <div className="catalog-cta-row">
              <a className="action-button action-link-button" href={content.primaryCtaHref}>
                {content.primaryCtaLabel}
              </a>
              <a className="card-link" href={getPublicCtaHref('catalogo')}>
                Volver al catalogo
              </a>
            </div>
          </div>
        </article>
      </section>

      <section className="catalog-section" data-animate="reveal">
        <SectionHeader eyebrow="Productos destacados" title="Entradas recomendadas dentro de esta familia." />
        <div className="catalog-product-grid">
          {featuredProducts.map((entry) => (
            <FeaturedProductCard entry={entry} key={entry.id} />
          ))}
        </div>
      </section>

      <section className="storefront-final-cta storefront-final-cta--category" data-animate="reveal">
        <div className="storefront-final-cta__copy">
          <p className="section-label">Siguiente paso</p>
          <h2>Cuando ya tengas clara la familia, entra al producto y configura con calma.</h2>
          <p>
            La categoria te ayuda a entender el enfoque. La pagina del producto te deja decidir lo que afecta al
            resultado final.
          </p>
        </div>
        <div className="storefront-final-cta__actions">
          <a className="action-button action-link-button" href={content.primaryCtaHref}>
            {content.primaryCtaLabel}
          </a>
          <a className="action-button action-button-muted action-link-button" href={content.secondaryCtaHref}>
            {content.secondaryCtaLabel}
          </a>
        </div>
      </section>
    </PageShell>
  )
}

export default CategoryLandingPage
