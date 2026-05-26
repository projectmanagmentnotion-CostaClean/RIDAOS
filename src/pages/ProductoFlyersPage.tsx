import ProductExperiencePage from '../features/products/product-detail/ProductExperiencePage'

function ProductoFlyersPage() {
  return (
    <ProductExperiencePage
      allowedProductIds={['flyer-a6', 'flyer-a5']}
      category="papeleria"
      initialProductId="flyer-a6"
    />
  )
}

export default ProductoFlyersPage
