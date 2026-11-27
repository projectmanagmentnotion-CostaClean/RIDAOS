import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PageShell from '../components/PageShell'
import { ArtworkUploadFlow, type ArtworkPreviewSummary, type ArtworkUploadFlowState } from '../features/artwork-upload'
import { initStorefrontRevealAnimations } from '../features/motion/revealAnimations'
import { useLiveToast } from '../features/live-feedback'
import { publicRoutes } from '../lib/navigation'
import { addToCart } from '../lib/cart'
import { rememberDtiArtwork } from '../features/dtf/dtiCheckout'
import { dtiArtworkCanEnterCart } from '../features/dtf/dtiArtworkGate.mjs'
import { useCartStore } from '../store/useCartStore'
import type { CartItem } from '../types/ecommerce'
import './DTFPage.css'
import {
  calculateDtiAdaptationRate,
  calculateDtiInnuroPrice,
  DTI_INNURO_ADAPTATION_HOURLY_RATE,
  DTI_INNURO_MINIMUM_METERS,
  DTI_INNURO_PRICE_PER_METER,
  DTI_INNURO_SHIPPING_PRICE,
  getDtiCutoffStatus,
  getDtiPreparationPlan,
} from '../config/pricing/dtiInnuroPricing.mjs'

const currency = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

function scrollToSection(id: string) {
  const section = document.getElementById(id)
  if (!section) return

  section.focus({ preventScroll: true })
  section.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

function DTFPage() {
  const pageRef = useRef<HTMLElement | null>(null)
  const { error, success } = useLiveToast()
  const shippingMethod = useCartStore((state) => state.shippingMethod)
  const setShippingMethod = useCartStore((state) => state.setShippingMethod)
  const [metersInput, setMetersInput] = useState('1')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [adaptationRequested, setAdaptationRequested] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [notes, setNotes] = useState('')
  const [artworkState, setArtworkState] = useState<{
    metadata: ArtworkUploadFlowState['metadata']
    summary: ArtworkPreviewSummary | null
    acceptance: ArtworkUploadFlowState['acceptance']
  }>({ metadata: null, summary: null, acceptance: null })

  const meters = Number(metersInput)
  const price = useMemo(() => calculateDtiInnuroPrice(meters), [meters])
  const preparation = getDtiPreparationPlan(meters)
  const cutoff = getDtiCutoffStatus()
  const isPickup = shippingMethod === 'pickup'
  const shippingPrice = isPickup ? 0 : DTI_INNURO_SHIPPING_PRICE
  const total = price.total + shippingPrice
  const adaptationRate = calculateDtiAdaptationRate(1)
  const artworkCanContinue = dtiArtworkCanEnterCart(selectedFile, artworkState.acceptance)
  const cutoffCopy = cutoff.startsNextWorkingDay
    ? 'Los pedidos recibidos ahora pasan al siguiente día laborable.'
    : 'Los pedidos antes de las 18:30 (Europe/Madrid) cuentan desde el mismo día laborable.'
  const dtiValidationContext = useMemo(() => ({
    configuration: { meters: String(meters), usableWidth: '55' },
    productName: 'DTI Innuro por metro',
  }), [meters])
  const dtiSummaryItems = useMemo(() => [
    { label: 'Producto', value: 'DTI Innuro' },
    { label: 'Metraje', value: price.valid ? `${meters} m` : 'Pendiente' },
    { label: 'Ancho útil', value: '55 cm' },
  ], [meters, price.valid])
  const handleArtworkFileChange = useCallback((file: File | null) => {
    setSelectedFile(file)
    setArtworkState({ metadata: null, summary: null, acceptance: null })
  }, [])
  const handleArtworkStateChange = useCallback((state: Pick<ArtworkUploadFlowState, 'metadata' | 'summary' | 'acceptance'>) => {
    setArtworkState({ metadata: state.metadata, summary: state.summary, acceptance: state.acceptance })
  }, [])

  useEffect(() => {
    if (!pageRef.current) return
    const context = initStorefrontRevealAnimations(pageRef.current)
    return () => context.revert()
  }, [])

  const handleAddToCart = () => {
    if (!price.valid) {
      error('Pedido mínimo de 1 m', 'Ajusta el metraje para continuar.')
      return
    }
    if (!selectedFile || !artworkState.acceptance || !artworkCanContinue) {
      error('Revisa el archivo', 'Sube el arte y acepta la referencia o solicita ayuda de diseño.')
      return
    }

    const itemId = `dti-innuro-${Date.now()}`
    const manualReview = Boolean(artworkState.acceptance.manualReviewRequired)
    const adaptationLabel = `Adaptación profesional solicitada · ${DTI_INNURO_ADAPTATION_HOURLY_RATE} €/h + IVA · presupuesto pendiente de aprobación`
    const cartItem: CartItem = {
      id: itemId,
      lineQuantity: 1,
      productType: 'dtf',
      productName: 'DTI Innuro por metro',
      configuration: {
        meters,
        adaptationRequested,
        notes: notes.trim(),
        productHref: publicRoutes.dtf,
        extras: adaptationRequested ? [adaptationLabel] : [],
        summary: [
          'Producto: DTI Innuro',
          `Metraje: ${meters} m`,
          'Ancho útil: 55 cm',
          `Preparación: ${preparation.label}`,
          isPickup ? "Recogida: Ridaos Print BCN, Carrer d'Aragó 423, Barcelona" : 'Envío peninsular: 5 € IVA incluido',
          ...(manualReview ? ['Archivo: requiere revisión manual antes de producción y pago'] : ['Archivo: comprobación inicial y referencia aceptada']),
          ...(adaptationRequested ? [adaptationLabel] : []),
        ],
      },
      pricing: {
        unitPrice: DTI_INNURO_PRICE_PER_METER,
        unitLabel: 'metro',
        subtotal: price.total,
        extras: 0,
        total: price.total,
        vatIncluded: true,
        quoteRequired: adaptationRequested,
      },
      artwork: {
        id: `upload-${Date.now()}`,
        itemId,
        fileName: selectedFile.name,
        fileType: selectedFile.type || 'application/octet-stream',
        fileSize: selectedFile.size,
        formatLabel: artworkState.metadata?.formatLabel ?? selectedFile.name.split('.').pop()?.toUpperCase() ?? 'ARCHIVO',
        status: 'pending_review',
        uploadedAt: new Date().toISOString(),
        notes: notes.trim(),
        acceptance: artworkState.acceptance,
        previewSummary: artworkState.summary ?? undefined,
      },
    }

    addToCart(cartItem)
    rememberDtiArtwork(itemId, selectedFile)
    setAddedToCart(true)
    success('Añadido al carrito', 'La solicitud queda guardada localmente para revisar; todavía no hay cobro.')
  }

  return (
    <PageShell className="premium-page dti-innuro-page" ref={pageRef}>
      <section className="dti-hero" data-animate="hero">
        <div className="dti-hero__copy">
          <p className="dti-eyebrow"><span /> RIDAOS PRINT BCN · TRANSFER TEXTIL</p>
          <h1>DTI Innuro<span>por metro.</span></h1>
          <p className="dti-hero__intro">Color, detalle y libertad de aplicación para marcas que producen a su manera.</p>
          <div className="dti-hero__price"><strong>15 €</strong><span>/ metro<br />IVA incluido</span></div>
          <div className="dti-hero__actions">
            <a className="dti-button dti-button--accent" href="#dti-configurator" onClick={(event) => { event.preventDefault(); scrollToSection('dti-configurator') }}>Configurar mi rollo <span aria-hidden="true">↘</span></a>
            <a className="dti-text-link" href="#dti-specifications" onClick={(event) => { event.preventDefault(); scrollToSection('dti-specifications') }}>Descubre Innuro</a>
          </div>
          <div className="dti-hero__meta"><span>01 / 04</span><span>IMPRESIÓN TRANSFER · BARCELONA</span></div>
        </div>
        <div className="dti-hero__visual" aria-label="Representación ilustrativa del rollo DTI Innuro; no es una fotografía real del producto" role="img">
          <div className="dti-visual__glow" />
          <div className="dti-visual__frame"><span>INNURO / TRANSFER FILM</span><span>55 CM</span></div>
          <div className="dti-film-roll"><div className="dti-film-roll__core" /><div className="dti-film-roll__edge" /></div>
          <div className="dti-visual__stamp"><span>DTI</span><small>MADE FOR<br />YOUR NEXT MOVE</small></div>
          <div className="dti-visual__caption"><span>Representación ilustrativa · no fotografía real</span><strong>DTI INNURO</strong></div>
        </div>
      </section>

      <section className="dti-spec-strip" id="dti-specifications" tabIndex={-1} data-animate="reveal">
        <article><span>01 — PRECISIÓN</span><strong>55 cm</strong><p>Ancho útil fijo para cada metro Innuro.</p></article>
        <article><span>02 — PRECIO CLARO</span><strong>15 €/m</strong><p>IVA incluido. Desde un metro.</p></article>
        <article><span>03 — PRODUCCIÓN</span><strong>{preparation.label}</strong><p>{cutoffCopy}</p></article>
      </section>

      <section className="dti-lead-times" data-animate="reveal">
        <div><p className="dti-eyebrow"><span /> PREPARACIÓN EN TALLER</p><h2>Plazos claros.<br /><em>Sin sorpresas.</em></h2></div>
        <div className="dti-lead-times__rows">
          <p><span>01 — HASTA 5 M</span><strong>48 horas laborables</strong></p>
          <p><span>02 — MÁS DE 5 Y HASTA 10 M</span><strong>3 días laborables</strong></p>
          <p><span>03 — MÁS DE 10 M</span><strong>Plazo bajo consulta</strong></p>
          <small>Pedidos antes de las 18:30 Europe/Madrid cuentan desde ese día laborable; después, desde el siguiente. El transporte se añade al plazo de preparación.</small>
        </div>
      </section>

      <section className="dti-configurator" id="dti-configurator" tabIndex={-1} data-animate="reveal">
        <div className="dti-configurator__heading">
          <p className="dti-eyebrow"><span /> TU PEDIDO, A TU MEDIDA</p>
          <h2>Configura tu<br /><em>próxima producción.</em></h2>
          <p>Una decisión cada vez. El precio se actualiza al momento y el archivo se revisa antes de producir.</p>
        </div>

        <div className="dti-configurator__grid">
          <div className="dti-configurator__form">
            <article className="dti-glass-panel dti-step-panel">
              <div className="dti-step-panel__title"><span>01</span><div><h3>¿Cuánto necesitas?</h3><p>DTI Innuro por metros lineales.</p></div></div>
              <label className="dti-meter-field" htmlFor="dti-meters">
                <input id="dti-meters" inputMode="decimal" min={DTI_INNURO_MINIMUM_METERS} onChange={(event) => setMetersInput(event.target.value)} step="0.1" type="number" value={metersInput} />
                <span>METROS</span>
              </label>
              {!price.valid ? <p className="dti-field-error" role="alert">El pedido mínimo es de 1 m.</p> : null}
              <p className="dti-field-hint">Ancho útil fijo: <strong>55 cm</strong> · 15 €/m IVA incluido</p>
            </article>

            <article className="dti-glass-panel dti-step-panel">
              <div className="dti-step-panel__title"><span>02</span><div><h3>¿Cómo recibes tu pedido?</h3><p>El transporte se suma al tiempo de preparación.</p></div></div>
              <div className="dti-choice-grid">
                <button aria-pressed={isPickup} className={`dti-choice${isPickup ? ' is-active' : ''}`} onClick={() => setShippingMethod('pickup')} type="button"><span>RECOGIDA BCN</span><strong>Gratis</strong><small>Ridaos Print BCN<br />Carrer d'Aragó 423</small></button>
                <button aria-pressed={!isPickup} className={`dti-choice${!isPickup ? ' is-active' : ''}`} onClick={() => setShippingMethod('standard')} type="button"><span>ENVÍO PENINSULAR</span><strong>5 €</strong><small>IVA incluido<br />Plazo de transporte adicional</small></button>
              </div>
            </article>

            <article className="dti-glass-panel dti-step-panel">
              <div className="dti-step-panel__title"><span>03</span><div><h3>Prepara tu archivo</h3><p>PNG y PDF con comprobación inicial. Otros formatos pasan a revisión.</p></div></div>
              <ArtworkUploadFlow
                acceptedFormats=".png,.pdf,.ai,.psd,.svg,.cdr"
                description="La comprobación del navegador es orientativa. AI, PSD, SVG y CDR requieren revisión manual antes de producir o cobrar."
                file={selectedFile}
                onFileChange={handleArtworkFileChange}
                onStateChange={handleArtworkStateChange}
                ruleKey="dtf_meter"
                summaryItems={dtiSummaryItems}
                title="Sube el arte final"
                validationContext={dtiValidationContext}
              />
              <p className="dti-format-note"><strong>PNG / PDF</strong> · comprobación inicial y aceptación de referencia<br /><strong>AI / PSD / SVG / CDR</strong> · revisión manual antes de producir</p>
            </article>

            <article className="dti-glass-panel dti-step-panel">
              <div className="dti-step-panel__title"><span>04</span><div><h3>¿Necesitas adaptación?</h3><p>Solicita apoyo profesional antes de preparar el archivo.</p></div></div>
              <label className="dti-adaptation-toggle">
                <input checked={adaptationRequested} onChange={(event) => setAdaptationRequested(event.target.checked)} type="checkbox" />
                <span><strong>Quiero solicitar adaptación profesional</strong><small>35 €/hora + IVA ({currency.format(adaptationRate.total)}/h IVA incluido). Prepararemos un presupuesto para aprobar antes de cualquier pago.</small></span>
              </label>
              <label className="dti-notes-field" htmlFor="dti-notes"><span>Notas del proyecto <small>OPCIONAL</small></span><textarea id="dti-notes" onChange={(event) => setNotes(event.target.value)} placeholder="Cuéntanos qué necesitas preparar…" rows={3} value={notes} /></label>
            </article>
          </div>

          <aside className="dti-order-card" aria-label="Resumen del pedido">
            <div className="dti-order-card__top"><span>RESUMEN / INNURO</span><span className="dti-live-dot">EN VIVO</span></div>
            <div className="dti-order-card__product"><div className="dti-mini-roll" aria-hidden="true" /><div><p>DTI INNURO</p><span>Transfer textil · 55 cm útil</span></div></div>
            <div className="dti-order-card__line"><span>{price.valid ? `${meters} m × ${currency.format(DTI_INNURO_PRICE_PER_METER)}` : 'Metraje pendiente'}</span><strong>{currency.format(price.total)}</strong></div>
            {adaptationRequested ? <p className="dti-order-card__pending">Adaptación profesional · presupuesto pendiente</p> : null}
            <div className="dti-order-card__line"><span>{isPickup ? 'Recogida en Barcelona' : 'Envío peninsular · IVA incluido'}</span><strong>{currency.format(shippingPrice)}</strong></div>
            <div className="dti-order-card__total"><span>TOTAL ESTIMADO · IVA INCLUIDO</span><strong>{currency.format(total)}</strong></div>
            <p className="dti-order-card__leadtime"><span>PREPARACIÓN Y DESPACHO</span><strong>{preparation.label}</strong><small>{cutoffCopy} El transporte añade su propio plazo.</small></p>
            {addedToCart ? (
              <a className="dti-button dti-button--accent dti-order-card__submit" href={publicRoutes.carrito}>Ver carrito <span aria-hidden="true">↗</span></a>
            ) : (
              <button className="dti-button dti-button--accent dti-order-card__submit" disabled={!price.valid || !selectedFile || !artworkCanContinue} onClick={handleAddToCart} type="button">Añadir al carrito <span aria-hidden="true">↗</span></button>
            )}
            <p className="dti-order-card__disclaimer">Solicitud de prueba local. No se envía un pedido real ni se realiza ningún cobro.</p>
          </aside>
        </div>
      </section>

      <section className="dti-final-note" data-animate="reveal">
        <p className="dti-eyebrow"><span /> CLARIDAD EN CADA PASO</p>
        <h2>DTF por metro.<br /><em>DTI para producir.</em></h2>
        <p>Si buscas DTF por metro, has llegado al producto correcto: DTI Innuro de Ridaos Print, preparado en Barcelona.</p>
        <a className="dti-text-link" href="#dti-configurator" onClick={(event) => { event.preventDefault(); scrollToSection('dti-configurator') }}>Volver al configurador ↑</a>
      </section>
    </PageShell>
  )
}

export default DTFPage
