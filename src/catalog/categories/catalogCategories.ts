import type { CatalogCategory } from '../../types/product'

export const catalogCategories: CatalogCategory[] = [
  {
    key: 'dtf',
    label: 'DTF por metro',
    description: 'Producto flagship con configuracion, archivo, preview y carrito.',
    route: '#/producto/dtf',
    kind: 'product',
    navigation: { label: 'DTF por metro', primary: true, order: 20 },
  },
  {
    key: 'textil',
    label: 'Estampados / textil',
    description: 'Prendas, polos, gorras y sudaderas con tramos por volumen.',
    route: '#/producto/textil',
    kind: 'product',
    navigation: { label: 'Textil', primary: true, order: 30 },
  },
  {
    key: 'papeleria',
    label: 'Papeleria',
    description: 'Tarjetas, flyers y piezas impresas por tirada o consulta.',
    route: '#/producto/papeleria',
    kind: 'product',
  },
  {
    key: 'materiales',
    label: 'Materiales',
    description: 'Vinilos y soportes por m2 con lectura comercial directa.',
    route: '#/producto/materiales',
    kind: 'product',
  },
  {
    key: 'carteleria',
    label: 'Carteleria',
    description: 'Lonas y piezas complejas de gran formato sujetas a medidas y confeccion.',
    route: '#/servicios/carteleria',
    kind: 'service',
  },
  {
    key: 'neones',
    label: 'Neones',
    description: 'Rotulos decorativos y luminosos a medida.',
    route: '#/servicios/neones',
    kind: 'service',
  },
  {
    key: 'accesorios',
    label: 'Accesorios',
    description: 'Llaveros y pegatinas con tramos directos y acabados opcionales.',
    route: '#/producto/accesorios',
    kind: 'product',
  },
  {
    key: 'rotulacion',
    label: 'Rotulacion de furgonetas',
    description: 'Proyectos de vehiculo con rangos orientativos y cierre por presupuesto.',
    route: '#/servicios/rotulacion',
    kind: 'service',
  },
]
