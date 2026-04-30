import { useMemo, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import PriceCard from '../components/PriceCard'
import ProductConfiguratorShell from '../components/ProductConfiguratorShell'
import SectionHeader from '../components/SectionHeader'
import { addToCart } from '../lib/cart'
import { calculateAccessoryPrice } from '../lib/pricingEngine'
import { getProductsByCategory, getProductById } from '../lib/products'
import type { CartItem } from '../types/ecommerce'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)

function AccesoriosPage() {
  const products = getProductsByCategory('accesorios')
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [quantity, setQuantity] = useState('100')
  const [message, setMessage] = useState('')
  const selectedProduct = getProductById(productId)
  const estimate = useMemo(() => calculateAccessoryPrice(productId, Number(quantity)), [productId, quantity])

  const handleAddToCart = () => {
    if (!selectedProduct || estimate.quoteRequired || estimate.validationMessage) {
      return
    }

    const itemId = `accessory-${Date.now()}`
    const cartItem: CartItem = {
      id: itemId,
      productType: 'accessory',
      productName: selectedProduct.name,
      configuration: {
        quantity: Number(quantity),
        variant: selectedProduct.name,
        summary: [`${quantity} uds`, selectedProduct.name],
        notes: '',
      },
      pricing: {
        unitPrice: estimate.unitPrice ?? estimate.total / Number(quantity),
        unitLabel: selectedProduct.unitLabel,
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
    setMessage('Accesorio anadido al carrito local.')
  }

  return (
    <ProductConfiguratorShell
      className="accesorios-page"
      description="Llaveros y pegatinas con tramos directos del catalogo y salida local al carrito."
      eyebrow="Accesorios"
      title="Accesorios con lectura rapida."
    >
      <div className="split-grid product-layout">
        <article className="content-card product-config-card">
          <SectionHeader eyebrow="Configurador" title="Selecciona accesorio y cantidad." />
          <div className="configurator-form">
            <label className="field-group" htmlFor="accessory-product">
              <span className="field-label">Producto</span>
              <select
                className="form-input"
                id="accessory-product"
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

            <label className="field-group" htmlFor="accessory-quantity">
              <span className="field-label">Cantidad</span>
              <select
                className="form-input"
                id="accessory-quantity"
                onChange={(event) => setQuantity(event.target.value)}
                value={quantity}
              >
                {['50', '100', '200', '300', '1000'].map((option) => (
                  <option key={option} value={option}>
                    {option} uds
                  </option>
                ))}
              </select>
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
              <a className="action-button action-button-muted action-link-button" href="#/presupuesto?service=accesorios">
                Solicitar presupuesto
              </a>
            </div>

            {message ? <p className="inline-notice">{message}</p> : null}
          </div>
        </article>

        <div className="summary-stack">
          <PriceCard
            label="Precio"
            note={estimate.validationMessage || 'Otras cantidades y formatos pasan a consulta.'}
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

export default AccesoriosPage
