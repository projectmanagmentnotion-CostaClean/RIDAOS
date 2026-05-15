import { useMemo, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import { getContinueShoppingHref } from '../lib/navigation'
import { getOrderItemSummary } from '../lib/products'
import { submitOrder } from '../services/orderService'
import { upsertCustomerProfile } from '../services/customerService'
import { useCartStore } from '../store/useCartStore'
import { useUIStore } from '../store/useUIStore'
import type { CustomerData, SimulatedOrder } from '../types/ecommerce'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

function Checkout() {
  const cartItems = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
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

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.pricing.total, 0),
    [cartItems],
  )

  const handleFieldChange =
    (field: keyof CustomerData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomer((current) => ({ ...current, [field]: event.target.value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
      clearError('checkout')
    }

  const handleSubmit = async () => {
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

    if (Object.keys(nextErrors).length > 0) {
      setConfirmation(null)
      return
    }

    setLoading('checkout', true)
    clearError('checkout')

    try {
      const savedCustomer = await upsertCustomerProfile(customer)
      const order = await submitOrder({
        customer,
        customerId: savedCustomer.id,
        items: cartItems,
      })

      setConfirmation(order)
      clearCart()
      setErrors({})
      setCustomer({
        name: '',
        email: '',
        phone: '',
      })
    } catch {
      setError('checkout', 'No se pudo registrar el pedido en este momento. Intentalo de nuevo.')
      setConfirmation(null)
    } finally {
      setLoading('checkout', false)
    }
  }

  return (
    <section className="page">
      <div className="page-hero">
        <p className="eyebrow">Checkout</p>
        <h1>Confirma tu solicitud.</h1>
        <p>
          Revisa los datos del cliente, confirma el resumen y deja el pedido registrado para seguimiento.
        </p>
      </div>

      <div className="split-grid cart-layout">
        <article className="content-card">
          <p className="section-label">Datos del cliente</p>
          <div className="configurator-form">
            <label className="field-group" htmlFor="checkout-name">
              <span className="field-label">Nombre</span>
              <input
                className="form-input"
                id="checkout-name"
                onChange={handleFieldChange('name')}
                type="text"
                value={customer.name}
              />
              {errors.name ? <span className="field-error">{errors.name}</span> : null}
            </label>

            <label className="field-group" htmlFor="checkout-email">
              <span className="field-label">Email</span>
              <input
                className="form-input"
                id="checkout-email"
                onChange={handleFieldChange('email')}
                type="email"
                value={customer.email}
              />
              {errors.email ? <span className="field-error">{errors.email}</span> : null}
            </label>

            <label className="field-group" htmlFor="checkout-phone">
              <span className="field-label">Telefono</span>
              <input
                className="form-input"
                id="checkout-phone"
                onChange={handleFieldChange('phone')}
                type="tel"
                value={customer.phone}
              />
              {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
            </label>

            {errors.cart ? <p className="field-error">{errors.cart}</p> : null}
            {uiError ? <p className="field-error">{uiError}</p> : null}
            {loading ? <p className="inline-notice">Registrando tu solicitud...</p> : null}

            <div className="form-actions">
              <button className="action-button" disabled={loading} onClick={handleSubmit} type="button">
                Registrar pedido
              </button>
            </div>
          </div>
        </article>

        <div className="summary-stack">
          <article className="content-card">
            <p className="section-label">Resumen de carrito</p>
            {cartItems.length === 0 ? (
              <div className="empty-state">
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
                        <p>{getOrderItemSummary(item).join(' · ') || item.artwork.fileName}</p>
                      </div>
                      <strong>{formatCurrency(item.pricing.total)}</strong>
                    </div>
                  ))}
                </div>
                <div className="summary-list">
                  <div className="summary-row summary-row-total">
                    <span>Total</span>
                    <strong>{formatCurrency(cartTotal)}</strong>
                  </div>
                </div>
                <CommercialNotice className="checkout-notice" title="Condiciones del pedido" />
              </>
            )}
          </article>

          {confirmation ? (
            <article className="content-card success-card">
              <p className="section-label">Solicitud registrada</p>
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
                  <span>Email</span>
                  <strong>{confirmation.customer.email}</strong>
                </div>
                <div className="summary-row">
                  <span>Telefono</span>
                  <strong>{confirmation.customer.phone}</strong>
                </div>
                <div className="summary-row">
                  <span>Estado</span>
                  <strong>Recibido para revision</strong>
                </div>
                <div className="summary-row">
                  <span>Items</span>
                  <strong>{confirmation.items.length}</strong>
                </div>
                <div className="summary-row summary-row-total">
                  <span>Total</span>
                  <strong>{formatCurrency(confirmation.total)}</strong>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Checkout
