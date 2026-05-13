import type { CatalogSeoContent } from './types'
import { accesoriosSeoContent } from './entries/accesorios.content'
import { carteleriaSeoContent } from './entries/carteleria.content'
import { dtfSeoContent } from './entries/dtf.content'
import { materialesSeoContent } from './entries/materiales.content'
import { neonesSeoContent } from './entries/neones.content'
import { papeleriaSeoContent } from './entries/papeleria.content'
import { rotulacionSeoContent } from './entries/rotulacion.content'
import { textilSeoContent } from './entries/textil.content'

export const catalogContentEntries: CatalogSeoContent[] = [
  dtfSeoContent,
  ...textilSeoContent,
  ...papeleriaSeoContent,
  ...materialesSeoContent,
  ...accesoriosSeoContent,
  ...rotulacionSeoContent,
  ...neonesSeoContent,
  ...carteleriaSeoContent,
]
