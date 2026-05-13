import type { CatalogEntry, ProductCategory } from '../../types/product'
import { catalogCategories } from '../categories/catalogCategories'
import { accesoriosEntries } from '../products/accesorios'
import { dtfEntry } from '../products/dtf'
import { materialesEntries } from '../products/materiales'
import { papeleriaEntries } from '../products/papeleria'
import { textilEntries } from '../products/textil'
import { carteleriaEntries } from '../services/carteleria'
import { neonesEntries } from '../services/neones'
import { rotulacionEntries } from '../services/rotulacion'

const rawEntries: CatalogEntry[] = [
  dtfEntry,
  ...textilEntries,
  ...papeleriaEntries,
  ...materialesEntries,
  ...accesoriosEntries,
  ...carteleriaEntries,
  ...rotulacionEntries,
  ...neonesEntries,
]

const catalogEntries = rawEntries.map((entry) => ({
  ...entry,
  configuratorFields: entry.configuratorFields.map((field) => {
    if (field.type !== 'variant') {
      return field
    }

    const options = rawEntries
      .filter((candidate) => candidate.category === entry.category)
      .map((candidate) => ({ value: candidate.id, label: candidate.name }))

    return { ...field, options }
  }),
}))

export { catalogEntries }
export const productCatalog = catalogEntries
export const productCategories: ProductCategory[] = catalogCategories
