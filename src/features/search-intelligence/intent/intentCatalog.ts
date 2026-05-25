import type { SearchIntent } from '../types/searchIntelligence'

export const intentCatalog: Array<{
  intent: SearchIntent
  label: string
  description: string
}> = [
  {
    intent: 'transactional',
    label: 'Transactional',
    description: 'Busqueda con voluntad de comprar, configurar o pedir precio ya.',
  },
  {
    intent: 'commercial',
    label: 'Commercial',
    description: 'Busqueda de evaluacion comparativa antes de decidir proveedor o formato.',
  },
  {
    intent: 'informational',
    label: 'Informational',
    description: 'Busqueda de ayuda, preparacion de archivo, diferencias tecnicas o contexto.',
  },
  {
    intent: 'local',
    label: 'Local',
    description: 'Busqueda vinculada a ciudad, area de servicio o cercania operativa.',
  },
  {
    intent: 'comparative',
    label: 'Comparative',
    description: 'Busqueda tipo vs, diferencias, mejor opcion o durabilidad relativa.',
  },
  {
    intent: 'navigational',
    label: 'Navigational',
    description: 'Busqueda para encontrar una marca, pagina o recurso concreto.',
  },
]
