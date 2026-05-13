import { useEffect, useMemo, useState } from 'react'
import CatalogEntryPageTemplate from '../components/CatalogEntryPageTemplate'
import CatalogResultPanel from '../components/CatalogResultPanel'
import CommercialNoticeGroup from '../components/CommercialNoticeGroup'
import { addToCart } from '../lib/cart'
import { createCatalogCartItem } from '../lib/catalogCartAdapter'
import { getCatalogPricingResult } from '../lib/catalogPricingAdapter'
import { createInitialConfig, getRequiredFieldErrors, updateConfigValue, type ConfigState } from '../lib/configuratorState'
import { getProductById, getProductsByCategory, resolveLegalNoticeItems } from '../lib/products'

function PapeleriaPage() {
  const products = getProductsByCategory('papeleria')
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
        notes: config.notes?.trim() ?? '',
      }),
    )
    setMessage('Estimacion de papeleria anadida al carrito.')
  }

  if (!selectedProduct) {
    return null
  }

  return (
    <CatalogEntryPageTemplate
      className="papeleria-page"
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
          <a className="action-button action-button-muted action-link-button" href="#/presupuesto?service=papeleria">
            Solicitar presupuesto
          </a>
        </>
      }
      description="Tarjetas y flyers con tiradas concretas del PDF 2026 y aviso de diseno por separado."
      entry={selectedProduct}
      eyebrow="Papeleria"
      fieldErrors={fieldErrors}
      onConfigChange={handleConfigChange}
      onFileChange={handleFileChange}
      resultArea={
        <>
          {estimate ? <CatalogResultPanel result={estimate} title="Precio" /> : null}
          <CommercialNoticeGroup items={resolveLegalNoticeItems(selectedProduct.legalNotes)} />
          {message ? <p className="inline-notice">{message}</p> : null}
        </>
      }
      title="Papeleria de tirada corta y media."
    />
  )
}

export default PapeleriaPage
