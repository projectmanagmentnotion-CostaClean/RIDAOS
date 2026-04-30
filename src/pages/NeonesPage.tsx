import { useMemo, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import PriceCard from '../components/PriceCard'
import ProductConfiguratorShell from '../components/ProductConfiguratorShell'
import SectionHeader from '../components/SectionHeader'
import { formatRangeLabel, getProductsByCategory, getProductById } from '../lib/products'

function NeonesPage() {
  const products = getProductsByCategory('neones')
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const selectedProduct = useMemo(() => getProductById(productId), [productId])

  return (
    <ProductConfiguratorShell
      className="neones-page"
      description="Neones y rotulos decorativos sujetos a medida, colores y complejidad de diseno."
      eyebrow="Neones"
      title="Neones y carteleria luminosa."
    >
      <div className="split-grid product-layout">
        <article className="content-card product-config-card">
          <SectionHeader eyebrow="Servicio" title="Selecciona la linea de neon." />
          <div className="configurator-form">
            <label className="field-group" htmlFor="neon-product">
              <span className="field-label">Producto</span>
              <select
                className="form-input"
                id="neon-product"
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

            <div className="form-actions">
              <a className="action-button action-link-button" href="#/presupuesto?service=neones">
                Solicitar presupuesto
              </a>
            </div>
          </div>
        </article>

        <div className="summary-stack">
          <PriceCard
            label="Referencia"
            note={selectedProduct?.notes?.join(' ') || 'No incluye instalacion y puede variar por complejidad.'}
            value={
              selectedProduct?.range
                ? formatRangeLabel(selectedProduct.range.min, selectedProduct.range.max)
                : 'Precio a consultar'
            }
          />
          <CommercialNotice />
        </div>
      </div>
    </ProductConfiguratorShell>
  )
}

export default NeonesPage
