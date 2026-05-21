import { useMemo, useRef, useState } from 'react'
import type { ArtworkPreviewSummary, ArtworkUploadFlowState } from '../../artwork-upload'
import { resolveArtworkRuleForEntry } from '../../artwork-upload'
import { getContinueShoppingHref, getQuoteHref, publicRoutes } from '../../../lib/navigation'
import type { CatalogCategoryKey } from '../../../types/product'
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

type ProductExperiencePageProps = {
  category: CatalogCategoryKey
}

/**
 * Editable Zone: PRODUCT_DETAIL
 * Content: src/features/products/product-detail/data/productExperienceContent.ts
 * Visual component: src/features/products/product-detail/ProductExperiencePage.tsx
 */
export function ProductExperiencePage({ category }: ProductExperiencePageProps) {
  const pageRef = useRef<HTMLElement | null>(null)
  const {
    pageConfig,
    selectedProduct,
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
  } = useProductDetailState(category)
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

  if (!selectedProduct) {
    return null
  }

  const artworkRuleKey = resolveArtworkRuleForEntry(selectedProduct)
  const artworkGateBlocked = Boolean(selectedFile) && !artworkState.confirmed

  return (
    <ProductExperienceLayout
      className={pageConfig.className}
      configurator={
        enabled.has('configurator') ? (
          <ProductConfiguratorSection
            artworkRuleKey={artworkRuleKey}
            config={config}
            ctaArea={
              <>
                <button
                  className="action-button"
                  disabled={Boolean(isDirectFlow && (!estimate?.canAddToCart || artworkGateBlocked))}
                  onClick={() => handlePrimaryAction(artworkState.summary)}
                  type="button"
                >
                  {isDirectFlow ? 'Anadir al carrito' : 'Solicitar presupuesto'}
                </button>
                <a className="action-button action-button-muted action-link-button" href={primaryHref}>
                  {isDirectFlow ? 'Solicitar presupuesto' : 'Abrir formulario'}
                </a>
              </>
            }
            entry={selectedProduct}
            fieldErrors={fieldErrors}
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
      gallery={enabled.has('gallery') ? <ProductGallerySection frames={pageConfig.galleryFrames} /> : null}
      hero={
        enabled.has('hero') ? (
          <ProductHeroSection
            description={contentDescription}
            eyebrow={contentEyebrow}
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
      specs={enabled.has('specs') ? <ProductSpecsSection entry={selectedProduct} /> : null}
      stickySummary={
        enabled.has('sticky-summary') ? (
          <ProductStickySummarySection
            entry={selectedProduct}
            estimate={estimate}
            message={message}
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
            summaryTitle={
              selectedProduct.purchaseMode === 'quote'
                ? 'Referencia comercial'
                : selectedProduct.purchaseMode === 'hybrid'
                  ? 'Estimacion preparada'
                  : 'Precio en vivo'
            }
          />
        ) : null
      }
      story={enabled.has('story') ? <ProductStorySection blocks={pageConfig.storyBlocks} /> : null}
    />
  )
}

export default ProductExperiencePage
