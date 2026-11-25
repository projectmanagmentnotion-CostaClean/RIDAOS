import { useEffect, useRef, useState } from 'react'
import { callDtiFunction, dtiStripePublishableKey, dtiStripeTestConfigured } from './dtiCheckout'
import { createStripeClientCache } from './stripeClientCache.mjs'

type StripeElement = { mount(target: HTMLElement): void; unmount(): void }
type StripeElements = { create(type: 'payment', options?: Record<string, unknown>): StripeElement; submit(): Promise<{ error?: { message?: string } }> }
type StripeClient = {
  elements(options: { clientSecret: string; appearance?: Record<string, unknown> }): StripeElements
  confirmPayment(options: { elements: StripeElements; confirmParams: { return_url: string }; redirect: 'if_required' }): Promise<{ error?: { message?: string }; paymentIntent?: { status: string } }>
}
declare global { interface Window { Stripe?: (key: string) => StripeClient } }

const getOrCreateStripeClient = createStripeClientCache<StripeClient>()
let stripeJsPromise: Promise<void> | null = null

function loadStripeJs() {
  if (window.Stripe) return Promise.resolve()
  if (stripeJsPromise) return stripeJsPromise

  stripeJsPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-stripe-js]')
    const script = existingScript ?? document.createElement('script')
    const onLoad = () => resolve()
    const onError = () => reject(new Error('No se pudo cargar Stripe.js.'))

    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })

    if (!existingScript) {
      script.src = 'https://js.stripe.com/v3/'
      script.async = true
      script.dataset.stripeJs = 'true'
      document.head.append(script)
    }
  }).catch((error: unknown) => {
    stripeJsPromise = null
    throw error
  })

  return stripeJsPromise
}

function getStripe() {
  return getOrCreateStripeClient(dtiStripePublishableKey(), async (publishableKey) => {
    await loadStripeJs()
    if (!window.Stripe) throw new Error('Stripe.js no está disponible.')
    return window.Stripe(publishableKey)
  })
}

export function DtiStripePayment({ orderId, orderToken }: { orderId: string; orderToken: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const stripeRef = useRef<StripeClient | null>(null)
  const elementsRef = useRef<StripeElements | null>(null)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let disposed = false
    let paymentElement: StripeElement | null = null
    if (!dtiStripeTestConfigured()) return
    void (async () => {
      try {
        const response = await callDtiFunction<{ clientSecret?: string; paymentConfirmationPending?: boolean }>('dti-payment-intent', { orderId }, { orderToken })
        if (response.paymentConfirmationPending) { setMessage('El pago está pendiente de confirmación del webhook de Stripe.'); return }
        if (!response.clientSecret) throw new Error('Stripe no devolvió una sesión de pago de prueba.')
        const stripe = await getStripe()
        if (disposed || !mountRef.current) return
        const elements = stripe.elements({ clientSecret: response.clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#d6a85c', colorBackground: '#151719', colorText: '#f4f1e9', borderRadius: '12px' } } })
        stripeRef.current = stripe
        elementsRef.current = elements
        paymentElement = elements.create('payment', { layout: 'tabs' })
        paymentElement.mount(mountRef.current)
        setReady(true)
      } catch (cause) { if (!disposed) setMessage(cause instanceof Error ? cause.message : 'No se pudo iniciar el pago de prueba.') }
    })()
    return () => { disposed = true; paymentElement?.unmount(); stripeRef.current = null; elementsRef.current = null }
  }, [orderId, orderToken])

  const pay = async () => {
    const stripe = stripeRef.current
    const elements = elementsRef.current
    if (!stripe || !elements || !ready) return
    setBusy(true); setMessage('')
    try {
      const validation = await elements.submit()
      if (validation.error) throw new Error(validation.error.message ?? 'Revisa los datos de pago.')
      const result = await stripe.confirmPayment({ elements, confirmParams: { return_url: window.location.href }, redirect: 'if_required' })
      if (result.error) throw new Error(result.error.message ?? 'Stripe no pudo confirmar el intento.')
      setMessage('Stripe recibió el intento. El pedido solo aparecerá pagado cuando el webhook de prueba confirme el importe y la moneda.')
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'No se pudo completar el intento de prueba.') }
    finally { setBusy(false) }
  }

  if (!dtiStripeTestConfigured()) return <p className="inline-notice">Pago test no configurado. Añade una clave pública `pk_test_` junto con los secretos test del backend para habilitar el Payment Element.</p>
  return <div className="dti-stripe-payment"><div ref={mountRef} />{message ? <p className="inline-notice" role="status">{message}</p> : null}<button className="action-button" disabled={!ready || busy} onClick={pay} type="button">{busy ? 'Procesando…' : 'Pagar en entorno de prueba'}</button></div>
}
