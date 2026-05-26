import ProductExperiencePage from '../features/products/product-detail/ProductExperiencePage'

function ProductoTarjetasPage() {
  return (
    <ProductExperiencePage
      allowedProductIds={['tarjetas-estandar']}
      category="papeleria"
      initialProductId="tarjetas-estandar"
    />
  )
}

export default ProductoTarjetasPage
