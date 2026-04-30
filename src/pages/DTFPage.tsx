import { useEffect, useMemo, useRef, useState } from 'react'
import CtaPanel from '../components/CtaPanel'
import FAQSection from '../components/FAQSection'
import MetricCard from '../components/MetricCard'
import PageShell from '../components/PageShell'
import ProcessSteps from '../components/ProcessSteps'
import SectionHeader from '../components/SectionHeader'
import TrustGrid from '../components/TrustGrid'
import {
  initCinematicScroll,
  initCursorAwareReveals,
  initUrbanTextMotion,
} from '../lib/animations'
import { addToCart } from '../lib/cart'
import {
  BASE_PRICE_PER_METER,
  calculateDTFPricing,
  type DTFQuality,
  type DTFUrgency,
} from '../lib/pricing'
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

const dtfFaq = [
  {
    question: 'DTF por metro',
    answer: 'El precio base parte de 14,50 EUR por metro antes de extras de calidad o urgencia.',
  },
  {
    question: 'Archivos',
    answer: 'Puedes revisar nombre, tipo y miniatura cuando el navegador la soporte.',
  },
  {
    question: 'Produccion',
    answer: 'La produccion final queda preparada para una revision tecnica posterior.',
  },
  {
    question: 'Envios o recogida',
    answer: 'La capa operativa existe como placeholder y se completara en fases futuras.',
  },
]

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
          description="Configura tu pedido base por metraje, revisa la pieza antes de enviar y deja preparada una base escalable para futuras validaciones tecnicas."
          eyebrow="Producto principal"
          hero
          stickerWords={['DTF', 'archivo']}
          title="DTF por metro."
          titleLines={['DTF', 'POR METRO']}
        />
      </section>

      <section className="cinematic-scene dtf-cinematic-scene" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="dtf-cinematic">
        <div className="cinematic-scene-copy">
          <p className="eyebrow">Cockpit motion / product preview</p>
          <div className="cinematic-word cinematic-word-compact type-condensed type-negative" data-cursor="fisheye">
            <span>PREVIEW</span>
            <span>FLOW</span>
          </div>
        </div>
        <div className="cinematic-mask" data-cursor="invert">
          <div aria-label="Imagen placeholder: DTF sheet" className="cinematic-image image-placeholder image-placeholder-dtf-sheet">
            <span className="image-placeholder-label">Imagen placeholder: DTF sheet</span>
          </div>
        </div>
        <div className="scroll-bridge">
          <span className="bridge-chip">configura</span>
          <span className="bridge-chip">previsualiza</span>
          <span className="bridge-chip">revisa</span>
          <span className="bridge-chip">produce</span>
        </div>
      </section>

      <div className="split-grid dtf-cockpit-layout dtf-layout" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="dtf-cockpit">
        <article className="content-card dtf-cockpit-panel hover-lift" data-animate="panel" data-cursor="invert" data-scroll-scene="dtf-form" tabIndex={0}>
          <SectionHeader eyebrow="Configurador" title="Pedido DTF sin backend." />

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
                placeholder="Ej. 2.5"
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
                placeholder="Instrucciones de color, corte, orden de trabajo o cualquier detalle util."
                rows={5}
                value={notes}
              />
            </label>

            <div className="form-actions">
              <button className="action-button action-button-muted" data-cursor="invert" onClick={handleAddToCart} type="button">
                Anadir al carrito
              </button>
              <button className="action-button" data-cursor="invert" onClick={handleSimulateOrder} type="button">
                Simular pedido
              </button>
            </div>

            {cartMessage ? <p className="inline-notice">{cartMessage}</p> : null}
            {cartMessage ? (
              <a className="card-link" data-cursor="invert" href="#/carrito">
                Ir al carrito
              </a>
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
                    <p>El navegador no genera miniatura directa. El archivo queda preparado para revision visual.</p>
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
                <p>Selecciona un archivo para activar la previsualizacion y la futura capa de revision.</p>
              </div>
            )}
          </article>

          <article className="content-card preflight-card hover-lift premium-preflight-panel" data-animate="panel" data-cursor="invert" data-scroll-scene="dtf-preflight" tabIndex={0}>
            <SectionHeader eyebrow="Preflight mock" title="Checks preparados para validacion futura." />
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
                <span>Revision pendiente</span>
                <strong>Mock ready</strong>
              </div>
              <div className="preflight-item">
                <span>Sangrado pendiente de validar</span>
                <strong>Proxima fase</strong>
              </div>
              <div className="preflight-item">
                <span>Resolucion pendiente de validar</span>
                <strong>Proxima fase</strong>
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
            <ul className="placeholder-list">
              <li>Calidad: {qualityLabels[quality]}</li>
              <li>Urgencia: {urgencyLabels[urgency]}</li>
              <li>Archivo: {selectedFile ? selectedFile.name : 'Pendiente de carga'}</li>
              <li>Notas: {notes.trim() ? 'Incluidas en esta simulacion' : 'Sin notas adicionales'}</li>
            </ul>
          </article>

          {simulation ? (
            <CtaPanel
              actions={<a className="action-button action-link-button" href="#/carrito">Continuar al carrito</a>}
              className="success-card"
              description={`Metros: ${simulation.meters} | Calidad: ${qualityLabels[simulation.quality]} | Urgencia: ${urgencyLabels[simulation.urgency]} | Archivo: ${simulation.fileName} | Total: ${formatCurrency(simulation.total)}`}
              label="Pedido simulado correctamente"
              title="La configuracion esta lista para seguir en el flujo."
            />
          ) : null}
        </div>
      </div>

      <section className="content-section" data-animate="reveal" data-scroll-scene="dtf-process">
        <SectionHeader eyebrow="Como funciona" title="Del archivo al pedido en cinco pasos." />
        <ProcessSteps />
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="dtf-trust">
        <SectionHeader eyebrow="Confianza" title="Checks y aprobacion antes de producir." />
        <TrustGrid />
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="dtf-faq">
        <SectionHeader eyebrow="FAQ" title="Dudas frecuentes del configurador." />
        <FAQSection items={dtfFaq} />
      </section>
    </PageShell>
  )
}

export default DTFPage
