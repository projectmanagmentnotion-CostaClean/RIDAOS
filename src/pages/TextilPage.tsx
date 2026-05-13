import { useEffect, useMemo, useState } from 'react'
import CatalogEntryPageTemplate from '../components/CatalogEntryPageTemplate'
import CatalogResultPanel from '../components/CatalogResultPanel'
import CommercialNoticeGroup from '../components/CommercialNoticeGroup'
import { addToCart } from '../lib/cart'
import { createCatalogCartItem } from '../lib/catalogCartAdapter'
import { getCatalogPricingResult } from '../lib/catalogPricingAdapter'
import { createInitialConfig, getRequiredFieldErrors, updateConfigValue, type ConfigState } from '../lib/configuratorState'
import { getProductsByCategory, getProductById, resolveLegalNoticeItems } from '../lib/products'

function TextilPage() {
  const products = getProductsByCategory('textil').filter((product) => product.category === 'textil')
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

    addToCart(
      createCatalogCartItem(selectedProduct, config, estimate, {
        notes: config.notes?.trim() ?? '',
      }),
    )
    setMessage('Estimacion textil anadida al carrito local.')
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
            Anadir al carrito
          </button>
          <a className="action-button action-button-muted action-link-button" href="#/presupuesto?service=textil">
            Solicitar presupuesto
          </a>
        </>
      }
      description="Prendas y accesorios textiles del catalogo 2026 con lectura directa por cantidad y aviso comercial claro."
      entry={selectedProduct}
      eyebrow="Estampados / textil"
      fieldErrors={fieldErrors}
      onConfigChange={handleConfigChange}
      resultArea={
        <>
          {estimate ? <CatalogResultPanel result={estimate} title="Estimacion" /> : null}
          <CommercialNoticeGroup items={resolveLegalNoticeItems(selectedProduct.legalNotes)} />
          {selectedProduct.notes?.length ? (
            <article className="content-card">
              <p className="section-label">Notas del catalogo</p>
              <ul className="placeholder-list">
                {selectedProduct.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>
          ) : null}
          {message ? <p className="inline-notice">{message}</p> : null}
        </>
      }
      title="Textil listo para estimar."
    />
  )
}

export default TextilPage
