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
import { getCatalogPricingResult } from '../lib/catalogPricingAdapter'
import { createInitialConfig, getRequiredFieldErrors, updateConfigValue, type ConfigState } from '../lib/configuratorState'
import { getQuoteHref, publicRoutes } from '../lib/navigation'
import { getProductById, getProductsByCategory, resolveLegalNoticeItems } from '../lib/products'

function CarteleriaPage() {
  const services = getProductsByCategory('carteleria')
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
      className="carteleria-page"
      config={config}
      ctaArea={
        <a className="action-button action-link-button" href={content?.primaryCta.href ?? getQuoteHref('carteleria')}>
          {content?.primaryCta.label ?? 'Solicitar presupuesto'}
        </a>
      }
      description={content?.intro ?? 'Carteleria y gran formato para proyectos que dependen de medidas, confeccion y uso final.'}
      entry={selectedProduct}
      eyebrow={content?.eyebrow ?? 'Carteleria'}
      fieldErrors={fieldErrors}
      onConfigChange={(key, value) => {
        handleConfigChange(key, value)
        if (selectedProduct) {
          setFieldErrors(getRequiredFieldErrors(selectedProduct, updateConfigValue(config, key, value)))
        }
      }}
      onFileChange={handleFileChange}
      supportArea={
        <ConfiguratorSupportBlock
          sections={[
            {
              label: 'Que preparar',
              title: 'Medidas, uso y acabado cambian la propuesta.',
              items: [
                'Indica ancho, alto y si necesitas ojales, refuerzos o confeccion.',
                'Adjunta una referencia visual si ya existe arte final o boceto.',
                'Si la instalacion o el soporte son clave, dejalo indicado desde el inicio.',
              ],
            },
            {
              label: 'Siguiente paso',
              title: 'Proyecto preparado para presupuesto serio.',
              items: [
                'La propuesta final se ajusta tras revisar material, confeccion y uso real.',
                'El servicio no pasa a compra directa porque depende de medidas y acabado.',
                'Tras enviar la solicitud, el equipo comercial responde con una propuesta adaptada.',
              ],
            },
          ]}
        />
      }
      resultArea={
        <>
          {estimate ? <CatalogResultPanel result={estimate} title="Referencia comercial" /> : null}
          <CommercialNoticeGroup items={resolveLegalNoticeItems(selectedProduct.legalNotes)} />
          <article className="content-card">
            <p className="section-label">Resumen del servicio</p>
            <ul className="hint-list">
              <li>Proyecto de presupuesto, no de compra directa.</li>
              <li>Archivo opcional para arrancar la propuesta.</li>
              <li>Confeccion, soporte e instalacion se confirman antes de fabricar.</li>
            </ul>
            <div className="catalog-cta-row">
              <a className="card-link" href={getQuoteHref('carteleria')}>Abrir formulario</a>
              <a className="card-link" href={publicRoutes.contacto}>Contactar</a>
            </div>
          </article>
        </>
      }
      title={content?.h1 ?? 'Carteleria y gran formato.'}
    >
      <SeoContentBlock entryId={selectedProduct.id} />
      <SeoContentBlock entryId={selectedProduct.id} mode="useCases" />
      <UploadGuidanceBlock entryId={selectedProduct.id} />
      <ConversionTrustBlock entryId={selectedProduct.id} />
      <ObjectionHandlerBlock entryId={selectedProduct.id} />
      <FaqBlock entryId={selectedProduct.id} title="FAQ carteleria" />
    </CatalogEntryPageTemplate>
  )
}

export default CarteleriaPage
