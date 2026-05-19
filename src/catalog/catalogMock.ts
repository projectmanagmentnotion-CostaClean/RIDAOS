import { editableCatalogCategories } from './categories'
import { editableCatalogProducts } from './products'

export const catalogMock = {
  products: editableCatalogProducts,
  categories: editableCatalogCategories,
  featuredProducts: editableCatalogProducts.filter((product) => product.featured),
}
