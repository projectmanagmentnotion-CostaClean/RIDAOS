import { useEffect, useMemo, useState } from 'react'
import CatalogEntryPageTemplate from '../components/CatalogEntryPageTemplate'
import CatalogResultPanel from '../components/CatalogResultPanel'
import CommercialNoticeGroup from '../components/CommercialNoticeGroup'
import { addToCart } from '../lib/cart'
import { createCatalogCartItem } from '../lib/catalogCartAdapter'
import { getCatalogPricingResult } from '../lib/catalogPricingAdapter'
import { createInitialConfig, getRequiredFieldErrors, updateConfigValue, type ConfigState } from '../lib/configuratorState'
import { getProductById, getProductsByCategory, resolveLegalNoticeItems } from '../lib/products'

function MaterialesPage() {
  const products = getProductsByCategory('materiales')
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [config, setConfig] = useState<ConfigState>(() => (products[0] ? createInitialConfig(products[0]) : {}))
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({})
  const selectedProduct = useMemo(() => getProductById(productId), [productId])

  useEffect(() => {
    if (!selectedProduct) {
      return
    }

    setConfig(createInitialConfig(selectedProduct))
    setFieldErrors({})
  }, [selectedProduct])

  const estimate = useMemo(
    () => (selectedProduct ? getCatalogPricingResult(selectedProduct, config) : null),
    [config, selectedProduct],
  )

  const handleConfigChange = (key: string, value: string) => {
    setConfig((current) => updateConfigValue(current, key, value))
    setFieldErrors((current) => ({ ...current, [key]: undefined }))

    if ((key === 'product' || key === 'variant') && getProductById(value)) {
      setProductId(value)
    }
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
    setMessage('Estimacion de materiales anadida al carrito.')
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
            Anadir al carrito
          </button>
          <a className="action-button action-button-muted action-link-button" href="#/presupuesto?service=materiales">
            Solicitar presupuesto
          </a>
        </>
      }
      description="Vinilos y materiales por metro cuadrado con lectura defensiva para soportes que siguen yendo por presupuesto."
      entry={selectedProduct}
      eyebrow="Materiales"
      fieldErrors={fieldErrors}
      onConfigChange={handleConfigChange}
      resultArea={
        <>
          {estimate ? <CatalogResultPanel result={estimate} title="Precio estimado" /> : null}
          <CommercialNoticeGroup items={resolveLegalNoticeItems(selectedProduct.legalNotes)} />
          {message ? <p className="inline-notice">{message}</p> : null}
        </>
      }
      title="Materiales y vinilos por m2."
    />
  )
}

export default MaterialesPage
