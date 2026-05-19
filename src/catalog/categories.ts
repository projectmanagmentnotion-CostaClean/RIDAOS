import { catalogCategories as registryCategories } from './categories/catalogCategories'
import type { EditableCatalogCategory } from './productTypes'

export const editableCatalogCategories: EditableCatalogCategory[] = registryCategories.map(
  (category) => ({
    key: category.key,
    label: category.label,
    description: category.description,
    route: category.route,
  }),
)
