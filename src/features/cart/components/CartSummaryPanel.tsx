import type { CartSummary } from '../types/cart.types'
import { getCartShippingMethods } from '../utils/cartPricing'

type CartSummaryPanelProps = {
  summary: CartSummary
  formatCurrency: (value: number) => string
  couponDraft: string
  onCouponDraftChange: (value: string) => void
  onCouponApply: () => void
  onShippingChange: (methodId: string) => void
}

export function CartSummaryPanel({
  summary,
  formatCurrency,
  couponDraft,
  onCouponDraftChange,
  onCouponApply,
  onShippingChange,
}: CartSummaryPanelProps) {
  const vatAlreadyIncluded = summary.items.length > 0 && summary.items.every((item) => item.pricing.vatIncluded) && summary.shipping.vatIncluded

  return (
    <div className="summary-stack">
      <article className="content-card premium-cart-summary" data-cursor-zone="conversion">
        <p className="section-label">Resumen del pedido</p>
        <div className="summary-list">
          <div className="summary-row">
            <span>Lineas</span>
            <strong>{summary.itemCount}</strong>
          </div>
          <div className="summary-row">
            <span>Unidades de carrito</span>
            <strong>{summary.lineCount}</strong>
          </div>
          <div className="summary-row">
            <span>{vatAlreadyIncluded ? 'Productos · IVA incluido' : 'Subtotal productos'}</span>
            <strong>{formatCurrency(summary.subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Entrega</span>
            <strong>{formatCurrency(summary.shipping.price)}</strong>
          </div>
          <div className="summary-row">
            <span>{vatAlreadyIncluded ? 'IVA incluido' : 'IVA incluido + adicional'}</span>
            <strong>{formatCurrency(summary.taxes)}</strong>
          </div>
          <div className="summary-row">
            <span>Cupon</span>
            <strong>
              {summary.coupon ? `- ${formatCurrency(summary.couponDiscount)}` : 'Sin aplicar'}
            </strong>
          </div>
          <div className="summary-row summary-row-total">
            <span>Total estimado</span>
            <strong>{formatCurrency(summary.total)}</strong>
          </div>
        </div>

        <div className="premium-cart-summary__group">
          <p className="section-label">Entrega</p>
          {summary.items.length > 0 ? (
            <>
              <div className="shipping-option-list">
                {getCartShippingMethods(summary.items).map((method) => (
                  <button
                    className={`shipping-option${summary.shipping.id === method.id ? ' is-active' : ''}`}
                    key={method.id}
                    onClick={() => onShippingChange(method.id)}
                    type="button"
                  >
                    <strong>{method.label}</strong>
                    <span>{formatCurrency(method.price)}{method.vatIncluded ? ' · IVA incluido' : ''}</span>
                  </button>
                ))}
              </div>
              <p className="catalog-result-caption">
                {summary.shipping.description} · {summary.shipping.eta}
              </p>
            </>
          ) : (
            <p className="catalog-result-caption">{summary.shipping.description}</p>
          )}
        </div>

        {summary.items.length > 0 ? <div className="premium-cart-summary__group">
          <p className="section-label">Cupon</p>
          <div className="coupon-row">
            <input
              className="form-input"
              onChange={(event) => onCouponDraftChange(event.target.value)}
              placeholder="RIDAOS10 o MUESTRA5"
              type="text"
              value={couponDraft}
            />
            <button className="action-button action-button-muted" onClick={onCouponApply} type="button">
              Aplicar
            </button>
          </div>
          <p className="catalog-result-caption">
            Aplicamos el codigo sobre este resumen para que puedas revisar el pedido con claridad.
          </p>
        </div> : null}

        <ul className="hint-list">
          <li>Los totales se actualizan al instante para que no pierdas contexto durante la compra.</li>
          <li>La urgencia del configurador se refleja en cada linea, no en un checkout opaco.</li>
          <li>Entrega, impuestos y descuentos se mantienen visibles antes de confirmar la solicitud.</li>
        </ul>
      </article>
    </div>
  )
}
