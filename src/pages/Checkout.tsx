import { useEffect, useMemo, useRef, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import { pricingContent } from '../content'
import { checkoutSteps, paymentMocks } from '../features/cart/data/checkoutMock'
import { CheckoutStepRail } from '../features/cart/components/CheckoutStepRail'
import { useCartSummary } from '../features/cart/hooks/useCartSummary'
import type { CartSummary } from '../features/cart/types/cart.types'
import { useLiveToast } from '../features/live-feedback'
import { initStorefrontRevealAnimations } from '../features/motion/revealAnimations'
import { multiplyOrderItemPricing } from '../features/cart/utils/cartPricing'
import { OrderLifecycleTimeline } from '../features/orders/components/OrderLifecycleTimeline'
import { formatArtworkAcceptanceStatus } from '../features/artwork-upload/utils/formatArtworkAcceptance'
import { getContinueShoppingHref } from '../lib/navigation'
import { getOrderItemSummary } from '../lib/products'
import { upsertCustomerProfile } from '../services/customerService'
import { submitOrder } from '../services/orderService'
import { useCartStore } from '../store/useCartStore'
import { useUIStore } from '../store/useUIStore'
import type { CartItem, CustomerData, SimulatedOrder } from '../types/ecommerce'
import { callDtiFunction, dtiBackendConfigured, dtiIdempotencyKey, dtiOrderKey, dtiRecoveryKey, dtiStripeTestConfigured, finishDtiOrderAttempt, forgetDtiArtwork, getDtiArtwork, hasOnlyOneDtiLine, isDtiCart, rememberDtiArtwork } from '../features/dtf/dtiCheckout'
import { DtiStripePayment } from '../features/dtf/DtiStripePayment'
import { usePublicationPolicy } from '../config/publicationContext'
import { isPublicationRouteAllowed } from '../config/publicationPolicy.mjs'

type CheckoutStep = (typeof checkoutSteps)[number]['id']
type PaymentMockId = (typeof paymentMocks)[number]['id']
type CheckoutErrorKey = keyof CustomerData | 'cart' | 'artwork'
type DtiAddress = { line1: string; city: string; province: string; postalCode: string }
type DtiOrderAccess = { orderId: string; token: string; itemId: string }

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(pricingContent.locale, {
    style: 'currency',
    currency: pricingContent.currency,
  }).format(value)

const dtiOrderStatusLabels: Record<string, string> = {
  awaiting_artwork: 'Esperando el archivo',
  awaiting_artwork_review: 'Revisión inicial del archivo',
  awaiting_manual_timeline: 'Plazo bajo consulta',
  awaiting_payment: 'Pendiente de pago',
  paid_awaiting_technical_review: 'Pago confirmado · revisión técnica pendiente',
  queued_for_production: 'Aprobado · pendiente de producción',
  in_production: 'En producción',
  quality_control: 'Control de calidad',
  rework_required: 'Ajuste de producción',
  preparing_dispatch: 'Preparando el pedido',
  ready_for_dispatch: 'Listo para envío',
  dispatched: 'Despachado',
  ready_for_pickup: 'Listo para recoger en Barcelona',
  picked_up: 'Recogido',
  cancelled: 'Cancelado',
}

function needsArtworkApproval(item: CartItem) {
  const acceptance = item.artwork.acceptance
  return Boolean(acceptance?.acceptanceRequired && !acceptance.clientAccepted && !acceptance.designerHelpRequested)
}

/**
 * Editable Zone: CHECKOUT_MOCK_FLOW
 * Content: src/content/pricingContent.ts
 * Visual component: src/pages/Checkout.tsx
 */
function Checkout() {
  const publicationPolicy = usePublicationPolicy()
  const pageRef = useRef<HTMLElement | null>(null)
  const cartItems = useCartStore((state) => state.items)
  const cartShippingMethod = useCartStore((state) => state.shippingMethod)
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
  const [errors, setErrors] = useState<Partial<Record<CheckoutErrorKey, string>>>({})
  const [confirmation, setConfirmation] = useState<SimulatedOrder | null>(null)
  const loading = useUIStore((state) => state.loadingScopes.checkout ?? false)
  const uiError = useUIStore((state) => state.errorScopes.checkout)
  const setLoading = useUIStore((state) => state.setLoading)
  const setError = useUIStore((state) => state.setError)
  const clearError = useUIStore((state) => state.clearError)
  const { dismiss, error, info, progress, showSuccessModal, success } = useLiveToast()
  const pendingArtworkItems = useMemo(() => cartItems.filter((item) => needsArtworkApproval(item)), [cartItems])
  const unpublishedCartItems = useMemo(
    () => publicationPolicy.isPublicLaunch
      ? cartItems.filter((item) => {
          const productRoute = item.configuration.productHref
          if (productRoute) return !isPublicationRouteAllowed(productRoute, publicationPolicy)
          return item.productType !== 'dtf'
        })
      : [],
    [cartItems, publicationPolicy],
  )
  const dtiOnly = isDtiCart(cartItems)
  const [dtiAddress, setDtiAddress] = useState<DtiAddress>({ line1: '', city: '', province: '', postalCode: '' })
  const [dtiStatus, setDtiStatus] = useState('')
  const [dtiClientAccepted, setDtiClientAccepted] = useState(false)
  const [dtiOrderAccess, setDtiOrderAccess] = useState<DtiOrderAccess | null>(() => {
    const saved = sessionStorage.getItem('dti-current-order')
    if (!saved) return null
    try {
      const orderAccess = JSON.parse(saved) as DtiOrderAccess
      return orderAccess.itemId === cartItems[0]?.id ? orderAccess : null
    } catch { return null }
  })
  const [dtiRetryFile, setDtiRetryFile] = useState<File | null>(() => {
    const saved = sessionStorage.getItem('dti-current-order')
    if (!saved) return null
    try {
      const orderAccess = JSON.parse(saved) as DtiOrderAccess
      return getDtiArtwork(orderAccess.itemId) ?? null
    } catch { return null }
  })
  const [dtiRemoteOrder, setDtiRemoteOrder] = useState<{ order?: Record<string, unknown>; latestArtwork?: Record<string, unknown> | null; adaptationQuote?: Record<string, unknown> | null } | null>(null)

  const canAdvance = useMemo(() => cartItems.length > 0 && unpublishedCartItems.length === 0, [cartItems.length, unpublishedCartItems.length])

  useEffect(() => {
    const root = pageRef.current

    if (!root) {
      return
    }

    const context = initStorefrontRevealAnimations(root)
    return () => context.revert()
  }, [])

  const handleFieldChange =
    (field: keyof CustomerData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomer((current) => ({ ...current, [field]: event.target.value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
      clearError('checkout')
    }

  const validateCustomer = () => {
    const nextErrors: Partial<Record<CheckoutErrorKey, string>> = {}

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

    if (unpublishedCartItems.length > 0) {
      nextErrors.cart = 'Hay productos que no están publicados en esta tienda. Elimina esas líneas del carrito para continuar.'
    }

    if (!dtiOnly && pendingArtworkItems.length > 0) {
      nextErrors.artwork =
        'Antes de confirmar, revisa y acepta el archivo final o solicita ayuda de diseno en cada linea pendiente.'
    }

    if (dtiOnly && !hasOnlyOneDtiLine(cartItems)) nextErrors.cart = 'Para usar el checkout DTI de pruebas, tramita una sola línea DTI por pedido y separa otros productos.'
    if (dtiOnly && !dtiBackendConfigured()) nextErrors.cart = 'Checkout DTI desactivado: falta conectar un proyecto Supabase QA aislado.'
    if (dtiOnly && cartShippingMethod !== 'pickup') {
      if (!dtiAddress.line1.trim() || !dtiAddress.city.trim() || !dtiAddress.province.trim() || !/^\d{5}$/.test(dtiAddress.postalCode)) nextErrors.cart = 'Completa dirección, municipio, provincia y código postal peninsular.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateCustomer()) {
      setConfirmation(null)
      error('Revisa tus datos', 'Necesitamos un nombre, email, telefono y al menos un producto en la solicitud.')
      return
    }

    setLoading('checkout', true)
    clearError('checkout')
    const progressToastId = progress('Solicitud en preparacion', 'Estamos registrando tu solicitud y los datos de entrega.')

    try {
      if (dtiOnly) {
        const item = cartItems[0]
        const file = getDtiArtwork(item.id)
        if (!file) throw new Error('El archivo ya no está disponible en esta sesión. Vuelve al configurador y añádelo de nuevo.')
        const order = await callDtiFunction<{ orderId: string; guestAccessToken: string; totalCents: number; status: string }>('dti-orders', {
          customerName: customer.name, email: customer.email, phone: customer.phone,
          meters: Number(item.configuration.meters), shippingMethod: cartShippingMethod === 'pickup' ? 'pickup' : 'standard',
          adaptationRequested: Boolean(item.configuration.adaptationRequested || item.pricing.quoteRequired),
          shippingAddress: cartShippingMethod === 'pickup' ? null : { line1: dtiAddress.line1, city: dtiAddress.city, province: dtiAddress.province, postalCode: dtiAddress.postalCode, countryCode: 'ES' },
        }, { idempotencyKey: dtiOrderKey(), recoveryKey: dtiRecoveryKey() })
        const token = order.guestAccessToken
        const access = { orderId: order.orderId, token, itemId: item.id }
        sessionStorage.setItem('dti-current-order', JSON.stringify(access))
        setDtiOrderAccess(access)
        const upload = await callDtiFunction<{ versionId: string; validation: string; reviewRequired: boolean }>('dti-artwork', {}, { file, orderId: order.orderId, orderToken: token, idempotencyKey: dtiIdempotencyKey(order.orderId) })
        if (dtiClientAccepted && ['passed', 'manual_review'].includes(upload.validation)) {
          await callDtiFunction('dti-accept-artwork', { orderId: order.orderId, versionId: upload.versionId }, { orderToken: token })
        }
        forgetDtiArtwork(item.id)
        finishDtiOrderAttempt()
        setDtiStatus(upload.reviewRequired || upload.validation === 'manual_review'
          ? `Pedido ${order.orderId} recibido. El archivo requiere revisión profesional. La aceptación del cliente queda registrada por separado y no equivale a aprobación técnica.`
          : `Pedido ${order.orderId} y archivo recibidos. ${dtiClientAccepted ? 'Aceptación del cliente registrada por separado. ' : 'Aún falta la aceptación del cliente. '}${item.configuration.adaptationRequested || item.pricing.quoteRequired ? 'El pago espera un presupuesto profesional y su aprobación.' : 'No se ha realizado ningún cobro.'}`)
        const remote = await callDtiFunction<{ order: Record<string, unknown>; latestArtwork: Record<string, unknown> | null; adaptationQuote: Record<string, unknown> | null }>('dti-orders', { orderId: order.orderId }, { method: 'GET', orderToken: token })
        setDtiRemoteOrder(remote)
        setErrors({})
        return
      }
      const savedCustomer = await upsertCustomerProfile(customer)
      const normalizedItems = cartItems.map(multiplyOrderItemPricing)
      setSubmittedSummary(summary)
      const order = await submitOrder({
        customer,
        customerId: savedCustomer.id,
        items: normalizedItems,
        total: summary.total,
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
      showSuccessModal({
        title: 'Prueba local guardada',
        description: `La referencia ${order.id} se ha guardado en el entorno local. No se envió ni se realizó ningún cobro.`,
        ctaLabel: 'Continuar',
      })
      success('Prueba local guardada', 'No se ha enviado ningún pedido real ni se ha cobrado.', 2600)
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'No se pudo registrar la solicitud en este momento.'
      setError('checkout', message)
      setConfirmation(null)
      error('No se pudo registrar la solicitud', message)
    } finally {
      dismiss(progressToastId)
      setLoading('checkout', false)
    }
  }

  const retryDtiArtworkUpload = async () => {
    if (!dtiOrderAccess) return
    const file = dtiRetryFile ?? getDtiArtwork(dtiOrderAccess.itemId)
    if (!file) {
      setDtiStatus('Selecciona de nuevo el archivo para continuar el mismo pedido. No se creará otro pedido ni se iniciará un pago.')
      return
    }

    setLoading('checkout', true)
    setDtiStatus('Reintentando la subida al pedido QA existente…')
    try {
      const upload = await callDtiFunction<{ versionId: string; validation: string; reviewRequired: boolean }>(
        'dti-artwork', {},
        { file, orderId: dtiOrderAccess.orderId, orderToken: dtiOrderAccess.token, idempotencyKey: dtiIdempotencyKey(dtiOrderAccess.orderId) },
      )
      if (dtiClientAccepted && ['passed', 'manual_review'].includes(upload.validation)) {
        await callDtiFunction('dti-accept-artwork', { orderId: dtiOrderAccess.orderId, versionId: upload.versionId }, { orderToken: dtiOrderAccess.token })
      }
      forgetDtiArtwork(dtiOrderAccess.itemId)
      setDtiRetryFile(null)
      setDtiRemoteOrder(await callDtiFunction('dti-orders', { orderId: dtiOrderAccess.orderId }, { method: 'GET', orderToken: dtiOrderAccess.token }))
      setDtiStatus(upload.reviewRequired || upload.validation === 'manual_review'
        ? 'El archivo llegó al mismo pedido y requiere revisión profesional. Aún no se ha iniciado ningún pago.'
        : `Archivo recibido y validado en el mismo pedido QA. ${dtiClientAccepted ? 'Aceptación del cliente registrada. ' : 'La aceptación del cliente sigue pendiente. '}Aún no se ha iniciado ningún pago.`)
    } catch (cause) {
      const message = cause instanceof TypeError && cause.message === 'Failed to fetch'
        ? 'El navegador no pudo completar la subida al backend QA. El pedido sigue guardado y no se creó otro ni se inició un pago; comprueba la conexión y reintenta aquí.'
        : cause instanceof Error ? cause.message : 'No se pudo subir el archivo al pedido QA.'
      setDtiStatus(message)
    } finally {
      setLoading('checkout', false)
    }
  }

  const activeSummary = submittedSummary ?? summary
  const vatAlreadyIncluded = activeSummary.items.length > 0 && activeSummary.items.every((item) => item.pricing.vatIncluded) && activeSummary.shipping.vatIncluded

  return (
    <section className="page" ref={pageRef}>
      <div className="page-hero" data-animate="hero">
        <p className="eyebrow">{pricingContent.checkout.heroEyebrow}</p>
        <h1>{pricingContent.checkout.heroTitle}</h1>
        <p>{pricingContent.checkout.heroDescription}</p>
      </div>

      <p className="inline-notice" role="note">{dtiOnly ? 'Checkout DTI conectado únicamente al backend QA configurado. No se realizará ningún cobro desde esta versión.' : 'Entorno de prueba local: esta pantalla no envía pedidos reales ni realiza cobros. Los archivos no salen de este navegador.'}</p>
      {dtiStatus ? <p className="inline-notice" role="status">{dtiStatus}</p> : null}

      <div data-animate="reveal">
        <CheckoutStepRail activeStep={step} steps={checkoutSteps} />
      </div>

      <div className="split-grid cart-layout checkout-layout--premium" data-animate="reveal">
        <article className="content-card" data-animate="panel" data-cursor-zone="conversion">
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
                  {unpublishedCartItems.length > 0 ? <p className="inline-notice" role="alert">Esta tienda está publicando DTI. Elimina del carrito los productos que todavía no están disponibles antes de continuar.</p> : null}
                  <div className="checkout-list">
                    {cartItems.map((item) => (
                      <div className="checkout-item" key={item.id}>
                        <div>
                          <h3>{item.productName}</h3>
                          <p>{getOrderItemSummary(item).join(' | ') || item.artwork.fileName}</p>
                          <p className="file-meta">
                            Archivo: {item.artwork.fileName} | Estado: {formatArtworkAcceptanceStatus(item.artwork.acceptance)}
                          </p>
                          {needsArtworkApproval(item) ? (
                            <p className="field-error">
                              Falta aceptar este archivo o solicitar ayuda de diseno Ridaos antes de confirmar.
                            </p>
                          ) : null}
                        </div>
                        <strong>{formatCurrency(item.pricing.total * (item.lineQuantity ?? 1))}</strong>
                      </div>
                    ))}
                  </div>
                  <ul className="hint-list">
                    <li>Antes de confirmar, revisa que el archivo y la configuracion coincidan con cada producto.</li>
                  <li>Usaremos esta informacion para preparar tu solicitud, no para activar produccion automatica.</li>
                    <li>Si un archivo no esta listo, puedes continuar solo cuando se haya solicitado ayuda de diseno.</li>
                  </ul>
                  {errors.artwork ? <p className="field-error">{errors.artwork}</p> : null}
                  <div className="form-actions">
                    <button
                      className="action-button"
                      disabled={!canAdvance}
                      onClick={() => {
                        setStep('shipping')
                        info('Revision completada', 'Ahora solo falta confirmar tus datos de entrega.', 1800)
                      }}
                      type="button"
                    >
                      Continuar a entrega
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
                {dtiOnly && cartShippingMethod !== 'pickup' ? <>
                  <label className="field-group" htmlFor="dti-address"><span className="field-label">Dirección de envío</span><input className="form-input" id="dti-address" value={dtiAddress.line1} onChange={(event) => setDtiAddress((current) => ({ ...current, line1: event.target.value }))} /></label>
                  <label className="field-group" htmlFor="dti-city"><span className="field-label">Municipio</span><input className="form-input" id="dti-city" value={dtiAddress.city} onChange={(event) => setDtiAddress((current) => ({ ...current, city: event.target.value }))} /></label>
                  <label className="field-group" htmlFor="dti-province"><span className="field-label">Provincia</span><input className="form-input" id="dti-province" value={dtiAddress.province} onChange={(event) => setDtiAddress((current) => ({ ...current, province: event.target.value }))} /></label>
                  <label className="field-group" htmlFor="dti-postal"><span className="field-label">Código postal peninsular</span><input className="form-input" inputMode="numeric" maxLength={5} id="dti-postal" value={dtiAddress.postalCode} onChange={(event) => setDtiAddress((current) => ({ ...current, postalCode: event.target.value }))} /></label>
                </> : null}
                {errors.cart ? <p className="field-error">{errors.cart}</p> : null}
                {errors.artwork ? <p className="field-error">{errors.artwork}</p> : null}
                <ul className="hint-list">
                  <li>Usamos estos datos para preparar la entrega y la confirmacion de la solicitud.</li>
                  <li>El metodo de entrega elegido en el carrito se mantiene aqui para que no pierdas contexto.</li>
                  <li>Si no tienes el archivo final aceptado, vuelve a la PDP o solicita ayuda de diseno.</li>
                </ul>
                <div className="form-actions">
                  <button className="action-button action-button-muted" onClick={() => setStep('review')} type="button">
                    Volver a revision
                  </button>
                  <button
                    className="action-button"
                    onClick={() => {
                      setStep('payment')
                      info('Datos revisados', 'La solicitud ya puede pasar al paso de confirmacion.', 1800)
                    }}
                    type="button"
                  >
                    Continuar a confirmacion
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {step === 'payment' ? (
            <>
              <p className="section-label">Confirmacion</p>
              <h2>{pricingContent.checkout.paymentTitle}</h2>
              {dtiOnly ? <>
                <p className="inline-notice">{dtiBackendConfigured() ? 'Se registrará un pedido de prueba y se validará el archivo en servidor. La aceptación del cliente, revisión técnica y aprobación de presupuesto son estados separados.' : 'El pedido real de prueba no está disponible hasta configurar un proyecto Supabase QA aislado.'}</p>
                {dtiOrderAccess ? <div className="content-card">
                  <p>Pedido QA: {dtiOrderAccess.orderId}</p>
                  <label className="field-group" htmlFor="dti-artwork-retry">
                    <span>Archivo del mismo pedido</span>
                    <input id="dti-artwork-retry" type="file" accept=".png,.pdf,.ai,.psd,.svg,.cdr" onChange={(event) => {
                      const file = event.target.files?.[0] ?? null
                      setDtiRetryFile(file)
                      if (file) rememberDtiArtwork(dtiOrderAccess.itemId, file)
                    }} />
                    <small>Vuelve a seleccionar el arte si hace falta. El reintento usa la clave idempotente del pedido actual.</small>
                  </label>
                  <button className="action-button action-button-muted" disabled={loading || !(dtiRetryFile ?? getDtiArtwork(dtiOrderAccess.itemId))} type="button" onClick={retryDtiArtworkUpload}>
                    Reintentar subida de archivo
                  </button>
                  <button className="action-button action-button-muted" type="button" onClick={async () => {
                    try { setDtiRemoteOrder(await callDtiFunction('dti-orders', { orderId: dtiOrderAccess.orderId }, { method: 'GET', orderToken: dtiOrderAccess.token })) }
                    catch (cause) { setDtiStatus(cause instanceof Error ? cause.message : 'No se pudo actualizar el pedido.') }
                  }}>Consultar estado y presupuesto</button>
                  {typeof dtiRemoteOrder?.order?.status === 'string' ? <div className="inline-notice" role="status">
                    <strong>Estado del pedido: {dtiOrderStatusLabels[dtiRemoteOrder.order.status] ?? 'En revisión por el equipo'}</strong>
                    {typeof dtiRemoteOrder.order.trackingReference === 'string' ? <p>Referencia de seguimiento: {dtiRemoteOrder.order.trackingReference}</p> : null}
                    {typeof dtiRemoteOrder.order.dispatchedAt === 'string' ? <p>Despachado el {new Date(dtiRemoteOrder.order.dispatchedAt).toLocaleDateString('es-ES')}</p> : null}
                    {typeof dtiRemoteOrder.order.pickedUpAt === 'string' ? <p>Recogido el {new Date(dtiRemoteOrder.order.pickedUpAt).toLocaleDateString('es-ES')}</p> : null}
                  </div> : null}
                  {dtiRemoteOrder?.adaptationQuote ? <>
                    <p>Presupuesto de adaptación: {Number(dtiRemoteOrder.adaptationQuote.hours)} h · {formatCurrency(Number(dtiRemoteOrder.adaptationQuote.total_cents) / 100)} IVA incluido · estado: {String(dtiRemoteOrder.adaptationQuote.status)}</p>
                    {dtiRemoteOrder.adaptationQuote.status === 'awaiting_customer_approval' ? <div className="form-actions">
                      {(['approved', 'rejected'] as const).map((decision) => <button key={decision} className="action-button" type="button" onClick={async () => {
                        try {
                          await callDtiFunction('dti-adaptation-quotes', { action: 'decide', quoteId: dtiRemoteOrder.adaptationQuote!.id, decision }, { orderToken: dtiOrderAccess.token })
                          setDtiRemoteOrder(await callDtiFunction('dti-orders', { orderId: dtiOrderAccess.orderId }, { method: 'GET', orderToken: dtiOrderAccess.token }))
                          setDtiStatus(decision === 'approved' ? 'Presupuesto aprobado antes del pago. La aprobación técnica para producción sigue pendiente.' : 'Presupuesto rechazado; no se realizará ningún cobro.')
                        } catch (cause) { setDtiStatus(cause instanceof Error ? cause.message : 'No se pudo guardar la decisión del presupuesto.') }
                      }}>{decision === 'approved' ? 'Aprobar presupuesto' : 'Rechazar presupuesto'}</button>)}
                    </div> : null}
                  </> : null}
                  {dtiRemoteOrder?.latestArtwork?.versionId && ['passed', 'manual_review'].includes(String(dtiRemoteOrder.latestArtwork.validation)) && !dtiRemoteOrder.latestArtwork.clientAcceptedAt ? <button className="action-button action-button-muted" type="button" onClick={async () => {
                    try {
                      await callDtiFunction('dti-accept-artwork', { orderId: dtiOrderAccess.orderId, versionId: dtiRemoteOrder.latestArtwork!.versionId }, { orderToken: dtiOrderAccess.token })
                      setDtiRemoteOrder(await callDtiFunction('dti-orders', { orderId: dtiOrderAccess.orderId }, { method: 'GET', orderToken: dtiOrderAccess.token }))
                      setDtiStatus('Aceptación del cliente registrada. Esto no sustituye la revisión técnica ni autoriza producción.')
                    } catch (cause) { setDtiStatus(cause instanceof Error ? cause.message : 'No se pudo aceptar la versión.') }
                  }}>Aceptar esta versión de archivo</button> : null}
                  {dtiRemoteOrder?.latestArtwork?.validation === 'passed' && dtiRemoteOrder.latestArtwork.clientAcceptedAt && (!cartItems[0]?.configuration.adaptationRequested && !cartItems[0]?.pricing.quoteRequired || dtiRemoteOrder.adaptationQuote?.status === 'approved') && dtiStripeTestConfigured()
                    ? <DtiStripePayment orderId={dtiOrderAccess.orderId} orderToken={dtiOrderAccess.token} />
                    : null}
                  {dtiRemoteOrder?.latestArtwork?.validation === 'passed' && dtiRemoteOrder.latestArtwork.clientAcceptedAt && (!cartItems[0]?.configuration.adaptationRequested && !cartItems[0]?.pricing.quoteRequired || dtiRemoteOrder.adaptationQuote?.status === 'approved') && !dtiStripeTestConfigured()
                    ? <p className="inline-notice">Archivo validado y aceptado. El pago test está desactivado porque falta configurar la clave pública `pk_test_`.</p>
                    : null}
                </div> : null}
              </> : <div className="shipping-option-list payment-option-list">
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
              </div>}
              {uiError ? <p className="field-error">{uiError}</p> : null}
              {loading ? <p className="inline-notice">Registrando tu solicitud...</p> : null}
              <CommercialNotice className="checkout-notice" title="Resumen de cierre" />
              <div className="summary-list compact-summary">
                {cartItems.map((item) => (
                  <div className="summary-row" key={`artwork-${item.id}`}>
                    <span>{item.productName}</span>
                    <strong>{formatArtworkAcceptanceStatus(item.artwork.acceptance)}</strong>
                  </div>
                ))}
              </div>
              {errors.artwork ? <p className="field-error">{errors.artwork}</p> : null}
              {pendingArtworkItems.length ? (
                <p className="inline-notice">
                  Puedes enviar la solicitud sin archivo final aceptado solo cuando hayas pedido ayuda de diseno Ridaos.
                </p>
              ) : (
                <p className="inline-notice">
                  Antes de confirmar, revisa que el archivo y la configuracion coincidan. Usaremos esta informacion para preparar tu solicitud.
                </p>
              )}
              {dtiOnly ? <label className="field-group" htmlFor="dti-client-acceptance"><span><input id="dti-client-acceptance" type="checkbox" checked={dtiClientAccepted} onChange={(event) => setDtiClientAccepted(event.target.checked)} /> Confirmo que el archivo corresponde a mi diseño y acepto esta versión como referencia del pedido.</span><small>Esta aceptación del cliente no equivale a aprobación técnica ni autoriza producción.</small></label> : null}
              <div className="form-actions">
                <button className="action-button action-button-muted" onClick={() => setStep('shipping')} type="button">
                  Volver a entrega
                </button>
                <button className="action-button" data-cursor="sales" disabled={loading || (dtiOnly && (!dtiBackendConfigured() || Boolean(dtiOrderAccess)))} onClick={handleSubmit} type="button">
                  {dtiOnly ? 'Crear pedido de prueba' : 'Enviar solicitud'}
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
                  <span>Solicitud</span>
                  <strong>{confirmation.id} · local</strong>
                </div>
                <div className="summary-row">
                  <span>Cliente</span>
                  <strong>{confirmation.customer.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Modalidad de cierre</span>
                  <strong>Sin pago · prueba local</strong>
                </div>
                <div className="summary-row summary-row-total">
                  <span>Total estimado</span>
                  <strong>{formatCurrency(confirmation.total)}</strong>
                </div>
              </div>
              <OrderLifecycleTimeline status={confirmation.status} />
            </>
          ) : null}
        </article>

        <div className="summary-stack" data-animate="reveal">
          <article className="content-card premium-cart-summary" data-animate="panel" data-cursor-zone="conversion">
            <p className="section-label">Resumen de checkout</p>
            <div className="summary-list">
              <div className="summary-row">
                <span>{vatAlreadyIncluded ? 'Productos · IVA incluido' : 'Subtotal productos'}</span>
                <strong>{formatCurrency(activeSummary.subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>Entrega</span>
                <strong>{formatCurrency(activeSummary.shipping.price)}</strong>
              </div>
              <div className="summary-row">
                <span>{vatAlreadyIncluded ? 'IVA incluido' : 'IVA incluido + adicional'}</span>
                <strong>{formatCurrency(activeSummary.taxes)}</strong>
              </div>
              <div className="summary-row">
                <span>Cupon</span>
                <strong>{activeSummary.coupon ? activeSummary.coupon.code : 'Sin cupon'}</strong>
              </div>
              {dtiRemoteOrder?.adaptationQuote?.status === 'approved' ? <>
                <div className="summary-row"><span>Adaptación aprobada · base</span><strong>{formatCurrency(Number(dtiRemoteOrder.adaptationQuote.net_cents) / 100)}</strong></div>
                <div className="summary-row"><span>IVA de adaptación</span><strong>{formatCurrency(Number(dtiRemoteOrder.adaptationQuote.vat_cents) / 100)}</strong></div>
              </> : null}
              <div className="summary-row summary-row-total">
                <span>Total estimado</span>
                <strong>{formatCurrency(typeof dtiRemoteOrder?.order?.totalCents === 'number' ? dtiRemoteOrder.order.totalCents / 100 : activeSummary.total)}</strong>
              </div>
            </div>
            <ul className="hint-list">
              <li>El total mantiene entrega, impuestos y descuentos visibles antes de confirmar.</li>
              <li>La comprobacion inicial del archivo sigue separada para proteger medidas, formato y acabados.</li>
              <li>La prueba local conserva el resumen en este dispositivo; no se envía a Ridaos ni se cobra.</li>
            </ul>
          </article>

          {confirmation ? (
            <article className="content-card success-card" data-animate="panel" data-cursor-zone="conversion">
              <p className="section-label">Siguiente lectura</p>
              <p>
                Esta referencia solo existe en el almacenamiento local de prueba. No se envió al taller ni es un pedido real.
              </p>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Checkout
