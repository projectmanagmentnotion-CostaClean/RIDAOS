import { useMemo, useRef, useState } from 'react'
import type { ArtworkPreviewSummary, ArtworkUploadFlowState } from '../../artwork-upload'
import { resolveArtworkRuleForEntry } from '../../artwork-upload'
import { getContinueShoppingHref, getQuoteHref, publicRoutes } from '../../../lib/navigation'
import type { CatalogCategoryKey, ConfiguratorField } from '../../../types/product'
import { ProductExperienceLayout } from './layouts/ProductExperienceLayout'
import { useProductDetailState } from './hooks/useProductDetailState'
import { useProductExperienceMotion } from './motion/useProductExperienceMotion'
import { ProductConfiguratorSection } from './sections/ProductConfiguratorSection'
import { ProductFaqSection } from './sections/ProductFaqSection'
import { ProductFinalCtaSection } from './sections/ProductFinalCtaSection'
import { ProductGallerySection } from './sections/ProductGallerySection'
import { ProductHeroSection } from './sections/ProductHeroSection'
import { ProductProcessSection } from './sections/ProductProcessSection'
import { ProductRecommendationsSection } from './sections/ProductRecommendationsSection'
import { ProductSpecsSection } from './sections/ProductSpecsSection'
import { ProductStickySummarySection } from './sections/ProductStickySummarySection'
import { ProductStorySection } from './sections/ProductStorySection'
import { ProductTemplateDownloads } from '../../print-templates'
import { ProductOptionAssetPanel } from '../../product-options'
import {
  FrequentlyCombinedSection,
  InternalLinkGrid,
  PopularLocalServicesSection,
  RelatedGuidesSection,
  RelatedProductsSection,
  RelatedServicesSection,
  useDiscoverability,
} from '../../discoverability'

type ProductExperiencePageProps = {
  category: CatalogCategoryKey
  initialProductId?: string
  allowedProductIds?: string[]
}

function getFieldDisplayValue(field: ConfiguratorField, value: string) {
  if (!value) {
    return null
  }

  if (field.type === 'select' || field.type === 'variant' || field.type === 'size') {
    return field.options.find((option) => option.value === value)?.label ?? value
  }

  if (field.type === 'quantity') {
    return `${value} uds`
  }

  if (field.type === 'meters') {
    return `${value} m`
  }

  if (field.type === 'area') {
    return `${value} m2`
  }

  return value
}

/**
 * Editable Zone: PRODUCT_DETAIL
 * Content: src/features/products/product-detail/data/productExperienceContent.ts
 * Visual component: src/features/products/product-detail/ProductExperiencePage.tsx
 */
export function ProductExperiencePage({
  category,
  initialProductId,
  allowedProductIds,
}: ProductExperiencePageProps) {
  const pageRef = useRef<HTMLElement | null>(null)
  const {
    pageConfig,
    selectedProduct,
    displayEntry,
    optionDefinition,
    selectedFile,
    config,
    estimate,
    fieldErrors,
    message,
    contentTitle,
    contentEyebrow,
    contentDescription,
    handleConfigChange,
    handleFileChange,
    handlePrimaryAction,
    isDirectFlow,
  } = useProductDetailState(category, initialProductId, allowedProductIds)
  const [artworkState, setArtworkState] = useState<{
    metadata: ArtworkUploadFlowState['metadata']
    summary: ArtworkPreviewSummary | null
    confirmed: boolean
  }>({
    metadata: null,
    summary: null,
    confirmed: false,
  })

  useProductExperienceMotion(pageRef)

  const primaryHref = useMemo(() => getQuoteHref(category === 'accesorios' ? 'otro' : category), [category])
  const enabled = new Set(pageConfig.sections)
  const discoverability = useDiscoverability({ category, entry: displayEntry ?? selectedProduct })
  const summaryItems = useMemo(() => {
    if (!optionDefinition) {
      return []
    }

    return optionDefinition.fields
      .filter((field) => !['file', 'notes'].includes(field.type) && field.key !== 'product')
      .map((field) => {
        const displayValue = getFieldDisplayValue(field, config[field.key] ?? '')

        if (!displayValue) {
          return null
        }

        return {
          label: field.label,
          value: displayValue,
        }
      })
      .filter(Boolean)
      .slice(0, 5) as Array<{ label: string; value: string }>
  }, [config, optionDefinition])

  if (!selectedProduct || !displayEntry) {
    return null
  }

  const artworkRuleKey = optionDefinition?.prepressRuleKey ?? resolveArtworkRuleForEntry(displayEntry)
  const artworkGateBlocked = Boolean(selectedFile) && !artworkState.confirmed
  const galleryFrames = optionDefinition
    ? pageConfig.galleryFrames.map((frame, index) => {
        const asset = optionDefinition.assetRequirements[index]
        if (!asset) {
          return frame
        }

        return {
          ...frame,
          assetFileName: asset.fileName,
          assetPath: asset.expectedPath,
          assetStatus: asset.status,
        }
      })
    : pageConfig.galleryFrames
  const secondaryHeroHref =
    category === 'rotulacion'
      ? publicRoutes.portafolio
      : optionDefinition?.templateRuleKey
        ? publicRoutes.guia
        : publicRoutes.upload
  const primaryActionLabel = isDirectFlow ? 'Anadir al carrito' : 'Solicitar presupuesto'
  const secondaryActionLabel = isDirectFlow ? 'Solicitar presupuesto' : 'Abrir formulario'
  const primaryActionDisabled = Boolean(isDirectFlow && (!estimate?.canAddToCart || artworkGateBlocked))
  const renderPrimaryActionButtons = () => (
    <>
      <button
        className="action-button"
        disabled={primaryActionDisabled}
        onClick={() => handlePrimaryAction(artworkState.summary)}
        type="button"
      >
        {primaryActionLabel}
      </button>
      <a className="action-button action-button-muted action-link-button" href={primaryHref}>
        {secondaryActionLabel}
      </a>
    </>
  )

  return (
    <ProductExperienceLayout
      className={pageConfig.className}
      configurator={
        enabled.has('configurator') ? (
          <ProductConfiguratorSection
            artworkRuleKey={artworkRuleKey}
            config={config}
            ctaArea={renderPrimaryActionButtons()}
            entry={displayEntry}
            fieldErrors={fieldErrors}
            fields={displayEntry.configuratorFields}
            onConfigChange={handleConfigChange}
            onArtworkStateChange={setArtworkState}
            onFileChange={handleFileChange}
            selectedFile={selectedFile}
            supportSections={pageConfig.supportSections}
          />
        ) : null
      }
      faq={enabled.has('faq') ? <ProductFaqSection entryId={selectedProduct.id} faqTitle={pageConfig.faqTitle} /> : null}
      finalCta={enabled.has('final-cta') ? <ProductFinalCtaSection content={pageConfig.finalCta} /> : null}
      gallery={enabled.has('gallery') ? <ProductGallerySection frames={galleryFrames} /> : null}
      hero={
        enabled.has('hero') ? (
          <ProductHeroSection
            description={contentDescription}
            eyebrow={contentEyebrow}
            heroVisual={optionDefinition?.hero ?? pageConfig.heroVisual ?? null}
            primaryHref="#product-configurator"
            secondaryHref={secondaryHeroHref}
            stickerWords={pageConfig.heroStickerWords}
            title={contentTitle}
          />
        ) : null
      }
      pageRef={pageRef}
      process={enabled.has('process') ? <ProductProcessSection steps={pageConfig.processSteps} /> : null}
      recommendations={
        enabled.has('recommendations') ? (
          <ProductRecommendationsSection items={pageConfig.recommendations} />
        ) : null
      }
      discoverability={
        <>
          <RelatedServicesSection items={discoverability.upsell?.suggestions ?? discoverability.hub.relatedServices} />
          <RelatedProductsSection items={discoverability.hub.relatedProducts} />
          <FrequentlyCombinedSection bundles={discoverability.frequentlyCombined} />
          <RelatedGuidesSection items={discoverability.hub.relatedGuides} />
          <PopularLocalServicesSection hubs={discoverability.local} />
          <InternalLinkGrid items={discoverability.internalLinks} title="Siguiente lectura por intencion" />
        </>
      }
      optionAssets={optionDefinition ? <ProductOptionAssetPanel definition={optionDefinition} /> : null}
      specs={enabled.has('specs') ? <ProductSpecsSection entry={displayEntry} /> : null}
      stickySummary={
        enabled.has('sticky-summary') ? (
          <ProductStickySummarySection
            entry={displayEntry}
            estimate={estimate}
            message={message}
            summaryAction={renderPrimaryActionButtons()}
            summaryItems={summaryItems}
            successLinks={
              isDirectFlow ? (
                <>
                  <a className="card-link" href={publicRoutes.carrito}>
                    Ir al carrito
                  </a>
                  <a className="card-link" href={getContinueShoppingHref()}>
                    Seguir comprando
                  </a>
                </>
              ) : (
                <>
                  <a className="card-link" href={primaryHref}>
                    Abrir formulario
                  </a>
                  <a className="card-link" href={publicRoutes.contacto}>
                    Contactar
                  </a>
                </>
              )
            }
            summaryAccent={optionDefinition?.hero.accent}
            summaryTitle={
              displayEntry.purchaseMode === 'quote'
                ? 'Referencia comercial'
                : displayEntry.purchaseMode === 'hybrid'
                  ? 'Estimacion preparada'
                  : 'Precio en vivo'
            }
          />
        ) : null
      }
      templateDownloads={
        enabled.has('configurator') ? (
          <ProductTemplateDownloads
            description="Plantillas recomendadas por producto para preparar el archivo con corte, sangrado y zona segura antes del upload."
            ruleKey={optionDefinition?.templateRuleKey ?? artworkRuleKey}
            title="Descargar plantilla recomendada"
          />
        ) : null
      }
      story={enabled.has('story') ? <ProductStorySection blocks={pageConfig.storyBlocks} /> : null}
    />
  )
}

export default ProductExperiencePage
