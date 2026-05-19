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
        <p className="section-label">Resumen premium</p>
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
            <span>Envio mock</span>
            <strong>{formatCurrency(summary.shipping.price)}</strong>
          </div>
          <div className="summary-row">
            <span>Impuestos mock</span>
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
          <p className="section-label">Envio</p>
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
                <span>{methodId === 'pickup' ? 'Sin coste' : methodId === 'standard' ? '48-72h mock' : '24-48h mock'}</span>
              </button>
            ))}
          </div>
          <p className="catalog-result-caption">
            {summary.shipping.description} · {summary.shipping.eta}
          </p>
        </div>

        <div className="premium-cart-summary__group">
          <p className="section-label">Cupon mock</p>
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
            Simulacion local. No conecta cupones reales ni backend.
          </p>
        </div>

        <ul className="hint-list">
          <li>Los totales se actualizan al instante y se guardan en localStorage.</li>
          <li>La urgencia del configurador se refleja en cada linea, no en un checkout opaco.</li>
          <li>Los impuestos y el envio siguen siendo mock hasta la capa real.</li>
        </ul>
      </article>
    </div>
  )
}
