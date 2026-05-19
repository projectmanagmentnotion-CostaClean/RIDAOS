import { cartRecommendations } from '../data/cartRecommendations'
import { RecommendedProductCard } from '../../products/recommendations/RecommendedProductCard'

export function CartRecommendations() {
  return (
    <section className="commerce-recommendations">
      <div className="commerce-recommendations__header">
        <p className="section-label">Siguiente paso sugerido</p>
        <h2>Amplia el pedido sin romper el flujo.</h2>
      </div>
      <div className="commerce-recommendations__grid">
        {cartRecommendations.map((recommendation) => (
          <RecommendedProductCard
            description={recommendation.description}
            href={recommendation.href}
            key={recommendation.id}
            priceLabel={recommendation.priceLabel}
            tag={recommendation.tag}
            title={recommendation.title}
          />
        ))}
      </div>
    </section>
  )
}
