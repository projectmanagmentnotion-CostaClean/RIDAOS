import { useMemo, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import { pricingContent } from '../content'
import { checkoutSteps, paymentMocks } from '../features/cart/data/checkoutMock'
import { CheckoutStepRail } from '../features/cart/components/CheckoutStepRail'
import { useCartSummary } from '../features/cart/hooks/useCartSummary'
import type { CartSummary } from '../features/cart/types/cart.types'
import { multiplyOrderItemPricing } from '../features/cart/utils/cartPricing'
import { OrderLifecycleTimeline } from '../features/orders/components/OrderLifecycleTimeline'
import { getContinueShoppingHref } from '../lib/navigation'
import { getOrderItemSummary } from '../lib/products'
import { upsertCustomerProfile } from '../services/customerService'
import { submitOrder } from '../services/orderService'
import { useCartStore } from '../store/useCartStore'
import { useUIStore } from '../store/useUIStore'
import type { CustomerData, SimulatedOrder } from '../types/ecommerce'

type CheckoutStep = (typeof checkoutSteps)[number]['id']
type PaymentMockId = (typeof paymentMocks)[number]['id']

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(pricingContent.locale, {
    style: 'currency',
    currency: pricingContent.currency,
  }).format(value)

/**
 * Editable Zone: CHECKOUT_MOCK_FLOW
 * Content: src/content/pricingContent.ts
 * Visual component: src/pages/Checkout.tsx
 */
function Checkout() {
  const cartItems = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const summary = useCartSummary()
  const [step, setStep] = useState<CheckoutStep>('review')
  const [selectedPayment, setSelectedPayment] = useState<PaymentMockId>(paymentMocks[0].id)
  const [submittedSummary, setSubmittedSummary] = useState<CartSummary | null>(null)
  const [customer, setCustomer] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData | 'cart', string>>>({})
  const [confirmation, setConfirmation] = useState<SimulatedOrder | null>(null)
  const loading = useUIStore((state) => state.loadingScopes.checkout ?? false)
  const uiError = useUIStore((state) => state.errorScopes.checkout)
  const setLoading = useUIStore((state) => state.setLoading)
  const setError = useUIStore((state) => state.setError)
  const clearError = useUIStore((state) => state.clearError)

  const canAdvance = useMemo(() => cartItems.length > 0, [cartItems.length])

  const handleFieldChange =
    (field: keyof CustomerData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomer((current) => ({ ...current, [field]: event.target.value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
      clearError('checkout')
    }

  const validateCustomer = () => {
    const nextErrors: Partial<Record<keyof CustomerData | 'cart', string>> = {}

    if (!customer.name.trim()) {
      nextErrors.name = 'Introduce el nombre del cliente.'
    }

    if (!customer.email.trim()) {
      nextErrors.email = 'Introduce un email de contacto.'
    }

    if (!customer.phone.trim()) {
      nextErrors.phone = 'Introduce un telefono de contacto.'
    }

    if (cartItems.length === 0) {
      nextErrors.cart = 'Necesitas al menos un articulo en el carrito para continuar.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateCustomer()) {
      setConfirmation(null)
      return
    }

    setLoading('checkout', true)
    clearError('checkout')

    try {
      const savedCustomer = await upsertCustomerProfile(customer)
      const normalizedItems = cartItems.map(multiplyOrderItemPricing)
      setSubmittedSummary(summary)
      const order = await submitOrder({
        customer,
        customerId: savedCustomer.id,
        items: normalizedItems,
      })

      setConfirmation(order)
      clearCart()
      setErrors({})
      setCustomer({
        name: '',
        email: '',
        phone: '',
      })
      setStep('success')
    } catch {
      setError('checkout', 'No se pudo registrar el pedido en este momento. Intentalo de nuevo.')
      setConfirmation(null)
    } finally {
      setLoading('checkout', false)
    }
  }

  const activeSummary = submittedSummary ?? summary

  return (
    <section className="page">
      <div className="page-hero">
        <p className="eyebrow">{pricingContent.checkout.heroEyebrow}</p>
        <h1>{pricingContent.checkout.heroTitle}</h1>
        <p>{pricingContent.checkout.heroDescription}</p>
      </div>

      <CheckoutStepRail activeStep={step} steps={checkoutSteps} />

      <div className="split-grid cart-layout checkout-layout--premium">
        <article className="content-card" data-cursor-zone="conversion">
          {step === 'review' ? (
            <>
              <p className="section-label">Revision final</p>
              <h2>{pricingContent.checkout.reviewTitle}</h2>
              {cartItems.length === 0 ? (
                <div className="empty-state premium-empty-state">
                  <p>Tu carrito esta vacio. Anade productos antes de pasar a este paso.</p>
                  <a className="card-link" href={getContinueShoppingHref()}>
                    Volver al catalogo
                  </a>
                </div>
              ) : (
                <>
                  <div className="checkout-list">
                    {cartItems.map((item) => (
                      <div className="checkout-item" key={item.id}>
                        <div>
                          <h3>{item.productName}</h3>
                          <p>{getOrderItemSummary(item).join(' | ') || item.artwork.fileName}</p>
                        </div>
                        <strong>{formatCurrency(item.pricing.total * (item.lineQuantity ?? 1))}</strong>
                      </div>
                    ))}
                  </div>
                  <ul className="hint-list">
                    <li>Revisa ahora cantidades, urgencias y extras antes de pedir envio.</li>
                    <li>Revisamos archivo, entrega y acabados antes de cerrar la produccion.</li>
                    <li>La comprobacion tecnica se mantiene como primer punto de control del pedido.</li>
                  </ul>
                  <div className="form-actions">
                    <button className="action-button" disabled={!canAdvance} onClick={() => setStep('shipping')} type="button">
                      Continuar a envio
                    </button>
                  </div>
                </>
              )}
            </>
          ) : null}

          {step === 'shipping' ? (
            <>
              <p className="section-label">Entrega</p>
              <h2>{pricingContent.checkout.shippingTitle}</h2>
              <div className="configurator-form">
                <label className="field-group" htmlFor="checkout-name">
                  <span className="field-label">Nombre</span>
                  <input className="form-input" id="checkout-name" onChange={handleFieldChange('name')} type="text" value={customer.name} />
                  {errors.name ? <span className="field-error">{errors.name}</span> : null}
                </label>
                <label className="field-group" htmlFor="checkout-email">
                  <span className="field-label">Email</span>
                  <input className="form-input" id="checkout-email" onChange={handleFieldChange('email')} type="email" value={customer.email} />
                  {errors.email ? <span className="field-error">{errors.email}</span> : null}
                </label>
                <label className="field-group" htmlFor="checkout-phone">
                  <span className="field-label">Telefono</span>
                  <input className="form-input" id="checkout-phone" onChange={handleFieldChange('phone')} type="tel" value={customer.phone} />
                  {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
                </label>
                {errors.cart ? <p className="field-error">{errors.cart}</p> : null}
                <ul className="hint-list">
                  <li>Usamos estos datos para preparar la entrega y la confirmacion del pedido.</li>
                  <li>El metodo de entrega elegido en el carrito se mantiene aqui para que no pierdas contexto.</li>
                </ul>
                <div className="form-actions">
                  <button className="action-button action-button-muted" onClick={() => setStep('review')} type="button">
                    Volver a revision
                  </button>
                  <button className="action-button" onClick={() => setStep('payment')} type="button">
                    Continuar a pago
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {step === 'payment' ? (
            <>
              <p className="section-label">Pago</p>
              <h2>{pricingContent.checkout.paymentTitle}</h2>
              <div className="shipping-option-list payment-option-list">
                {paymentMocks.map((payment) => (
                  <button
                    className={`shipping-option${selectedPayment === payment.id ? ' is-active' : ''}`}
                    key={payment.id}
                    onClick={() => setSelectedPayment(payment.id)}
                    type="button"
                  >
                    <strong>{payment.label}</strong>
                    <span>{payment.description}</span>
                  </button>
                ))}
              </div>
              {uiError ? <p className="field-error">{uiError}</p> : null}
              {loading ? <p className="inline-notice">Registrando tu solicitud...</p> : null}
              <CommercialNotice className="checkout-notice" title="Condiciones del pedido" />
              <div className="form-actions">
                <button className="action-button action-button-muted" onClick={() => setStep('shipping')} type="button">
                  Volver a envio
                </button>
                <button className="action-button" data-cursor="sales" disabled={loading} onClick={handleSubmit} type="button">
                  Registrar pedido
                </button>
              </div>
            </>
          ) : null}

          {step === 'success' && confirmation ? (
            <>
              <p className="section-label">Confirmacion</p>
              <h2>{pricingContent.checkout.successTitle}</h2>
              <div className="summary-list">
                <div className="summary-row">
                  <span>Pedido</span>
                  <strong>{confirmation.id}</strong>
                </div>
                <div className="summary-row">
                  <span>Cliente</span>
                  <strong>{confirmation.customer.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Metodo de pago</span>
                  <strong>{paymentMocks.find((item) => item.id === selectedPayment)?.label}</strong>
                </div>
                <div className="summary-row summary-row-total">
                  <span>Total registrado</span>
                  <strong>{formatCurrency(confirmation.total)}</strong>
                </div>
              </div>
              <OrderLifecycleTimeline status={confirmation.status} />
            </>
          ) : null}
        </article>

        <div className="summary-stack">
          <article className="content-card premium-cart-summary" data-cursor-zone="conversion">
            <p className="section-label">Resumen de checkout</p>
            <div className="summary-list">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(activeSummary.subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>Entrega</span>
                <strong>{formatCurrency(activeSummary.shipping.price)}</strong>
              </div>
              <div className="summary-row">
                <span>Impuestos</span>
                <strong>{formatCurrency(activeSummary.taxes)}</strong>
              </div>
              <div className="summary-row">
                <span>Cupon</span>
                <strong>{activeSummary.coupon ? activeSummary.coupon.code : 'Sin cupon'}</strong>
              </div>
              <div className="summary-row summary-row-total">
                <span>Total checkout</span>
                <strong>{formatCurrency(activeSummary.total)}</strong>
              </div>
            </div>
            <ul className="hint-list">
              <li>El total mantiene entrega, impuestos y descuentos visibles antes de confirmar.</li>
              <li>La comprobacion tecnica sigue separada para proteger archivo, medidas y acabados.</li>
              <li>Tu pedido queda registrado con el mismo resumen que has revisado durante el proceso.</li>
            </ul>
          </article>

          {confirmation ? (
            <article className="content-card success-card" data-cursor-zone="conversion">
              <p className="section-label">Siguiente lectura</p>
              <p>
                El pedido ya aparece en tu historial con su estado inicial de revision de archivo y preparacion.
              </p>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Checkout
