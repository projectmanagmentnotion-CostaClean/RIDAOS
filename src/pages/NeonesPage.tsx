import { useEffect, useMemo, useState } from 'react'
import CatalogEntryPageTemplate from '../components/CatalogEntryPageTemplate'
import CatalogResultPanel from '../components/CatalogResultPanel'
import CommercialNoticeGroup from '../components/CommercialNoticeGroup'
import { getCatalogPricingResult } from '../lib/catalogPricingAdapter'
import { createInitialConfig, getRequiredFieldErrors, updateConfigValue, type ConfigState } from '../lib/configuratorState'
import { getProductById, getProductsByCategory, resolveLegalNoticeItems } from '../lib/products'

function NeonesPage() {
  const services = getProductsByCategory('neones')
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

  const handleFileChange = (_key: string, file: File | null) => {
    setConfig((current) => updateConfigValue(current, 'file', file?.name ?? ''))
  }

  if (!selectedProduct) {
    return null
  }

  return (
    <CatalogEntryPageTemplate
      className="neones-page"
      config={config}
      ctaArea={
        <a className="action-button action-link-button" href="#/presupuesto?service=neones">
          Solicitar presupuesto
        </a>
      }
      description="Neones y rotulos decorativos sujetos a medida, colores y complejidad de diseno."
      entry={selectedProduct}
      eyebrow="Neones"
      fieldErrors={fieldErrors}
      onConfigChange={(key, value) => {
        handleConfigChange(key, value)
        if (selectedProduct) {
          setFieldErrors(getRequiredFieldErrors(selectedProduct, updateConfigValue(config, key, value)))
        }
      }}
      onFileChange={handleFileChange}
      resultArea={
        <>
          {estimate ? <CatalogResultPanel result={estimate} title="Referencia" /> : null}
          <CommercialNoticeGroup items={resolveLegalNoticeItems(selectedProduct.legalNotes)} />
          <article className="content-card">
            <p className="section-label">Revision comercial</p>
            <ul className="placeholder-list">
              <li>{selectedProduct.manualReviewRequired ? 'Proyecto sujeto a revision manual.' : 'Flujo directo habilitado.'}</li>
              <li>{selectedProduct.upload.required ? 'Archivo requerido.' : 'Archivo opcional para la propuesta inicial.'}</li>
            </ul>
          </article>
        </>
      }
      title="Neones y carteleria luminosa."
    />
  )
}

export default NeonesPage
