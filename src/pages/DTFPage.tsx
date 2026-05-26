import { useEffect, useRef, useState } from 'react'
import CommercialNoticeGroup from '../components/CommercialNoticeGroup'
import ConfiguratorSupportBlock from '../components/ConfiguratorSupportBlock'
import ConversionTrustBlock from '../components/ConversionTrustBlock'
import CtaPanel from '../components/CtaPanel'
import FaqBlock from '../components/FaqBlock'
import MouseMotionVisual from '../components/MouseMotionVisual'
import ObjectionHandlerBlock from '../components/ObjectionHandlerBlock'
import PageShell from '../components/PageShell'
import ProcessSteps from '../components/ProcessSteps'
import SeoContentBlock from '../components/SeoContentBlock'
import SectionHeader from '../components/SectionHeader'
import TrustGrid from '../components/TrustGrid'
import UploadGuidanceBlock from '../components/UploadGuidanceBlock'
import { dtfEntry } from '../catalog/products/dtf'
import { dtfPageContent } from '../content/dtfContent'
import { faqContent } from '../content/faqContent'
import { pricingContent } from '../content/pricingContent'
import { useCmsPreviewDocument } from '../features/cms-preview'
import { ArtworkUploadFlow, type ArtworkPreviewSummary, type ArtworkUploadFlowState } from '../features/artwork-upload'
import { DtfOptionCards } from '../features/dtf/components/DtfOptionCards'
import { DtfPresetSelector } from '../features/dtf/components/DtfPresetSelector'
import { DtfProgressSteps } from '../features/dtf/components/DtfProgressSteps'
import { DtfStickySummaryCard } from '../features/dtf/components/DtfStickySummaryCard'
import { useDtfConfiguratorState } from '../features/dtf/hooks/useDtfConfiguratorState'
import { ProductTemplateDownloads } from '../features/print-templates'
import { initCinematicScroll, initCursorAwareReveals, initUrbanTextMotion } from '../lib/animations'
import { publicRoutes } from '../lib/navigation'
import { BASE_PRICE_PER_METER } from '../lib/pricing'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(pricingContent.locale, {
    style: 'currency',
    currency: pricingContent.currency,
  }).format(value)

/**
 * Editable Zone: DTF_CONFIGURATOR
 * Content: src/content/dtfContent.ts
 * Visual component: src/pages/DTFPage.tsx
 * Artwork system:
 * - ARTWORK_UPLOAD_FLOW
 * - ARTWORK_PREVIEW_CANVAS
 * - ARTWORK_VALIDATION_RULES
 * - ARTWORK_PRODUCT_GUIDES
 * - ARTWORK_RECOMMENDATIONS
 */
function DTFPage() {
  const pageRef = useRef<HTMLElement | null>(null)
  const [artworkState, setArtworkState] = useState<{
    metadata: ArtworkUploadFlowState['metadata']
    summary: ArtworkPreviewSummary | null
    confirmed: boolean
  }>({
    metadata: null,
    summary: null,
    confirmed: false,
  })
  const previewDtfContent = useCmsPreviewDocument('src/content/dtfContent.ts', dtfPageContent)
  const {
    meters,
    setMeters,
    quality,
    setQuality,
    urgency,
    setUrgency,
    turnaroundPreference,
    setTurnaroundPreference,
    selectedFile,
    setFile,
    notes,
    setNotes,
    selectedExtras,
    toggleExtra,
    errors,
    simulation,
    cartMessage,
    pricing,
    summaryItems,
    handleAddToCart,
    handleSimulateOrder,
  } = useDtfConfiguratorState()

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

  return (
    <PageShell className="premium-page" ref={pageRef}>
      <section className="dtf-hero-stage" data-motion="hero-stage" data-scroll-scene="dtf-hero">
        <div className="hero-flash-band" aria-hidden="true" />
        <SectionHeader
          className="premium-hero type-split"
          description={previewDtfContent.hero.fallbackDescription}
          eyebrow={previewDtfContent.hero.fallbackEyebrow}
          hero
          stickerWords={['DTI', 'archivo']}
          title={previewDtfContent.hero.fallbackTitle}
          titleLines={previewDtfContent.hero.titleLines}
        />
      </section>

      <section className="content-section premium-progress-section">
        <div>
          <p className="section-label">{previewDtfContent.progress.eyebrow}</p>
          <h2>{previewDtfContent.progress.title}</h2>
        </div>
        <DtfProgressSteps />
      </section>

      <div
        className="split-grid dtf-cockpit-layout dtf-layout"
        data-animate="reveal"
        data-motion="poster-stack"
        data-scroll-scene="dtf-cockpit"
      >
        <article
          className="content-card dtf-cockpit-panel hover-lift"
          data-animate="panel"
          data-cursor-zone="conversion"
          data-scroll-scene="dtf-form"
          tabIndex={0}
        >
          <SectionHeader eyebrow="Configurador" title="Configura tu pedido DTI con una lectura clara y profesional." />

          <div className="configurator-form">
            <label className="field-group" htmlFor="dtf-meters">
              <span className="field-label">Metros</span>
              <input
                id="dtf-meters"
                className="form-input"
                min="0"
                onChange={(event) => setMeters(event.target.value)}
                step="0.1"
                type="number"
                value={meters}
              />
              <span className="file-meta">{previewDtfContent.fieldHelp.meters}</span>
              <DtfPresetSelector
                onSelect={setMeters}
                presets={previewDtfContent.meterPresets}
                value={meters}
              />
              {errors.meters ? <span className="field-error">{errors.meters}</span> : null}
            </label>

            <DtfOptionCards
              onQualityChange={setQuality}
              onToggleExtra={toggleExtra}
              onTurnaroundChange={setTurnaroundPreference}
              onUrgencyChange={setUrgency}
              quality={quality}
              selectedExtras={selectedExtras}
              turnaroundPreference={turnaroundPreference}
              urgency={urgency}
            />

            <label className="field-group" htmlFor="dtf-notes">
              <span className="field-label">Notas</span>
              <textarea
                id="dtf-notes"
                className="form-input form-textarea"
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                value={notes}
              />
              <span className="file-meta">{previewDtfContent.fieldHelp.notes}</span>
            </label>

            <ArtworkUploadFlow
              acceptedFormats=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.tiff,.zip"
              description="Sube el arte final, revisa guías de rollo DTI y confirma el archivo antes de añadirlo al carrito."
              file={selectedFile}
              onFileChange={setFile}
              onStateChange={setArtworkState}
              ruleKey="dtf_meter"
              title="Sube tu archivo DTI"
            />
            {errors.file ? <span className="field-error">{errors.file}</span> : null}

            <ProductTemplateDownloads
              compact
              description="Guia recomendada para preparar el metro DTI antes de exportar y subir el archivo."
              ruleKey="dtf_meter"
              title="Descargar plantilla DTI"
            />

            <div className="form-actions">
              <button
                className="action-button"
                data-cursor="sales"
                disabled={!artworkState.confirmed}
                onClick={handleSimulateOrder}
                type="button"
              >
                {previewDtfContent.actions.prepareLabel}
              </button>
              <button
                className="action-button action-button-muted"
                data-cursor="sales"
                disabled={!artworkState.confirmed}
                onClick={() => handleAddToCart(artworkState.summary)}
                type="button"
              >
                {previewDtfContent.actions.addToCartLabel}
              </button>
            </div>

            {cartMessage ? <p className="inline-notice">{cartMessage}</p> : null}
            {cartMessage ? (
              <div className="catalog-cta-row">
                <a className="card-link" data-cursor="sales" href={publicRoutes.carrito}>
                  {previewDtfContent.actions.cartLabel}
                </a>
                <a className="card-link" data-cursor="interactive" href={publicRoutes.catalogo}>
                  {previewDtfContent.actions.keepShoppingLabel}
                </a>
              </div>
            ) : null}
          </div>

          <ConfiguratorSupportBlock
            sections={previewDtfContent.supportSections.map((section) => ({
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
          <DtfStickySummaryCard
            base={`${formatCurrency(BASE_PRICE_PER_METER)}/metro`}
            extras={formatCurrency(pricing.extras)}
            fileReady={artworkState.confirmed}
            subtotal={formatCurrency(pricing.subtotal)}
            summaryItems={summaryItems}
            total={formatCurrency(pricing.total)}
          />

          <article
            className="content-card file-preview-card hover-lift premium-preview-panel"
            data-animate="panel"
            data-cursor="interactive"
            data-depth="0.06"
            data-scroll-scene="dtf-preview"
            tabIndex={0}
          >
            <SectionHeader eyebrow="Archivo confirmado" title="Resumen del archivo listo para revisar." />
            {artworkState.summary ? (
              <div className="summary-list">
                <div className="summary-row">
                  <span>Archivo</span>
                  <strong>{artworkState.summary.fileName}</strong>
                </div>
                <div className="summary-row">
                  <span>Estado</span>
                  <strong>{artworkState.summary.workflowStatus}</strong>
                </div>
                <div className="summary-row">
                  <span>Guía</span>
                  <strong>{artworkState.summary.estimatedPhysicalSizeLabel}</strong>
                </div>
              </div>
            ) : (
              <div className="empty-state premium-empty-state">
                <p>Sube y confirma el archivo para activar el resumen del rollo.</p>
              </div>
            )}
          </article>

          <article
            className="content-card preflight-card hover-lift premium-preflight-panel"
            data-animate="panel"
            data-cursor="interactive"
            data-scroll-scene="dtf-preflight"
            tabIndex={0}
          >
            <SectionHeader eyebrow="Comprobacion previa" title="Resumen claro antes de confirmar la solicitud." />
            <div className="preflight-list">
              <div className="preflight-item">
                <span>Formato detectado</span>
                <strong>{artworkState.summary ? artworkState.summary.formatLabel : 'Por confirmar'}</strong>
              </div>
              <div className="preflight-item">
                <span>Archivo seleccionado</span>
                <strong>{artworkState.summary ? 'Si' : 'Por confirmar'}</strong>
              </div>
              <div className="preflight-item">
                <span>Turnaround</span>
                <strong>{turnaroundPreference}</strong>
              </div>
              <div className="preflight-item">
                <span>Extras</span>
                <strong>{selectedExtras.length ? selectedExtras.join(' · ') : 'Sin extras'}</strong>
              </div>
              <div className="preflight-item">
                <span>Resolucion</span>
                <strong>{artworkState.summary?.workflowStatus === 'ready' ? 'Lista para revisar' : 'Requiere comprobacion'}</strong>
              </div>
            </div>
          </article>

          {simulation ? (
            <CtaPanel
              actions={
                <>
                  <a className="action-button action-link-button" href={publicRoutes.carrito}>
                    Continuar al carrito
                  </a>
                  <a className="card-link" href={publicRoutes.guia}>
                    Revisar guia de archivos
                  </a>
                </>
              }
            className="success-card"
              description={`Metraje: ${simulation.meters} m | Calidad: ${
                simulation.quality === 'premium' ? 'Premium' : 'Standard'
              } | Urgencia: ${simulation.urgency === 'express' ? 'Express' : 'Normal'} | Turnaround: ${
                simulation.turnaroundPreference
              } | Archivo: ${simulation.fileName} | Notas: ${simulation.notes || 'Sin notas'} | Total: ${formatCurrency(
              simulation.total,
            )}`}
            label="Configuracion lista"
            title="La configuracion esta lista para pasar al carrito."
          />
        ) : null}

          <CommercialNoticeGroup noticeKeys={dtfEntry.legalNotes} />
        </div>
      </div>

      <section className="content-section content-grid-two">
        <article className="content-card motion-card">
          <SectionHeader eyebrow={previewDtfContent.motionPanel.eyebrow} title={previewDtfContent.motionPanel.title} />
          <p>{previewDtfContent.motionPanel.description}</p>
          <MouseMotionVisual variant="dtf" />
        </article>
        <article className="content-card">
          <SectionHeader eyebrow={previewDtfContent.preparationPanel.eyebrow} title={previewDtfContent.preparationPanel.title} />
          <ul className="detail-list">
            {previewDtfContent.preparationPanel.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="dtf-process">
        <SectionHeader eyebrow={previewDtfContent.process.eyebrow} title={previewDtfContent.process.title} />
        <ProcessSteps />
      </section>

      <section className="content-section content-grid-two" data-animate="reveal" data-scroll-scene="dtf-content">
        <SeoContentBlock entryId={dtfEntry.id} title={previewDtfContent.seoTitles.why} />
        <SeoContentBlock entryId={dtfEntry.id} mode="useCases" title={previewDtfContent.seoTitles.useCases} />
      </section>

      <section className="content-section content-grid-two" data-animate="reveal" data-scroll-scene="dtf-guidance">
        <UploadGuidanceBlock entryId={dtfEntry.id} />
        <ConversionTrustBlock entryId={dtfEntry.id} title={previewDtfContent.seoTitles.trust} />
      </section>

      <section className="content-section" data-animate="reveal" data-scroll-scene="dtf-trust">
        <SectionHeader eyebrow={previewDtfContent.trust.eyebrow} title={previewDtfContent.trust.title} />
        <TrustGrid />
      </section>

      <ObjectionHandlerBlock entryId={dtfEntry.id} title={faqContent.dtf.objectionsTitle} />
      <FaqBlock entryId={dtfEntry.id} title={faqContent.dtf.faqTitle} />
    </PageShell>
  )
}

export default DTFPage

