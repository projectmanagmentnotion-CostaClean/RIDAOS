import { RecommendedProductCard } from '../../recommendations/RecommendedProductCard'
import type { ProductRecommendationContent } from '../types/productExperience.types'

type ProductRecommendationsSectionProps = {
  items: ProductRecommendationContent[]
}

export function ProductRecommendationsSection({ items }: ProductRecommendationsSectionProps) {
  return (
    <section className="product-experience-recommendations" data-product-reveal>
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Recomendaciones</p>
          <h2>Lo siguiente que encaja con esta ficha.</h2>
        </div>
      </div>
      <div className="commerce-recommendations__grid">
        {items.map((item) => (
          <RecommendedProductCard
            description={item.description}
            href={item.href}
            key={item.id}
            priceLabel={item.priceLabel}
            tag={item.tag}
            title={item.title}
          />
        ))}
      </div>
    </section>
  )
}
