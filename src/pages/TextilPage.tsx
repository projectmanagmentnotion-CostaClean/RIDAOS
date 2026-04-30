import { useMemo, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import PriceCard from '../components/PriceCard'
import ProductConfiguratorShell from '../components/ProductConfiguratorShell'
import SectionHeader from '../components/SectionHeader'
import { addToCart } from '../lib/cart'
import { calculateTextilePrice } from '../lib/pricingEngine'
import { getProductsByCategory, getProductById } from '../lib/products'
import type { CartItem } from '../types/ecommerce'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)

function TextilPage() {
  const products = getProductsByCategory('textil').filter((product) => product.id !== 'dtf-metro')
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [quantity, setQuantity] = useState('8')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')

  const selectedProduct = getProductById(productId)
  const quantityValue = Number(quantity)
  const estimate = useMemo(
    () => calculateTextilePrice(productId, quantityValue),
    [productId, quantityValue],
  )

  const handleAddToCart = () => {
    if (!selectedProduct || estimate.quoteRequired || estimate.validationMessage || !estimate.unitPrice) {
      return
    }

    const itemId = `textil-${Date.now()}`
    const cartItem: CartItem = {
      id: itemId,
      productType: 'textile',
      productName: selectedProduct.name,
      configuration: {
        quantity: quantityValue,
        variant: selectedProduct.name,
        summary: [`${quantityValue} uds`, selectedProduct.name],
        notes: notes.trim(),
      },
      pricing: {
        unitPrice: estimate.unitPrice,
        unitLabel: 'ud',
        subtotal: estimate.subtotal,
        extras: estimate.extras,
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
        notes: notes.trim(),
      },
    }

    addToCart(cartItem)
    setMessage('Estimacion textil anadida al carrito local.')
  }

  return (
    <ProductConfiguratorShell
      className="textil-page"
      description="Prendas y accesorios textiles del catalogo 2026 con lectura directa por cantidad y aviso comercial claro."
      eyebrow="Estampados / textil"
      title="Textil listo para estimar."
    >
      <div className="split-grid product-layout">
        <article className="content-card product-config-card">
          <SectionHeader eyebrow="Configurador" title="Selecciona producto y cantidad." />
          <div className="configurator-form">
            <label className="field-group" htmlFor="textil-product">
              <span className="field-label">Producto</span>
              <select
                className="form-input"
                id="textil-product"
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

            <label className="field-group" htmlFor="textil-quantity">
              <span className="field-label">Cantidad</span>
              <input
                className="form-input"
                id="textil-quantity"
                min="1"
                onChange={(event) => setQuantity(event.target.value)}
                type="number"
                value={quantity}
              />
            </label>

            <label className="field-group" htmlFor="textil-notes">
              <span className="field-label">Notas</span>
              <textarea
                className="form-input form-textarea"
                id="textil-notes"
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                value={notes}
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
              <a className="action-button action-button-muted action-link-button" href="#/presupuesto?service=textil-personalizado">
                Solicitar presupuesto
              </a>
            </div>

            {message ? <p className="inline-notice">{message}</p> : null}
          </div>
        </article>

        <div className="summary-stack">
          <PriceCard
            label="Estimacion"
            note={estimate.validationMessage || selectedProduct?.productionTime || 'Precios no incluyen IVA.'}
            value={
              estimate.quoteRequired
                ? 'Precio a consultar'
                : estimate.total > 0
                  ? formatCurrency(estimate.total)
                  : 'Pendiente'
            }
          />
          <CommercialNotice />
          {selectedProduct?.notes?.length ? (
            <article className="content-card">
              <p className="section-label">Notas del catalogo</p>
              <ul className="placeholder-list">
                {selectedProduct.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      </div>
    </ProductConfiguratorShell>
  )
}

export default TextilPage
