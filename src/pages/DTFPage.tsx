import { useEffect, useMemo, useRef, useState } from 'react'
import CommercialNoticeGroup from '../components/CommercialNoticeGroup'
import ConfiguratorSupportBlock from '../components/ConfiguratorSupportBlock'
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
import { dtfPageContent } from '../content/dtfContent'
import { faqContent } from '../content/faqContent'
import { pricingContent } from '../content/pricingContent'
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
  notes: string
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
  new Intl.NumberFormat(pricingContent.locale, {
    style: 'currency',
    currency: pricingContent.currency,
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

/**
 * Editable Zone: DTF_CONFIGURATOR
 * Content: src/content/dtfContent.ts
 * Visual component: src/pages/DTFPage.tsx
 */
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

  const dtfSummaryItems = useMemo(
    () => [
      { label: 'Metraje', value: metersValue > 0 ? `${metersValue} m` : 'Pendiente' },
      { label: 'Calidad', value: qualityLabels[quality] },
      { label: 'Urgencia', value: urgencyLabels[urgency] },
      { label: 'Archivo', value: selectedFile ? selectedFile.name : 'Pendiente de carga' },
      { label: 'Plazo', value: urgency === 'express' ? 'Se prioriza tras la comprobacion tecnica.' : 'Se agenda tras revisar el archivo.' },
    ],
    [metersValue, quality, selectedFile, urgency],
  )

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
          'Producto: DTF por metro',
          `Metraje: ${metersValue} m`,
          `Calidad: ${qualityLabels[quality]}`,
          `Urgencia: ${urgencyLabels[urgency]}`,
          `Archivo: ${file.name}`,
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
    setCartMessage('Pedido preparado en tu carrito. En el checkout registras la solicitud y revisamos el archivo antes de confirmar produccion y pago.')
  }

  const handleSimulateOrder = () => {
    const nextErrors: { meters?: string; file?: string } = {}
    const file = selectedFile

    if (!(metersValue > 0)) {
      nextErrors.meters = 'Introduce un metraje mayor que 0.'
    }

    if (!file) {
      nextErrors.file = 'Selecciona un archivo antes de preparar el pedido.'
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
      notes: notes.trim(),
    })
    setCartMessage('')
  }

  return (
    <PageShell className="premium-page" ref={pageRef}>
      <section className="dtf-hero-stage" data-motion="hero-stage" data-scroll-scene="dtf-hero">
        <div className="hero-flash-band" aria-hidden="true" />
        <SectionHeader
          className="premium-hero type-split"
          description={dtfContent?.intro ?? dtfPageContent.hero.fallbackDescription}
          eyebrow={dtfContent?.eyebrow ?? dtfPageContent.hero.fallbackEyebrow}
          hero
          stickerWords={['DTF', 'archivo']}
          title={dtfContent?.h1 ?? dtfPageContent.hero.fallbackTitle}
          titleLines={dtfPageContent.hero.titleLines}
        />
      </section>

      <div className="split-grid dtf-cockpit-layout dtf-layout" data-animate="reveal" data-motion="poster-stack" data-scroll-scene="dtf-cockpit">
        <article className="content-card dtf-cockpit-panel hover-lift" data-animate="panel" data-cursor-zone="conversion" data-scroll-scene="dtf-form" tabIndex={0}>
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
              <span className="file-meta">{dtfPageContent.fieldHelp.meters}</span>
              <div className="dtf-meter-presets">
                {dtfPageContent.meterPresets.map((preset) => (
                  <button
                    className={`meter-preset-button${meters === preset ? ' is-selected' : ''}`}
                    key={preset}
                    onClick={() => {
                      setMeters(preset)
                      setErrors((current) => ({ ...current, meters: undefined }))
                    }}
                    type="button"
                  >
                    {preset} m
                  </button>
                ))}
              </div>
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
              <span className="file-meta">{dtfPageContent.fieldHelp.quality}</span>
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
              <span className="file-meta">{dtfPageContent.fieldHelp.urgency}</span>
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
                {selectedFile ? selectedFile.name : dtfPageContent.fieldHelp.fileNameFallback}
              </span>
              <span className="file-meta">{dtfPageContent.fieldHelp.file}</span>
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
              <span className="file-meta">{dtfPageContent.fieldHelp.notes}</span>
            </label>

            <article className="dtf-summary-card">
              <p className="section-label">{dtfPageContent.summary.label}</p>
              <div className="summary-list compact-summary">
                {dtfSummaryItems.map((item) => (
                  <div className="summary-row" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
                <div className="summary-row summary-row-total">
                  <span>{dtfPageContent.summary.totalLabel}</span>
                  <strong>{formatCurrency(pricing.total)}</strong>
                </div>
              </div>
              <p className="catalog-result-caption">
                {dtfPageContent.summary.reviewCaption}
              </p>
            </article>

            <div className="form-actions">
              <button className="action-button" data-cursor="sales" onClick={handleSimulateOrder} type="button">
                {dtfContent?.secondaryCta.label ?? dtfPageContent.actions.prepareLabel}
              </button>
              <button className="action-button action-button-muted" data-cursor="sales" onClick={handleAddToCart} type="button">
                {dtfContent?.primaryCta.label ?? dtfPageContent.actions.addToCartLabel}
              </button>
            </div>

            {cartMessage ? <p className="inline-notice">{cartMessage}</p> : null}
            {cartMessage ? (
              <div className="catalog-cta-row">
                <a className="card-link" data-cursor="sales" href={publicRoutes.carrito}>
                  {dtfPageContent.actions.cartLabel}
                </a>
                <a className="card-link" data-cursor="interactive" href={publicRoutes.catalogo}>
                  {dtfPageContent.actions.keepShoppingLabel}
                </a>
              </div>
            ) : null}
          </div>

          <ConfiguratorSupportBlock
            sections={dtfPageContent.supportSections.map((section) => ({
              ...section,
              items:
                section.label === 'Antes de cerrar'
                  ? [
                      ...section.items,
                      dtfEntry.productionTime ??
                        'El plazo final se confirma tras revisar el archivo y la carga de trabajo.',
                    ]
                  : section.items,
            }))}
          />
        </article>

        <div className="summary-stack">
          <article
            className="content-card file-preview-card hover-lift premium-preview-panel"
            data-animate="panel"
            data-cursor="interactive"
            data-depth="0.06"
            data-scroll-scene="dtf-preview"
            tabIndex={0}
          >
            <SectionHeader eyebrow="Previsualizacion del archivo" title="Lectura visual previa al pedido." />
            {filePreview ? (
              <div className="file-preview-stack">
                {filePreview.canPreview && filePreview.objectUrl ? (
                  <div className="preview-thumbnail-wrap" data-cursor="interactive">
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
                <p>Selecciona un archivo para ver la pieza, revisar el formato detectado y confirmar el pedido con mas contexto.</p>
              </div>
            )}
          </article>

          <article className="content-card preflight-card hover-lift premium-preflight-panel" data-animate="panel" data-cursor="interactive" data-scroll-scene="dtf-preflight" tabIndex={0}>
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
                <strong>Se realiza antes de fabricar</strong>
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

          <article className="content-card hover-lift premium-pricing-panel" data-animate="panel" data-cursor-zone="conversion" data-scroll-scene="dtf-pricing" tabIndex={0}>
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
              <li>Notas: {notes.trim() ? 'Incluidas en esta configuracion' : 'Sin notas adicionales'}</li>
            </ul>
            <p className="catalog-result-caption">
              Referencia comercial antes de la comprobacion tecnica final del archivo y de la confirmacion de produccion.
            </p>
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
              description={`Metraje: ${simulation.meters} m | Calidad: ${qualityLabels[simulation.quality]} | Urgencia: ${urgencyLabels[simulation.urgency]} | Archivo: ${simulation.fileName} | Notas: ${simulation.notes || 'Sin notas'} | Total: ${formatCurrency(simulation.total)}`}
              label="Configuracion lista"
              title="La configuracion esta lista para pasar al carrito."
            />
          ) : null}

          <CommercialNoticeGroup noticeKeys={dtfEntry.legalNotes} />
        </div>
      </div>

      <section className="content-section content-grid-two">
        <article className="content-card motion-card">
          <SectionHeader eyebrow={dtfPageContent.motionPanel.eyebrow} title={dtfPageContent.motionPanel.title} />
          <p>{dtfPageContent.motionPanel.description}</p>
          <MouseMotionVisual variant="dtf" />
        </article>
        <article className="content-card">
          <SectionHeader eyebrow={dtfPageContent.preparationPanel.eyebrow} title={dtfPageContent.preparationPanel.title} />
          <ul className="detail-list">
            {dtfPageContent.preparationPanel.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="dtf-process">
        <SectionHeader eyebrow={dtfPageContent.process.eyebrow} title={dtfPageContent.process.title} />
        <ProcessSteps />
      </section>

      <section className="content-section content-grid-two" data-animate="reveal" data-scroll-scene="dtf-content">
        <SeoContentBlock entryId={dtfEntry.id} title={dtfPageContent.seoTitles.why} />
        <SeoContentBlock entryId={dtfEntry.id} mode="useCases" title={dtfPageContent.seoTitles.useCases} />
      </section>

      <section className="content-section content-grid-two" data-animate="reveal" data-scroll-scene="dtf-guidance">
        <UploadGuidanceBlock entryId={dtfEntry.id} />
        <ConversionTrustBlock entryId={dtfEntry.id} title={dtfPageContent.seoTitles.trust} />
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="dtf-trust">
        <SectionHeader eyebrow={dtfPageContent.trust.eyebrow} title={dtfPageContent.trust.title} />
        <TrustGrid />
      </section>

      <ObjectionHandlerBlock entryId={dtfEntry.id} title={faqContent.dtf.objectionsTitle} />
      <FaqBlock entryId={dtfEntry.id} title={faqContent.dtf.faqTitle} />
    </PageShell>
  )
}

export default DTFPage
