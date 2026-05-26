import type { CartSummary } from '../types/cart.types'

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
            <span>Subtotal</span>
            <strong>{formatCurrency(summary.subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Entrega</span>
            <strong>{formatCurrency(summary.shipping.price)}</strong>
          </div>
          <div className="summary-row">
            <span>Impuestos</span>
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
          <div className="shipping-option-list">
            {['pickup', 'standard', 'express'].map((methodId) => (
              <button
                className={`shipping-option${summary.shipping.id === methodId ? ' is-active' : ''}`}
                key={methodId}
                onClick={() => onShippingChange(methodId)}
                type="button"
              >
                <strong>
                  {methodId === 'pickup'
                    ? 'Recogida'
                    : methodId === 'standard'
                      ? 'Envio peninsula'
                      : 'Envio prioritario'}
                </strong>
                <span>{methodId === 'pickup' ? 'Sin coste' : methodId === 'standard' ? '48-72 h estimadas' : '24-48 h estimadas'}</span>
              </button>
            ))}
          </div>
          <p className="catalog-result-caption">
            {summary.shipping.description} · {summary.shipping.eta}
          </p>
        </div>

        <div className="premium-cart-summary__group">
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
        </div>

        <ul className="hint-list">
          <li>Los totales se actualizan al instante para que no pierdas contexto durante la compra.</li>
          <li>La urgencia del configurador se refleja en cada linea, no en un checkout opaco.</li>
          <li>Entrega, impuestos y descuentos se mantienen visibles antes de confirmar la solicitud.</li>
        </ul>
      </article>
    </div>
  )
}
