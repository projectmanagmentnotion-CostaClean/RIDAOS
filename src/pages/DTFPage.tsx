import { useEffect, useMemo, useRef } from 'react'
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
import { getContentByEntryId } from '../catalog/content/contentSelectors'
import { dtfPageContent } from '../content/dtfContent'
import { faqContent } from '../content/faqContent'
import { pricingContent } from '../content/pricingContent'
import { DtfOptionCards } from '../features/dtf/components/DtfOptionCards'
import { DtfPresetSelector } from '../features/dtf/components/DtfPresetSelector'
import { DtfProgressSteps } from '../features/dtf/components/DtfProgressSteps'
import { DtfStickySummaryCard } from '../features/dtf/components/DtfStickySummaryCard'
import { useDtfConfiguratorState } from '../features/dtf/hooks/useDtfConfiguratorState'
import { initCinematicScroll, initCursorAwareReveals, initUrbanTextMotion } from '../lib/animations'
import { publicRoutes } from '../lib/navigation'
import { BASE_PRICE_PER_METER } from '../lib/pricing'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(pricingContent.locale, {
    style: 'currency',
    currency: pricingContent.currency,
  }).format(value)

const premiumDocumentFormats = ['PDF', 'AI', 'EPS', 'ZIP', 'TIFF']

/**
 * Editable Zone: DTF_CONFIGURATOR
 * Content: src/content/dtfContent.ts
 * Visual component: src/pages/DTFPage.tsx
 */
function DTFPage() {
  const pageRef = useRef<HTMLElement | null>(null)
  const dtfContent = useMemo(() => getContentByEntryId(dtfEntry.id), [])
  const {
    meters,
    setMeters,
    quality,
    setQuality,
    urgency,
    setUrgency,
    turnaroundPreference,
    setTurnaroundPreference,
    setFile,
    notes,
    setNotes,
    selectedExtras,
    toggleExtra,
    errors,
    simulation,
    cartMessage,
    pricing,
    filePreview,
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
          description={dtfContent?.intro ?? dtfPageContent.hero.fallbackDescription}
          eyebrow={dtfContent?.eyebrow ?? dtfPageContent.hero.fallbackEyebrow}
          hero
          stickerWords={['DTF', 'archivo']}
          title={dtfContent?.h1 ?? dtfPageContent.hero.fallbackTitle}
          titleLines={dtfPageContent.hero.titleLines}
        />
      </section>

      <section className="content-section premium-progress-section">
        <div>
          <p className="section-label">{dtfPageContent.progress.eyebrow}</p>
          <h2>{dtfPageContent.progress.title}</h2>
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
          <SectionHeader eyebrow="Configurador" title="Configura un pedido DTF con lectura de taller." />

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
              <span className="file-meta">{dtfPageContent.fieldHelp.meters}</span>
              <DtfPresetSelector
                onSelect={setMeters}
                presets={dtfPageContent.meterPresets}
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

            <label className="field-group" htmlFor="dtf-file">
              <span className="field-label">Archivo</span>
              <input
                id="dtf-file"
                className="form-input form-input-file"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                type="file"
              />
              <span className="file-meta">
                {filePreview?.fileName ?? dtfPageContent.fieldHelp.fileNameFallback}
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

            <div className="form-actions">
              <button className="action-button" data-cursor="sales" onClick={handleSimulateOrder} type="button">
                {dtfContent?.secondaryCta.label ?? dtfPageContent.actions.prepareLabel}
              </button>
              <button
                className="action-button action-button-muted"
                data-cursor="sales"
                onClick={handleAddToCart}
                type="button"
              >
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
          <DtfStickySummaryCard
            base={`${formatCurrency(BASE_PRICE_PER_METER)}/metro`}
            extras={formatCurrency(pricing.extras)}
            fileReady={Boolean(filePreview)}
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
                    <p>
                      El navegador no genera miniatura directa. Aun asi, el archivo queda listo para
                      revisarlo antes de confirmar el trabajo.
                    </p>
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
              <div className="empty-state premium-empty-state">
                <p>
                  Carga una pieza para activar la miniatura, validar formato y dejar el panel listo
                  para la comprobacion tecnica.
                </p>
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
            <SectionHeader eyebrow="Comprobacion previa" title="Resumen claro antes de confirmar el pedido." />
            <div className="preflight-list">
              <div className="preflight-item">
                <span>Formato detectado</span>
                <strong>{filePreview ? filePreview.formatLabel : 'Pendiente'}</strong>
              </div>
              <div className="preflight-item">
                <span>Archivo seleccionado</span>
                <strong>{filePreview ? 'Si' : 'Pendiente'}</strong>
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
                <strong>Se comprueba antes de fabricar</strong>
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
