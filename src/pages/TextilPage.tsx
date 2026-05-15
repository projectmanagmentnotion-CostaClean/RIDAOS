import { useMemo, useState } from 'react'
import CatalogEntryPageTemplate from '../components/CatalogEntryPageTemplate'
import CatalogResultPanel from '../components/CatalogResultPanel'
import CommercialNoticeGroup from '../components/CommercialNoticeGroup'
import ConversionTrustBlock from '../components/ConversionTrustBlock'
import FaqBlock from '../components/FaqBlock'
import ObjectionHandlerBlock from '../components/ObjectionHandlerBlock'
import SeoContentBlock from '../components/SeoContentBlock'
import UploadGuidanceBlock from '../components/UploadGuidanceBlock'
import { getContentByEntryId } from '../catalog/content/contentSelectors'
import { addToCart } from '../lib/cart'
import { createCatalogCartItem } from '../lib/catalogCartAdapter'
import { getCatalogPricingResult } from '../lib/catalogPricingAdapter'
import { createInitialConfig, getRequiredFieldErrors, updateConfigValue, type ConfigState } from '../lib/configuratorState'
import { getContinueShoppingHref, getQuoteHref, publicRoutes } from '../lib/navigation'
import { getProductsByCategory, getProductById, resolveLegalNoticeItems } from '../lib/products'

function TextilPage() {
  const products = getProductsByCategory('textil').filter((product) => product.category === 'textil')
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [config, setConfig] = useState<ConfigState>(() => (products[0] ? createInitialConfig(products[0]) : {}))
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({})

  const selectedProduct = useMemo(() => getProductById(productId), [productId])
  const content = useMemo(
    () => (selectedProduct ? getContentByEntryId(selectedProduct.id) : null),
    [selectedProduct],
  )

  const estimate = useMemo(
    () => (selectedProduct ? getCatalogPricingResult(selectedProduct, config) : null),
    [config, selectedProduct],
  )

  const handleConfigChange = (key: string, value: string) => {
    if ((key === 'product' || key === 'variant') && getProductById(value)) {
      const nextProduct = getProductById(value)

      if (nextProduct) {
        setProductId(value)
        setConfig(createInitialConfig(nextProduct))
        setFieldErrors({})
      }

      return
    }

    setConfig((current) => updateConfigValue(current, key, value))
    setFieldErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleAddToCart = () => {
    if (!selectedProduct) {
      return
    }

    const nextErrors = getRequiredFieldErrors(selectedProduct, config)
    setFieldErrors(nextErrors)

    if (!estimate || Object.keys(nextErrors).length > 0 || !estimate.canAddToCart) {
      return
    }

    addToCart(
      createCatalogCartItem(selectedProduct, config, estimate, {
        notes: config.notes?.trim() ?? '',
      }),
    )
    setMessage('Producto textil anadido al carrito.')
  }

  if (!selectedProduct) {
    return null
  }

  return (
    <CatalogEntryPageTemplate
      className="textil-page"
      config={config}
      ctaArea={
        <>
          <button
            className="action-button"
            disabled={Boolean(!estimate?.canAddToCart)}
            onClick={handleAddToCart}
            type="button"
          >
            {content?.primaryCta.label ?? 'Anadir al carrito'}
          </button>
          <a className="action-button action-button-muted action-link-button" href={content?.secondaryCta.href ?? getQuoteHref('textil')}>
            {content?.secondaryCta.label ?? 'Solicitar presupuesto'}
          </a>
        </>
      }
      description={content?.intro ?? 'Prendas y accesorios textiles con lectura clara por cantidad, acabado y siguiente paso comercial.'}
      entry={selectedProduct}
      eyebrow={content?.eyebrow ?? 'Estampados / textil'}
      fieldErrors={fieldErrors}
      onConfigChange={handleConfigChange}
      resultArea={
        <>
          {estimate ? <CatalogResultPanel result={estimate} title="Estimacion" /> : null}
          <CommercialNoticeGroup items={resolveLegalNoticeItems(selectedProduct.legalNotes)} />
          {selectedProduct.notes?.length ? (
            <article className="content-card">
              <p className="section-label">Notas del catalogo</p>
              <ul className="hint-list">
                {selectedProduct.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>
          ) : null}
          {message ? <p className="inline-notice">{message}</p> : null}
          {message ? (
            <div className="catalog-cta-row">
              <a className="card-link" href={publicRoutes.carrito}>Ir al carrito</a>
              <a className="card-link" href={getContinueShoppingHref()}>Seguir comprando</a>
            </div>
          ) : null}
        </>
      }
      title={content?.h1 ?? 'Textil listo para estimar.'}
    >
      <SeoContentBlock entryId={selectedProduct.id} />
      <SeoContentBlock entryId={selectedProduct.id} mode="useCases" title="Para que pedidos encaja mejor." />
      <UploadGuidanceBlock entryId={selectedProduct.id} />
      <ConversionTrustBlock entryId={selectedProduct.id} />
      <ObjectionHandlerBlock entryId={selectedProduct.id} />
      <FaqBlock entryId={selectedProduct.id} title="FAQ textil" />
    </CatalogEntryPageTemplate>
  )
}

export default TextilPage
