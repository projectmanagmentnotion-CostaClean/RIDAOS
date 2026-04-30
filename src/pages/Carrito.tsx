import { useMemo } from 'react'
import { getOrderItemSummary } from '../lib/products'
import { useCartStore } from '../store/useCartStore'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

function Carrito() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)

  const cartTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.pricing.total, 0),
    [items],
  )

  return (
    <section className="page">
      <div className="page-hero">
        <p className="eyebrow">Carrito</p>
        <h1>Resumen local del pedido antes del checkout.</h1>
        <p>
          Esta cesta usa persistencia local con arquitectura global para mantener los items configurados antes del backend real.
        </p>
      </div>

      <div className="split-grid cart-layout">
        <article className="content-card">
          <p className="section-label">Items</p>
          {items.length === 0 ? (
            <div className="empty-state">
              <p>El carrito esta vacio por ahora.</p>
              <a className="card-link" href="#/catalogo">
                Volver al catalogo
              </a>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item-card" key={item.id}>
                  <div className="cart-item-header">
                    <div>
                      <p className="section-label">{item.productName}</p>
                      <h3>{formatCurrency(item.pricing.total)}</h3>
                    </div>
                    <button
                      className="action-button action-button-muted action-button-small"
                      onClick={() => removeItem(item.id)}
                      type="button"
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="cart-meta-grid">
                    {getOrderItemSummary(item).map((line) => (
                      <p key={`${item.id}-${line}`}>{line}</p>
                    ))}
                  </div>

                  <div className="summary-list compact-summary">
                    <div className="summary-row">
                      <span>Precio base</span>
                      <strong>
                        {formatCurrency(item.pricing.unitPrice)}
                        {item.pricing.unitLabel ? `/${item.pricing.unitLabel}` : ''}
                      </strong>
                    </div>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <strong>{formatCurrency(item.pricing.subtotal)}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Extras</span>
                      <strong>{formatCurrency(item.pricing.extras)}</strong>
                    </div>
                  </div>

                  {item.configuration.notes ? <p className="cart-notes">Notas: {item.configuration.notes}</p> : null}
                </article>
              ))}
            </div>
          )}
        </article>

        <article className="content-card">
          <p className="section-label">Resumen</p>
          <div className="summary-list">
            <div className="summary-row">
              <span>Items</span>
              <strong>{items.length}</strong>
            </div>
            <div className="summary-row summary-row-total">
              <span>Total</span>
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="action-button action-button-muted"
              disabled={items.length === 0}
              onClick={clearCart}
              type="button"
            >
              Vaciar carrito
            </button>
            <a
              className={`action-button action-link-button${items.length === 0 ? ' is-disabled' : ''}`}
              href={items.length === 0 ? '#/carrito' : '#/checkout'}
            >
              Ir a checkout
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Carrito
