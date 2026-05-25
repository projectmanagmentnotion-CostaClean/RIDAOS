import { useMemo, useState } from 'react'
import { getContentByEntryId } from '../../../../catalog/content/contentSelectors'
import { getCatalogPricingResult } from '../../../../lib/catalogPricingAdapter'
import { createCatalogCartItem } from '../../../../lib/catalogCartAdapter'
import { addToCart } from '../../../../lib/cart'
import { createInitialConfig, getRequiredFieldErrors, updateConfigValue, type ConfigState } from '../../../../lib/configuratorState'
import { getProductById, getProductsByCategory } from '../../../../lib/products'
import type { CatalogCategoryKey } from '../../../../types/product'
import type { ArtworkPreviewSummary } from '../../../artwork-upload'
import { useLiveToast } from '../../../live-feedback'
import { getProductOptionDefinition } from '../../../product-options'
import { productExperienceContent } from '../data/productExperienceContent'

function buildDisplayEntry(productId: string) {
  const entry = getProductById(productId)

  if (!entry) {
    return null
  }

  const optionDefinition = getProductOptionDefinition(entry.id)

  if (!optionDefinition) {
    return entry
  }

  const configuratorFields = optionDefinition.fields.map((field) => {
    if (field.type !== 'variant') {
      return field
    }

    const sourceField = entry.configuratorFields.find(
      (candidate) => candidate.key === field.key && candidate.type === 'variant',
    )

    if (sourceField && sourceField.type === 'variant' && sourceField.options.length > 0) {
      return { ...field, options: sourceField.options }
    }

    return field
  })

  return {
    ...entry,
    configuratorFields,
    name: optionDefinition.displayName,
    shortDescription: optionDefinition.hero.description,
    description: optionDefinition.seoDescription,
  }
}

export function useProductDetailState(category: CatalogCategoryKey) {
  const { info, success } = useLiveToast()
  const pageConfig = productExperienceContent[category]
  const products = useMemo(() => getProductsByCategory(category), [category])
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [config, setConfig] = useState<ConfigState>(() => {
    const firstEntry = products[0] ? buildDisplayEntry(products[0].id) : null
    return firstEntry ? createInitialConfig(firstEntry) : {}
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({})

  const selectedProduct = useMemo(() => getProductById(productId), [productId])
  const displayEntry = useMemo(() => buildDisplayEntry(productId), [productId])
  const optionDefinition = useMemo(() => (selectedProduct ? getProductOptionDefinition(selectedProduct.id) : null), [selectedProduct])
  const content = useMemo(
    () => (selectedProduct ? getContentByEntryId(selectedProduct.id) : null),
    [selectedProduct],
  )

  const estimate = useMemo(
    () => (displayEntry ? getCatalogPricingResult(displayEntry, config) : null),
    [config, displayEntry],
  )

  const handleConfigChange = (key: string, value: string) => {
    if ((key === 'product' || key === 'variant') && getProductById(value)) {
      const nextProduct = buildDisplayEntry(value)

      if (nextProduct) {
        setProductId(value)
        setConfig(createInitialConfig(nextProduct))
        setSelectedFile(null)
        setFieldErrors({})
        setMessage('')
      }

      return
    }

    setConfig((current) => updateConfigValue(current, key, value))
    setFieldErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleFileChange = (_key: string, file: File | null) => {
    setSelectedFile(file)
    setConfig((current) => updateConfigValue(current, 'file', file?.name ?? ''))
    setFieldErrors((current) => ({ ...current, file: undefined }))
  }

  const handlePrimaryAction = (previewSummary?: ArtworkPreviewSummary | null) => {
    if (!selectedProduct || !displayEntry) {
      return
    }

    const nextErrors = getRequiredFieldErrors(displayEntry, config)
    setFieldErrors(nextErrors)

    if (selectedProduct.purchaseMode === 'direct' || selectedProduct.purchaseMode === 'hybrid') {
      if (!estimate || Object.keys(nextErrors).length > 0 || !estimate.canAddToCart) {
        return
      }

      const fileName = config.file || 'Sin archivo adjunto'
      addToCart(
        createCatalogCartItem(displayEntry, config, estimate, {
          fileName,
          fileType: selectedFile?.type ?? 'text/plain',
          fileSize: selectedFile?.size ?? 0,
          formatLabel: previewSummary?.formatLabel ?? (fileName === 'Sin archivo adjunto' ? 'POR CONFIRMAR' : 'ARCHIVO'),
          notes: config.notes?.trim() ?? '',
          previewSummary: previewSummary ?? undefined,
        }),
      )
      setMessage(`${selectedProduct.name} anadido al carrito.`)
      success('Añadido al carrito', `${selectedProduct.name} ya aparece en tu resumen de compra.`)
      return
    }

    setMessage('Configuracion lista para solicitar una propuesta personalizada.')
    info('Configuracion preparada', 'Ya puedes pedir una propuesta con las opciones que acabas de elegir.')
  }

  return {
    pageConfig,
    products,
    selectedProduct,
    displayEntry,
    optionDefinition,
    selectedFile,
    config,
    estimate,
    fieldErrors,
    message,
    content,
    contentTitle: optionDefinition?.hero.title ?? content?.h1 ?? pageConfig.fallbackTitle,
    contentEyebrow: optionDefinition?.hero.eyebrow ?? content?.eyebrow ?? pageConfig.fallbackEyebrow,
    contentDescription: optionDefinition?.hero.description ?? content?.intro ?? pageConfig.fallbackDescription,
    handleConfigChange,
    handleFileChange,
    handlePrimaryAction,
    isDirectFlow:
      selectedProduct?.purchaseMode === 'direct' || selectedProduct?.purchaseMode === 'hybrid',
    purchaseMode: selectedProduct?.purchaseMode ?? 'quote',
    pricingMode: selectedProduct?.pricingMode ?? 'quote',
  }
}
