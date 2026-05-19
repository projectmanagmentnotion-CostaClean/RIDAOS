import { useState } from 'react'
import { footerContent, pricingContent } from '../content'
import { CartLineItem } from '../features/cart/components/CartLineItem'
import { CartRecommendations } from '../features/cart/components/CartRecommendations'
import { CartSummaryPanel } from '../features/cart/components/CartSummaryPanel'
import { useCartSummary } from '../features/cart/hooks/useCartSummary'
import { getContinueShoppingHref, publicRoutes } from '../lib/navigation'
import { useCartStore } from '../store/useCartStore'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(pricingContent.locale, {
    style: 'currency',
    currency: pricingContent.currency,
  }).format(value)

/**
 * Editable Zone: CART_DRAWER
 * Content: src/content/pricingContent.ts
 * Visual component: src/pages/Carrito.tsx
 */
function Carrito() {
  const items = useCartStore((state) => state.items)
  const couponCode = useCartStore((state) => state.couponCode)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity)
  const setCouponCode = useCartStore((state) => state.setCouponCode)
  const setShippingMethod = useCartStore((state) => state.setShippingMethod)
  const summary = useCartSummary()
  const [couponDraft, setCouponDraft] = useState(couponCode)

  return (
    <section className="page">
      <div className="page-hero">
        <p className="eyebrow">{pricingContent.cart.heroEyebrow}</p>
        <h1>{pricingContent.cart.heroTitle}</h1>
        <p>{pricingContent.cart.heroDescription}</p>
      </div>

      <div className="split-grid cart-layout cart-layout--premium">
        <article className="content-card">
          <div className="premium-panel-header">
            <div>
              <p className="section-label">Items</p>
              <h2>Lineas preparadas para produccion.</h2>
            </div>
            <span className="premium-caption">
              Persistencia local activa · {summary.lineCount} unidades en cesta
            </span>
          </div>

          {items.length === 0 ? (
            <div className="empty-state premium-empty-state">
              <p>{pricingContent.cart.emptyState}</p>
              <a className="card-link" href={getContinueShoppingHref()}>
                {pricingContent.cart.continueShoppingLabel}
              </a>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <CartLineItem
                  formatCurrency={formatCurrency}
                  item={item}
                  key={item.id}
                  onQuantityChange={(quantity) => updateItemQuantity(item.id, quantity)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          )}
        </article>

        <div className="summary-stack">
          <CartSummaryPanel
            couponDraft={couponDraft}
            formatCurrency={formatCurrency}
            onCouponApply={() => setCouponCode(couponDraft.trim().toUpperCase())}
            onCouponDraftChange={setCouponDraft}
            onShippingChange={setShippingMethod}
            summary={summary}
          />

          <article className="content-card premium-cart-cta" data-cursor-zone="conversion">
            <p className="section-label">Siguiente paso</p>
            <h3>Cierra el flujo sin perder contexto.</h3>
            <ul className="hint-list">
              <li>El checkout mock conserva envio, cupon y lectura del pedido.</li>
              <li>La comprobacion tecnica sigue siendo el paso previo a cualquier produccion real.</li>
              <li>{footerContent.description}</li>
            </ul>

            <div className="form-actions">
              <button
                className="action-button action-button-muted"
                disabled={items.length === 0}
                onClick={clearCart}
                type="button"
              >
                {pricingContent.cart.clearCartLabel}
              </button>
              <a
                className="action-button action-button-muted action-link-button"
                data-cursor="interactive"
                href={getContinueShoppingHref()}
              >
                {pricingContent.cart.keepShoppingLabel}
              </a>
              <a
                className={`action-button action-link-button${items.length === 0 ? ' is-disabled' : ''}`}
                data-cursor="sales"
                href={items.length === 0 ? publicRoutes.carrito : publicRoutes.checkout}
              >
                {pricingContent.cart.checkoutLabel}
              </a>
            </div>
          </article>
        </div>
      </div>

      <CartRecommendations />
    </section>
  )
}

export default Carrito
