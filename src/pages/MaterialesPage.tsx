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

function MaterialesPage() {
  const products = getProductsByCategory('materiales')
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

    addToCart(createCatalogCartItem(selectedProduct, config, estimate))
    setMessage('Material anadido al carrito.')
  }

  if (!selectedProduct) {
    return null
  }

  return (
    <CatalogEntryPageTemplate
      className="materiales-page"
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
          <a className="action-button action-button-muted action-link-button" href={content?.secondaryCta.href ?? getQuoteHref('materiales')}>
            {content?.secondaryCta.label ?? 'Solicitar presupuesto'}
          </a>
        </>
      }
      description={content?.intro ?? 'Vinilos y materiales por metro cuadrado con lectura clara de medidas, soporte y siguiente paso comercial.'}
      entry={selectedProduct}
      eyebrow={content?.eyebrow ?? 'Materiales'}
      fieldErrors={fieldErrors}
      onConfigChange={handleConfigChange}
      supportArea={
        <ConfiguratorSupportBlock
          sections={[
            {
              label: 'Medicion',
              title: 'Calcula una base clara por superficie.',
              items: [
                'Introduce la superficie total para obtener una referencia inmediata.',
                'Usa presupuesto cuando el proyecto incluya instalacion, homologacion o medicion real.',
                'El archivo es util, pero no obligatorio para una primera estimacion.',
              ],
            },
            {
              label: 'Siguiente paso',
              title: 'Material directo con salida comercial limpia.',
              items: [
                estimate?.quoteRequired
                  ? 'El proyecto necesita una propuesta adaptada.'
                  : 'Si el soporte encaja, puedes dejar el material preparado en el carrito.',
                'Los acabados complejos se revisan antes de fabricar.',
                selectedProduct.productionTime ?? 'El plazo final depende de soporte, medidas y comprobacion tecnica.',
              ],
            },
          ]}
        />
      }
      resultArea={
        <>
          {estimate ? <CatalogResultPanel result={estimate} title="Precio estimado" /> : null}
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
      title={content?.h1 ?? 'Materiales y vinilos por m2.'}
    >
      <SeoContentBlock entryId={selectedProduct.id} />
      <SeoContentBlock entryId={selectedProduct.id} mode="useCases" />
      <UploadGuidanceBlock entryId={selectedProduct.id} />
      <ConversionTrustBlock entryId={selectedProduct.id} />
      <ObjectionHandlerBlock entryId={selectedProduct.id} />
      <FaqBlock entryId={selectedProduct.id} title="FAQ materiales" />
    </CatalogEntryPageTemplate>
  )
}

export default MaterialesPage
