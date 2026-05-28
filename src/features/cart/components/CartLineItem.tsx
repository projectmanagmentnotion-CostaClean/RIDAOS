import { getOrderItemSummary } from '../../../lib/products'
import type { CartItem } from '../../../types/ecommerce'
import { getCartItemLineExtras, getCartItemLineSubtotal, getCartItemLineTotal, getItemLineQuantity } from '../utils/cartPricing'
import { QuantityStepper } from './QuantityStepper'

type CartLineItemProps = {
  item: CartItem
  formatCurrency: (value: number) => string
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartLineItem({
  item,
  formatCurrency,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  const quantity = getItemLineQuantity(item)

  return (
    <article className="cart-item-card premium-cart-item" data-cursor="interest">
      <div className="cart-item-header">
        <div>
          <p className="section-label">{item.productName}</p>
          <h3>{formatCurrency(getCartItemLineTotal(item))}</h3>
        </div>
        <button
          className="action-button action-button-muted action-button-small"
          onClick={onRemove}
          type="button"
        >
          Quitar
        </button>
      </div>

      <div className="premium-cart-item__topline">
        <QuantityStepper onChange={onQuantityChange} value={quantity} />
        <div className="premium-pill-row">
          {item.configuration.urgency ? (
            <span className="premium-pill">
              {item.configuration.urgency === 'express' ? 'Urgente' : 'Normal'}
            </span>
          ) : null}
          {item.configuration.turnaroundPreference ? (
            <span className="premium-pill">{item.configuration.turnaroundPreference}</span>
          ) : null}
        </div>
      </div>

      <div className="cart-meta-grid">
        {getOrderItemSummary(item).map((line) => (
          <p key={`${item.id}-${line}`}>{line}</p>
        ))}
      </div>

      <div className="summary-list compact-summary">
        <div className="summary-row">
          <span>Archivo</span>
          <strong>{item.artwork.fileName}</strong>
        </div>
        <div className="summary-row">
          <span>Revision</span>
          <strong>{item.artwork.previewSummary ? item.artwork.previewSummary.workflowStatus : 'Comprobacion tecnica incluida'}</strong>
        </div>
      </div>

      {item.artwork.previewSummary?.recommendations.length ? (
        <div className="summary-list compact-summary">
          <div className="summary-row">
            <span>Guia de archivo</span>
            <strong>{item.artwork.previewSummary.estimatedPhysicalSizeLabel}</strong>
          </div>
          <p className="cart-notes">{item.artwork.previewSummary.recommendations[0]?.message}</p>
        </div>
      ) : null}

      {item.configuration.extras?.length ? (
        <div className="summary-list compact-summary">
          <div className="summary-row">
            <span>Extras activos</span>
            <strong>{item.configuration.extras.join(' · ')}</strong>
          </div>
        </div>
      ) : null}

      <div className="summary-list compact-summary">
        <div className="summary-row">
          <span>Base</span>
          <strong>{formatCurrency(item.pricing.unitPrice)}</strong>
        </div>
        <div className="summary-row">
          <span>Subtotal linea</span>
          <strong>{formatCurrency(getCartItemLineSubtotal(item))}</strong>
        </div>
        <div className="summary-row">
          <span>Extras linea</span>
          <strong>{formatCurrency(getCartItemLineExtras(item))}</strong>
        </div>
      </div>

      {item.configuration.notes ? <p className="cart-notes">Notas: {item.configuration.notes}</p> : null}
    </article>
  )
}
