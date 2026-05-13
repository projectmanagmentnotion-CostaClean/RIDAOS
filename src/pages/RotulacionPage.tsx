import { useEffect, useMemo, useState } from 'react'
import CatalogEntryPageTemplate from '../components/CatalogEntryPageTemplate'
import CatalogResultPanel from '../components/CatalogResultPanel'
import CommercialNoticeGroup from '../components/CommercialNoticeGroup'
import { getCatalogPricingResult } from '../lib/catalogPricingAdapter'
import { createInitialConfig, getRequiredFieldErrors, updateConfigValue, type ConfigState } from '../lib/configuratorState'
import { getProductById, getProductsByCategory, resolveLegalNoticeItems } from '../lib/products'

function RotulacionPage() {
  const services = getProductsByCategory('rotulacion')
  const [productId, setProductId] = useState(services[0]?.id ?? '')
  const [config, setConfig] = useState<ConfigState>(() => (services[0] ? createInitialConfig(services[0]) : {}))
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

  if (!selectedProduct) {
    return null
  }

  return (
    <CatalogEntryPageTemplate
      className="rotulacion-page"
      config={config}
      ctaArea={
        <a className="action-button action-link-button" href="#/presupuesto?service=rotulacion">
          Solicitar presupuesto
        </a>
      }
      description="Rotulacion de furgonetas por tramos orientativos y cierre por presupuesto comercial."
      entry={selectedProduct}
      eyebrow="Rotulacion de furgonetas"
      fieldErrors={fieldErrors}
      onConfigChange={(key, value) => {
        handleConfigChange(key, value)
        if (selectedProduct) {
          setFieldErrors(getRequiredFieldErrors(selectedProduct, updateConfigValue(config, key, value)))
        }
      }}
      resultArea={
        <>
          {estimate ? <CatalogResultPanel result={estimate} title="Rango orientativo" /> : null}
          <CommercialNoticeGroup items={resolveLegalNoticeItems(selectedProduct.legalNotes)} />
          <article className="content-card">
            <p className="section-label">Revision comercial</p>
            <ul className="placeholder-list">
              <li>{selectedProduct.manualReviewRequired ? 'Requiere revision manual.' : 'Flujo directo habilitado.'}</li>
              <li>{selectedProduct.upload.required ? 'Archivo requerido antes de producir.' : 'Archivo opcional para la primera propuesta.'}</li>
            </ul>
          </article>
        </>
      }
      title="Rotulacion por nivel de cobertura."
    />
  )
}

export default RotulacionPage
