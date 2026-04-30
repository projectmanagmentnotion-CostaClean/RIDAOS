import { useMemo, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import PriceCard from '../components/PriceCard'
import ProductConfiguratorShell from '../components/ProductConfiguratorShell'
import SectionHeader from '../components/SectionHeader'
import { addToCart } from '../lib/cart'
import { calculateMaterialM2Price } from '../lib/pricingEngine'
import { getProductsByCategory, getProductById } from '../lib/products'
import type { CartItem } from '../types/ecommerce'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)

function MaterialesPage() {
  const products = getProductsByCategory('materiales')
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [area, setArea] = useState('1')
  const [message, setMessage] = useState('')
  const selectedProduct = getProductById(productId)
  const estimate = useMemo(() => calculateMaterialM2Price(productId, Number(area)), [productId, area])

  const handleAddToCart = () => {
    if (!selectedProduct || estimate.quoteRequired || estimate.validationMessage || !estimate.unitPrice) {
      return
    }

    const itemId = `material-${Date.now()}`
    const cartItem: CartItem = {
      id: itemId,
      productType: 'material',
      productName: selectedProduct.name,
      configuration: {
        areaM2: Number(area),
        variant: selectedProduct.name,
        summary: [`${area} m2`, selectedProduct.name],
        notes: '',
      },
      pricing: {
        unitPrice: estimate.unitPrice,
        unitLabel: 'm2',
        subtotal: estimate.subtotal,
        extras: 0,
        total: estimate.total,
      },
      artwork: {
        id: `upload-${Date.now()}`,
        itemId,
        fileName: 'Sin archivo adjunto',
        fileType: 'text/plain',
        fileSize: 0,
        formatLabel: 'PENDIENTE',
        status: 'pending_review',
        uploadedAt: new Date().toISOString(),
      },
    }

    addToCart(cartItem)
    setMessage('Estimacion de materiales anadida al carrito.')
  }

  return (
    <ProductConfiguratorShell
      className="materiales-page"
      description="Vinilos y materiales por metro cuadrado con lectura defensiva para soportes que siguen yendo por presupuesto."
      eyebrow="Materiales"
      title="Materiales y vinilos por m2."
    >
      <div className="split-grid product-layout">
        <article className="content-card product-config-card">
          <SectionHeader eyebrow="Configurador" title="Elige material y superficie." />
          <div className="configurator-form">
            <label className="field-group" htmlFor="material-product">
              <span className="field-label">Material</span>
              <select
                className="form-input"
                id="material-product"
                onChange={(event) => setProductId(event.target.value)}
                value={productId}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group" htmlFor="material-area">
              <span className="field-label">Superficie</span>
              <input
                className="form-input"
                id="material-area"
                min="0.1"
                onChange={(event) => setArea(event.target.value)}
                step="0.1"
                type="number"
                value={area}
              />
            </label>

            <div className="form-actions">
              <button
                className="action-button"
                disabled={Boolean(estimate.quoteRequired || estimate.validationMessage)}
                onClick={handleAddToCart}
                type="button"
              >
                Anadir al carrito
              </button>
              <a className="action-button action-button-muted action-link-button" href="#/presupuesto?service=materiales">
                Solicitar presupuesto
              </a>
            </div>

            {message ? <p className="inline-notice">{message}</p> : null}
          </div>
        </article>

        <div className="summary-stack">
          <PriceCard
            label="Precio estimado"
            note={estimate.validationMessage || 'Los soportes complejos y lonas pasan a presupuesto.'}
            value={
              estimate.quoteRequired
                ? 'Precio a consultar'
                : estimate.total > 0
                  ? formatCurrency(estimate.total)
                  : 'Pendiente'
            }
          />
          <CommercialNotice />
        </div>
      </div>
    </ProductConfiguratorShell>
  )
}

export default MaterialesPage
