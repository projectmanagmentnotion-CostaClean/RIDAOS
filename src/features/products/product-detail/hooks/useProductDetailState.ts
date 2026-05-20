import { useMemo, useState } from 'react'
import { getContentByEntryId } from '../../../../catalog/content/contentSelectors'
import { getCatalogPricingResult } from '../../../../lib/catalogPricingAdapter'
import { createCatalogCartItem } from '../../../../lib/catalogCartAdapter'
import { addToCart } from '../../../../lib/cart'
import { createInitialConfig, getRequiredFieldErrors, updateConfigValue, type ConfigState } from '../../../../lib/configuratorState'
import { getProductById, getProductsByCategory } from '../../../../lib/products'
import type { CatalogCategoryKey } from '../../../../types/product'
import { productExperienceContent } from '../data/productExperienceContent'

export function useProductDetailState(category: CatalogCategoryKey) {
  const pageConfig = productExperienceContent[category]
  const products = useMemo(() => getProductsByCategory(category), [category])
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
        setMessage('')
      }

      return
    }

    setConfig((current) => updateConfigValue(current, key, value))
    setFieldErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleFileChange = (_key: string, file: File | null) => {
    setConfig((current) => updateConfigValue(current, 'file', file?.name ?? ''))
    setFieldErrors((current) => ({ ...current, file: undefined }))
  }

  const handlePrimaryAction = () => {
    if (!selectedProduct) {
      return
    }

    const nextErrors = getRequiredFieldErrors(selectedProduct, config)
    setFieldErrors(nextErrors)

    if (selectedProduct.purchaseMode === 'direct' || selectedProduct.purchaseMode === 'hybrid') {
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
      setMessage(`${selectedProduct.name} anadido al carrito.`)
      return
    }

    setMessage('Configuracion lista para abrir la propuesta mock.')
  }

  return {
    pageConfig,
    products,
    selectedProduct,
    config,
    estimate,
    fieldErrors,
    message,
    content,
    contentTitle: content?.h1 ?? pageConfig.fallbackTitle,
    contentEyebrow: content?.eyebrow ?? pageConfig.fallbackEyebrow,
    contentDescription: content?.intro ?? pageConfig.fallbackDescription,
    handleConfigChange,
    handleFileChange,
    handlePrimaryAction,
    isDirectFlow:
      selectedProduct?.purchaseMode === 'direct' || selectedProduct?.purchaseMode === 'hybrid',
    purchaseMode: selectedProduct?.purchaseMode ?? 'quote',
    pricingMode: selectedProduct?.pricingMode ?? 'quote',
  }
}
