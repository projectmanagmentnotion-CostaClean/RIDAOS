import { useEffect, useMemo, useRef, useState } from 'react'
import CommercialNoticeGroup from '../components/CommercialNoticeGroup'
import ConversionTrustBlock from '../components/ConversionTrustBlock'
import CtaPanel from '../components/CtaPanel'
import FaqBlock from '../components/FaqBlock'
import MetricCard from '../components/MetricCard'
import MouseMotionVisual from '../components/MouseMotionVisual'
import ObjectionHandlerBlock from '../components/ObjectionHandlerBlock'
import PageShell from '../components/PageShell'
import ProcessSteps from '../components/ProcessSteps'
import SeoContentBlock from '../components/SeoContentBlock'
import SectionHeader from '../components/SectionHeader'
import TrustGrid from '../components/TrustGrid'
import UploadGuidanceBlock from '../components/UploadGuidanceBlock'
import { getContentByEntryId } from '../catalog/content/contentSelectors'
import {
  initCinematicScroll,
  initCursorAwareReveals,
  initUrbanTextMotion,
} from '../lib/animations'
import { addToCart } from '../lib/cart'
import { publicRoutes } from '../lib/navigation'
import {
  BASE_PRICE_PER_METER,
  calculateDTFPricing,
  type DTFQuality,
  type DTFUrgency,
} from '../lib/pricing'
import { dtfEntry } from '../catalog/products/dtf'
import type { CartItem } from '../types/ecommerce'

type SimulationResult = {
  meters: number
  quality: DTFQuality
  urgency: DTFUrgency
  total: number
  fileName: string
}

type FilePreview = {
  canPreview: boolean
  fileName: string
  fileType: string
  fileSizeLabel: string
  formatLabel: string
  objectUrl?: string
}

const qualityLabels: Record<DTFQuality, string> = {
  standard: 'Standard',
  premium: 'Premium',
}

const urgencyLabels: Record<DTFUrgency, string> = {
  normal: 'Normal',
  express: 'Express',
}

const previewableTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
const premiumDocumentFormats = ['PDF', 'AI', 'EPS', 'ZIP', 'TIFF']
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

const formatFileSize = (file: File) => {
  if (file.size < 1024 * 1024) {
    return `${Math.max(file.size / 1024, 0.1).toFixed(1)} KB`
  }

  return `${(file.size / (1024 * 1024)).toFixed(2)} MB`
}

const detectFormatLabel = (file: File) => {
  const extension = file.name.split('.').pop()?.toUpperCase()

  if (extension) {
    return extension
  }

  if (file.type) {
    return file.type.toUpperCase()
  }

  return 'DESCONOCIDO'
}

function DTFPage() {
  const pageRef = useRef<HTMLElement | null>(null)
  const dtfContent = useMemo(() => getContentByEntryId(dtfEntry.id), [])
  const [meters, setMeters] = useState('1')
  const [quality, setQuality] = useState<DTFQuality>('standard')
  const [urgency, setUrgency] = useState<DTFUrgency>('normal')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<{ meters?: string; file?: string }>({})
  const [simulation, setSimulation] = useState<SimulationResult | null>(null)
  const [cartMessage, setCartMessage] = useState('')

  const metersValue = Number(meters)
  const pricing = useMemo(
    () => calculateDTFPricing(metersValue, quality, urgency),
    [metersValue, quality, urgency],
  )

  const previewUrl = useMemo(() => {
    if (!selectedFile || !previewableTypes.includes(selectedFile.type)) {
      return null
    }

    return URL.createObjectURL(selectedFile)
  }, [selectedFile])

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    },
    [previewUrl],
  )

  useEffect(() => {
    const scope = pageRef.current

    if (!scope) {
      return
    }

    const textContext = initUrbanTextMotion(scope)
    const cursorContext = initCursorAwareReveals(scope)
    const scrollContext = initCinematicScroll(scope)

    return () => {
      scrollContext.revert()
      textContext.revert()
      cursorContext.revert()
    }
  }, [])

  const filePreview = useMemo<FilePreview | null>(() => {
    if (!selectedFile) {
      return null
    }

    const formatLabel = detectFormatLabel(selectedFile)

    return {
      canPreview: Boolean(previewUrl) && previewableTypes.includes(selectedFile.type),
      fileName: selectedFile.name,
      fileType: selectedFile.type || 'Tipo no detectado',
      fileSizeLabel: formatFileSize(selectedFile),
      formatLabel,
      objectUrl: previewUrl ?? undefined,
    }
  }, [previewUrl, selectedFile])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedFile(nextFile)
    setErrors((current) => ({ ...current, file: undefined }))
  }

  const handleAddToCart = () => {
    const file = selectedFile
    const nextErrors: { meters?: string; file?: string } = {}

    if (!(metersValue > 0)) {
      nextErrors.meters = 'Introduce un metraje mayor que 0.'
    }

    if (!file) {
      nextErrors.file = 'Selecciona un archivo antes de anadir al carrito.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || !file) {
      return
    }

    const itemId = `dtf-${Date.now()}`
    const cartItem: CartItem = {
      id: itemId,
      productType: 'dtf',
      productName: 'DTF por metro',
      configuration: {
        meters: metersValue,
        quality,
        urgency,
        summary: [
          `${metersValue} m`,
          qualityLabels[quality],
          urgencyLabels[urgency],
          file.name,
        ],
        notes: notes.trim(),
      },
      pricing: {
        unitPrice: BASE_PRICE_PER_METER,
        unitLabel: 'metro',
        subtotal: pricing.subtotal,
        extras: pricing.extras,
        total: pricing.total,
      },
      artwork: {
        id: `upload-${Date.now()}`,
        itemId,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        formatLabel: detectFormatLabel(file),
        status: 'pending_review',
        uploadedAt: new Date().toISOString(),
        notes: notes.trim(),
      },
    }

    addToCart(cartItem)
    setErrors({})
    setCartMessage('Producto anadido al carrito local. Ya puedes revisar el pedido en la cesta.')
  }

  const handleSimulateOrder = () => {
    const nextErrors: { meters?: string; file?: string } = {}
    const file = selectedFile

    if (!(metersValue > 0)) {
      nextErrors.meters = 'Introduce un metraje mayor que 0.'
    }

    if (!file) {
      nextErrors.file = 'Selecciona un archivo antes de simular el pedido.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || !file) {
      setSimulation(null)
      return
    }

    setSimulation({
      meters: metersValue,
      quality,
      urgency,
      total: pricing.total,
      fileName: file.name,
    })
    setCartMessage('')
  }

  return (
    <PageShell className="premium-page" ref={pageRef}>
      <section className="dtf-hero-stage" data-motion="hero-stage" data-scroll-scene="dtf-hero">
        <div className="hero-flash-band" aria-hidden="true" />
        <SectionHeader
          className="premium-hero type-split"
          description={dtfContent?.intro ?? 'Configura tu pedido por metraje, revisa la pieza antes de enviar y deja el trabajo listo para una comprobacion clara.'}
          eyebrow={dtfContent?.eyebrow ?? 'Producto principal'}
          hero
          stickerWords={['DTF', 'archivo']}
          title={dtfContent?.h1 ?? 'DTF por metro.'}
          titleLines={['DTF', 'POR METRO']}
        />
      </section>

      <div className="split-grid dtf-cockpit-layout dtf-layout" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="dtf-cockpit">
        <article className="content-card dtf-cockpit-panel hover-lift" data-animate="panel" data-cursor="invert" data-scroll-scene="dtf-form" tabIndex={0}>
          <SectionHeader eyebrow="Configurador" title="Configura tu pedido DTF." />

          <div className="configurator-form">
            <label className="field-group" htmlFor="dtf-meters">
              <span className="field-label">Metros</span>
              <input
                id="dtf-meters"
                className="form-input"
                min="0"
                onChange={(event) => {
                  setMeters(event.target.value)
                  setErrors((current) => ({ ...current, meters: undefined }))
                }}
                step="0.1"
                type="number"
                value={meters}
              />
              {errors.meters ? <span className="field-error">{errors.meters}</span> : null}
            </label>

            <label className="field-group" htmlFor="dtf-quality">
              <span className="field-label">Calidad</span>
              <select
                id="dtf-quality"
                className="form-input"
                onChange={(event) => setQuality(event.target.value as DTFQuality)}
                value={quality}
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </label>

            <label className="field-group" htmlFor="dtf-urgency">
              <span className="field-label">Urgencia</span>
              <select
                id="dtf-urgency"
                className="form-input"
                onChange={(event) => setUrgency(event.target.value as DTFUrgency)}
                value={urgency}
              >
                <option value="normal">Normal</option>
                <option value="express">Express</option>
              </select>
            </label>

            <label className="field-group" htmlFor="dtf-file">
              <span className="field-label">Archivo</span>
              <input
                id="dtf-file"
                className="form-input form-input-file"
                onChange={handleFileChange}
                type="file"
              />
              <span className="file-meta">
                {selectedFile ? selectedFile.name : 'Ningun archivo seleccionado'}
              </span>
              {errors.file ? <span className="field-error">{errors.file}</span> : null}
            </label>

            <label className="field-group" htmlFor="dtf-notes">
              <span className="field-label">Notas</span>
              <textarea
                id="dtf-notes"
                className="form-input form-textarea"
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                value={notes}
              />
            </label>

            <div className="form-actions">
              <button className="action-button action-button-muted" data-cursor="invert" onClick={handleAddToCart} type="button">
                {dtfContent?.primaryCta.label ?? 'Anadir al carrito'}
              </button>
              <button className="action-button" data-cursor="invert" onClick={handleSimulateOrder} type="button">
                {dtfContent?.secondaryCta.label ?? 'Simular pedido'}
              </button>
            </div>

            {cartMessage ? <p className="inline-notice">{cartMessage}</p> : null}
            {cartMessage ? (
              <div className="catalog-cta-row">
                <a className="card-link" data-cursor="invert" href={publicRoutes.carrito}>
                  Ir al carrito
                </a>
                <a className="card-link" data-cursor="invert" href={publicRoutes.catalogo}>
                  Seguir comprando
                </a>
              </div>
            ) : null}
          </div>
        </article>

        <div className="summary-stack">
          <article
            className="content-card file-preview-card hover-lift premium-preview-panel"
            data-animate="panel"
            data-cursor="invert"
            data-depth="0.06"
            data-scroll-scene="dtf-preview"
            tabIndex={0}
          >
            <SectionHeader eyebrow="Previsualizacion del archivo" title="Lectura visual previa al pedido." />
            {filePreview ? (
              <div className="file-preview-stack">
                {filePreview.canPreview && filePreview.objectUrl ? (
                  <div className="preview-thumbnail-wrap" data-cursor="invert">
                    <img
                      alt={`Vista previa de ${filePreview.fileName}`}
                      className="preview-thumbnail"
                      src={filePreview.objectUrl}
                    />
                  </div>
                ) : (
                  <div className="premium-file-card">
                    <span className="premium-file-format">
                      {premiumDocumentFormats.includes(filePreview.formatLabel)
                        ? filePreview.formatLabel
                        : 'ARCHIVO'}
                    </span>
                    <h3>{filePreview.fileName}</h3>
                    <p>El navegador no genera miniatura directa. Aun asi, el archivo queda listo para revisarlo antes de confirmar el trabajo.</p>
                  </div>
                )}

                <div className="summary-list">
                  <div className="summary-row">
                    <span>Archivo</span>
                    <strong>{filePreview.fileName}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Tamano</span>
                    <strong>{filePreview.fileSizeLabel}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Tipo</span>
                    <strong>{filePreview.fileType}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Selecciona un archivo para activar la previsualizacion del pedido.</p>
              </div>
            )}
          </article>

          <article className="content-card preflight-card hover-lift premium-preflight-panel" data-animate="panel" data-cursor="invert" data-scroll-scene="dtf-preflight" tabIndex={0}>
            <SectionHeader eyebrow="Comprobacion previa" title="Resumen claro antes de confirmar el pedido." />
            <div className="preflight-list">
              <div className="preflight-item">
                <span>Formato detectado</span>
                <strong>{filePreview ? filePreview.formatLabel : 'Pendiente'}</strong>
              </div>
              <div className="preflight-item">
                <span>Archivo seleccionado</span>
                <strong>{selectedFile ? 'Si' : 'Pendiente'}</strong>
              </div>
              <div className="preflight-item">
                <span>Comprobacion del archivo</span>
                <strong>Se confirma al revisar el pedido</strong>
              </div>
              <div className="preflight-item">
                <span>Sangrado</span>
                <strong>Se revisa si el trabajo lo necesita</strong>
              </div>
              <div className="preflight-item">
                <span>Resolucion</span>
                <strong>Se comprueba antes de fabricar</strong>
              </div>
            </div>
          </article>

          <article className="content-card hover-lift premium-pricing-panel" data-animate="panel" data-cursor="invert" data-scroll-scene="dtf-pricing" tabIndex={0}>
            <SectionHeader eyebrow="Resumen en vivo" title="Precio listo para revisar." />
            <div className="pricing-metric-grid">
              <MetricCard className="hover-lift" label="Base" value={`${formatCurrency(BASE_PRICE_PER_METER)}/metro`} />
              <MetricCard className="hover-lift" label="Subtotal" value={formatCurrency(pricing.subtotal)} />
              <MetricCard className="hover-lift" label="Extras" value={formatCurrency(pricing.extras)} />
              <MetricCard className="hover-lift" label="Total" value={formatCurrency(pricing.total)} />
            </div>
            <ul className="hint-list">
              <li>Calidad: {qualityLabels[quality]}</li>
              <li>Urgencia: {urgencyLabels[urgency]}</li>
              <li>Archivo: {selectedFile ? selectedFile.name : 'Pendiente de carga'}</li>
              <li>Notas: {notes.trim() ? 'Incluidas en esta simulacion' : 'Sin notas adicionales'}</li>
            </ul>
          </article>

          {simulation ? (
            <CtaPanel
              actions={
                <>
                  <a className="action-button action-link-button" href={publicRoutes.carrito}>Continuar al carrito</a>
                  <a className="card-link" href={publicRoutes.guia}>Revisar guia de archivos</a>
                </>
              }
              className="success-card"
              description={`Metros: ${simulation.meters} | Calidad: ${qualityLabels[simulation.quality]} | Urgencia: ${urgencyLabels[simulation.urgency]} | Archivo: ${simulation.fileName} | Total: ${formatCurrency(simulation.total)}`}
              label="Pedido simulado correctamente"
              title="La configuracion esta lista para seguir en el flujo."
            />
          ) : null}

          <CommercialNoticeGroup noticeKeys={dtfEntry.legalNotes} />
        </div>
      </div>

      <section className="content-section content-grid-two">
        <article className="content-card motion-card">
          <SectionHeader eyebrow="Vista del pedido" title="Movimiento visual sin bloquear el configurador." />
          <p>El seguimiento del cursor solo anima esta capa decorativa. Los campos, enlaces y botones quedan por encima y siguen siendo clicables.</p>
          <MouseMotionVisual variant="dtf" />
        </article>
        <article className="content-card">
          <SectionHeader eyebrow="Preparacion" title="Archivo, metros y comprobacion en el mismo flujo." />
          <ul className="detail-list">
            <li>Define el metraje antes de avanzar.</li>
            <li>Adjunta el arte final cuando este listo.</li>
            <li>Confirma el pedido con el resumen visible.</li>
          </ul>
        </article>
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="dtf-process">
        <SectionHeader eyebrow="Como funciona" title="Del archivo al pedido en cinco pasos." />
        <ProcessSteps />
      </section>

      <section className="content-section content-grid-two" data-animate="reveal" data-scroll-scene="dtf-content">
        <SeoContentBlock entryId={dtfEntry.id} title="Por que este flujo convierte mejor." />
        <SeoContentBlock entryId={dtfEntry.id} mode="useCases" title="Cuando usarlo." />
      </section>

      <section className="content-section content-grid-two" data-animate="reveal" data-scroll-scene="dtf-guidance">
        <UploadGuidanceBlock entryId={dtfEntry.id} />
        <ConversionTrustBlock entryId={dtfEntry.id} title="Confianza para cerrar el pedido." />
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="dtf-trust">
        <SectionHeader eyebrow="Confianza" title="Confirmacion tecnica antes de fabricar." />
        <TrustGrid />
      </section>

      <ObjectionHandlerBlock entryId={dtfEntry.id} title="Objeciones antes de enviar archivo." />
      <FaqBlock entryId={dtfEntry.id} title="Dudas frecuentes del configurador." />
    </PageShell>
  )
}

export default DTFPage
