import { useMemo, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import PriceCard from '../components/PriceCard'
import ProductConfiguratorShell from '../components/ProductConfiguratorShell'
import SectionHeader from '../components/SectionHeader'
import { addToCart } from '../lib/cart'
import { calculatePaperPrice } from '../lib/pricingEngine'
import { getProductsByCategory, getProductById } from '../lib/products'
import type { CartItem } from '../types/ecommerce'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)

function PapeleriaPage() {
  const products = getProductsByCategory('papeleria')
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [quantity, setQuantity] = useState('100')
  const [message, setMessage] = useState('')

  const selectedProduct = getProductById(productId)
  const estimate = useMemo(() => calculatePaperPrice(productId, Number(quantity)), [productId, quantity])

  const handleAddToCart = () => {
    if (!selectedProduct || estimate.quoteRequired || estimate.validationMessage || !estimate.total) {
      return
    }

    const itemId = `paper-${Date.now()}`
    const cartItem: CartItem = {
      id: itemId,
      productType: 'paper',
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
    setMessage('Estimacion de papeleria anadida al carrito.')
  }

  return (
    <ProductConfiguratorShell
      className="papeleria-page"
      description="Tarjetas y flyers con tiradas concretas del PDF 2026 y aviso de diseno por separado."
      eyebrow="Papeleria"
      title="Papeleria de tirada corta y media."
    >
      <div className="split-grid product-layout">
        <article className="content-card product-config-card">
          <SectionHeader eyebrow="Configurador" title="Elige producto y tirada." />
          <div className="configurator-form">
            <label className="field-group" htmlFor="paper-product">
              <span className="field-label">Producto</span>
              <select
                className="form-input"
                id="paper-product"
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

            <label className="field-group" htmlFor="paper-quantity">
              <span className="field-label">Tirada</span>
              <select
                className="form-input"
                id="paper-quantity"
                onChange={(event) => setQuantity(event.target.value)}
                value={quantity}
              >
                {['100', '250', '500', '1000', '2500', '5000'].map((option) => (
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
              <a className="action-button action-button-muted action-link-button" href="#/presupuesto?service=papeleria">
                Solicitar presupuesto
              </a>
            </div>

            {message ? <p className="inline-notice">{message}</p> : null}
          </div>
        </article>

        <div className="summary-stack">
          <PriceCard
            label="Precio"
            note={estimate.validationMessage || selectedProduct?.productionTime || 'Diseno: 35 EUR/hora.'}
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

export default PapeleriaPage
