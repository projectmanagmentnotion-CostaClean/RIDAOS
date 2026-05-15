import { useMemo, useState } from 'react'
import CatalogEntryPageTemplate from '../components/CatalogEntryPageTemplate'
import CatalogResultPanel from '../components/CatalogResultPanel'
import CommercialNoticeGroup from '../components/CommercialNoticeGroup'
import ConfiguratorSupportBlock from '../components/ConfiguratorSupportBlock'
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
import { getProductById, getProductsByCategory, resolveLegalNoticeItems } from '../lib/products'

function AccesoriosPage() {
  const products = getProductsByCategory('accesorios')
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

  const handleFileChange = (_key: string, file: File | null) => {
    setConfig((current) => updateConfigValue(current, 'file', file?.name ?? ''))
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

    const fileName = config.file || 'Sin archivo adjunto'
    addToCart(
      createCatalogCartItem(selectedProduct, config, estimate, {
        fileName,
        formatLabel: fileName === 'Sin archivo adjunto' ? 'PENDIENTE' : 'ARCHIVO',
      }),
    )
    setMessage('Accesorio anadido al carrito.')
  }

  if (!selectedProduct) {
    return null
  }

  return (
    <CatalogEntryPageTemplate
      className="accesorios-page"
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
          <a className="action-button action-button-muted action-link-button" href={content?.secondaryCta.href ?? getQuoteHref('otro')}>
            {content?.secondaryCta.label ?? 'Solicitar presupuesto'}
          </a>
        </>
      }
      description={content?.intro ?? 'Llaveros, pegatinas y piezas pequenas con configuracion rapida y paso directo al carrito.'}
      entry={selectedProduct}
      eyebrow={content?.eyebrow ?? 'Accesorios'}
      fieldErrors={fieldErrors}
      onConfigChange={handleConfigChange}
      onFileChange={handleFileChange}
      supportArea={
        <ConfiguratorSupportBlock
          sections={[
            {
              label: 'Preparacion',
              title: 'Tirada, formato y acabado sin rodeos.',
              items: [
                'Las tiradas visibles estan pensadas para promociones y series cortas.',
                'Adjunta archivo cuando corte, laminado o forma dependan del arte final.',
                'Las notas ayudan a indicar brillo, mate o referencias concretas.',
              ],
            },
            {
              label: 'Siguiente paso',
              title: 'Compra directa para lotes claros.',
              items: [
                estimate?.quoteRequired
                  ? 'Si la combinacion no encaja en tramo, conviene pasar a presupuesto.'
                  : 'Cuando la tirada encaja, puedes pasar al carrito con una base clara.',
                'Los acabados especiales se validan antes de fabricar.',
                selectedProduct.productionTime ?? 'El plazo final depende de cantidad, archivo y acabado.',
              ],
            },
          ]}
        />
      }
      resultArea={
        <>
          {estimate ? <CatalogResultPanel result={estimate} title="Precio" /> : null}
          <CommercialNoticeGroup items={resolveLegalNoticeItems(selectedProduct.legalNotes)} />
          {message ? <p className="inline-notice">{message}</p> : null}
          {message ? (
            <div className="catalog-cta-row">
              <a className="card-link" href={publicRoutes.carrito}>Ir al carrito</a>
              <a className="card-link" href={getContinueShoppingHref()}>Seguir comprando</a>
            </div>
          ) : null}
        </>
      }
      title={content?.h1 ?? 'Accesorios con lectura rapida.'}
    >
      <SeoContentBlock entryId={selectedProduct.id} />
      <SeoContentBlock entryId={selectedProduct.id} mode="useCases" />
      <UploadGuidanceBlock entryId={selectedProduct.id} />
      <ConversionTrustBlock entryId={selectedProduct.id} />
      <ObjectionHandlerBlock entryId={selectedProduct.id} />
      <FaqBlock entryId={selectedProduct.id} title="FAQ accesorios" />
    </CatalogEntryPageTemplate>
  )
}

export default AccesoriosPage
