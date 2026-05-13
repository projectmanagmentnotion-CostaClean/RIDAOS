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
import { getCatalogPricingResult } from '../lib/catalogPricingAdapter'
import { createInitialConfig, getRequiredFieldErrors, updateConfigValue, type ConfigState } from '../lib/configuratorState'
import { getQuoteHref, publicRoutes } from '../lib/navigation'
import { getProductById, getProductsByCategory, resolveLegalNoticeItems } from '../lib/products'

function NeonesPage() {
  const services = getProductsByCategory('neones')
  const [productId, setProductId] = useState(services[0]?.id ?? '')
  const [config, setConfig] = useState<ConfigState>(() => (services[0] ? createInitialConfig(services[0]) : {}))
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

  if (!selectedProduct) {
    return null
  }

  return (
    <CatalogEntryPageTemplate
      className="neones-page"
      config={config}
      ctaArea={
        <a className="action-button action-link-button" href={content?.primaryCta.href ?? getQuoteHref('neones')}>
          {content?.primaryCta.label ?? 'Solicitar presupuesto'}
        </a>
      }
      description={content?.intro ?? 'Neones y rotulos decorativos sujetos a medida, colores y complejidad de diseno.'}
      entry={selectedProduct}
      eyebrow={content?.eyebrow ?? 'Neones'}
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
            <p className="section-label">Resumen del servicio</p>
            <ul className="placeholder-list">
              <li>{selectedProduct.manualReviewRequired ? 'Proyecto sujeto a comprobacion tecnica.' : 'Flujo directo habilitado.'}</li>
              <li>{selectedProduct.upload.required ? 'Archivo requerido.' : 'Archivo opcional para la propuesta inicial.'}</li>
            </ul>
            <div className="catalog-cta-row">
              <a className="card-link" href={getQuoteHref('neones')}>Abrir formulario</a>
              <a className="card-link" href={publicRoutes.contacto}>Contactar</a>
            </div>
          </article>
        </>
      }
      title={content?.h1 ?? 'Neones y carteleria luminosa.'}
    >
      <SeoContentBlock entryId={selectedProduct.id} />
      <SeoContentBlock entryId={selectedProduct.id} mode="useCases" />
      <UploadGuidanceBlock entryId={selectedProduct.id} />
      <ConversionTrustBlock entryId={selectedProduct.id} />
      <ObjectionHandlerBlock entryId={selectedProduct.id} />
      <FaqBlock entryId={selectedProduct.id} title="FAQ neones" />
    </CatalogEntryPageTemplate>
  )
}

export default NeonesPage
