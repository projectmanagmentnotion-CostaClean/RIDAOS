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

function PapeleriaPage() {
  const products = getProductsByCategory('papeleria')
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
            {content?.primaryCta.label ?? 'Anadir al carrito'}
          </button>
          <a className="action-button action-button-muted action-link-button" href={content?.secondaryCta.href ?? getQuoteHref('papeleria')}>
            {content?.secondaryCta.label ?? 'Solicitar presupuesto'}
          </a>
        </>
      }
      description={content?.intro ?? 'Tarjetas y flyers con tiradas concretas del PDF 2026 y aviso de diseno por separado.'}
      entry={selectedProduct}
      eyebrow={content?.eyebrow ?? 'Papeleria'}
      fieldErrors={fieldErrors}
      onConfigChange={handleConfigChange}
      onFileChange={handleFileChange}
      supportArea={
        <ConfiguratorSupportBlock
          sections={[
            {
              label: 'Archivo y tirada',
              title: 'Confirma la cantidad antes de avanzar.',
              items: [
                'Las tiradas visibles ya estan preparadas para una lectura rapida del precio.',
                'Adjunta el PDF o una referencia si ya tienes el arte final.',
                'Si el proyecto necesita adaptacion o formato fuera de tramo, la via de presupuesto sigue abierta.',
              ],
            },
            {
              label: 'Para decidir',
              title: 'Usa el carrito para piezas cerradas.',
              items: [
                estimate?.quoteRequired
                  ? 'Este formato requiere propuesta personalizada.'
                  : 'Cuando la tirada encaja, puedes dejar la impresion preparada desde aqui.',
                'Las notas ayudan a aclarar acabados, caras y necesidades de diseno.',
                selectedProduct.productionTime ?? 'El plazo se confirma al revisar archivo y acabados.',
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
      title={content?.h1 ?? 'Papeleria de tirada corta y media.'}
    >
      <SeoContentBlock entryId={selectedProduct.id} />
      <SeoContentBlock entryId={selectedProduct.id} mode="useCases" />
      <UploadGuidanceBlock entryId={selectedProduct.id} />
      <ConversionTrustBlock entryId={selectedProduct.id} />
      <ObjectionHandlerBlock entryId={selectedProduct.id} />
      <FaqBlock entryId={selectedProduct.id} title="FAQ papeleria" />
    </CatalogEntryPageTemplate>
  )
}

export default PapeleriaPage
