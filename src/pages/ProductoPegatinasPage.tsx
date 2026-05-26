import ProductExperiencePage from '../features/products/product-detail/ProductExperiencePage'

function ProductoPegatinasPage() {
  return (
    <ProductExperiencePage
      allowedProductIds={['pegatina-sin-laminar', 'pegatina-laminada']}
      category="accesorios"
      initialProductId="pegatina-sin-laminar"
    />
  )
}

export default ProductoPegatinasPage
