import { useMemo, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import PriceCard from '../components/PriceCard'
import ProductConfiguratorShell from '../components/ProductConfiguratorShell'
import SectionHeader from '../components/SectionHeader'
import { calculateVanWrapEstimate } from '../lib/pricingEngine'
import { getProductsByCategory, getProductById } from '../lib/products'

function RotulacionPage() {
  const products = getProductsByCategory('rotulacion')
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [size, setSize] = useState<'S' | 'M' | 'L' | 'XL'>('M')
  const selectedProduct = getProductById(productId)
  const estimate = useMemo(() => calculateVanWrapEstimate(productId, size), [productId, size])

  return (
    <ProductConfiguratorShell
      className="rotulacion-page"
      description="Rotulacion de furgonetas por tramos orientativos y cierre por presupuesto comercial."
      eyebrow="Rotulacion de furgonetas"
      title="Rotulacion por nivel de cobertura."
    >
      <div className="split-grid product-layout">
        <article className="content-card product-config-card">
          <SectionHeader eyebrow="Estimador" title="Tipo de rotulacion y tamano." />
          <div className="configurator-form">
            <label className="field-group" htmlFor="wrap-product">
              <span className="field-label">Servicio</span>
              <select
                className="form-input"
                id="wrap-product"
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

            <label className="field-group" htmlFor="wrap-size">
              <span className="field-label">Tamano de vehiculo</span>
              <select
                className="form-input"
                id="wrap-size"
                onChange={(event) => setSize(event.target.value as 'S' | 'M' | 'L' | 'XL')}
                value={size}
              >
                {['S', 'M', 'L', 'XL'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="form-actions">
              <a className="action-button action-link-button" href="#/presupuesto?service=rotulacion">
                Solicitar presupuesto
              </a>
            </div>
          </div>
        </article>

        <div className="summary-stack">
          <PriceCard
            label="Rango orientativo"
            note={selectedProduct?.description || 'Incluye material e instalacion. No incluye diseno.'}
            value={estimate.rangeLabel || 'Precio a consultar'}
          />
          <CommercialNotice />
        </div>
      </div>
    </ProductConfiguratorShell>
  )
}

export default RotulacionPage
