import type { CatalogCategory } from '../../types/product'

export const catalogCategories: CatalogCategory[] = [
  {
    key: 'dtf',
    label: 'DTI por metro',
    description: 'Producto principal con configuracion visual, archivo, preview y carrito.',
    route: '#/catalogo/dti',
    kind: 'product',
    navigation: { label: 'DTI por metro', primary: true, order: 20 },
  },
  {
    key: 'textil',
    label: 'Estampados / textil',
    description: 'Prendas, polos, gorras y sudaderas con tramos por volumen.',
    route: '#/catalogo/textil',
    kind: 'product',
    navigation: { label: 'Textil', primary: true, order: 30 },
  },
  {
    key: 'rotulacion',
    label: 'Rotulacion',
    description: 'Rotulacion de furgonetas, flotas comerciales, escaparates y vehiculos de empresa.',
    route: '#/catalogo/rotulacion',
    kind: 'service',
    navigation: { label: 'Rotulacion', primary: true, order: 25 },
  },
  {
    key: 'papeleria',
    label: 'Papeleria',
    description: 'Tarjetas, flyers y piezas impresas con opciones visuales y acabados claros.',
    route: '#/catalogo/tarjetas',
    kind: 'product',
  },
  {
    key: 'materiales',
    label: 'Materiales',
    description: 'Vinilos y soportes por m2 con lectura comercial directa.',
    route: '#/catalogo/vinilo-impreso',
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
    description: 'Pegatinas y accesorios con material, troquel y acabado visibles desde el inicio.',
    route: '#/catalogo/pegatinas',
    kind: 'product',
  },
]
