import type { OrderItem } from '../types/backend'
import type { ProductCategory, ProductRecord } from '../types/product'

export const commercialConditions = [
  'Precios sin IVA.',
  'Anticipo requerido y saldo contra entrega.',
  'Cambios de diseno sujetos a nueva cotizacion.',
  'Plazos de produccion sujetos a revision.',
] as const

export const productCategories: ProductCategory[] = [
  {
    key: 'textil',
    label: 'Estampados / textil',
    description: 'Prendas, polos, gorras y bolsas con tramos por volumen.',
    route: '#/producto/textil',
  },
  {
    key: 'papeleria',
    label: 'Papeleria',
    description: 'Tarjetas y flyers con tramos de tirada y opcion de diseno.',
    route: '#/producto/papeleria',
  },
  {
    key: 'materiales',
    label: 'Materiales',
    description: 'Vinilos, soportes rigidos y materiales por m2 o consulta.',
    route: '#/producto/materiales',
  },
  {
    key: 'carteleria',
    label: 'Carteleria',
    description: 'Lonas y piezas complejas de gran formato sujetas a medidas y confeccion.',
  },
  {
    key: 'neones',
    label: 'Neones',
    description: 'Rotulos decorativos y luminosos con medidas y colores personalizados.',
    route: '#/servicios/neones',
  },
  {
    key: 'accesorios',
    label: 'Accesorios',
    description: 'Llaveros y pegatinas con tramos directos y laminado opcional.',
    route: '#/producto/accesorios',
  },
  {
    key: 'rotulacion',
    label: 'Rotulacion de furgonetas',
    description: 'Rotulacion basica, parcial, semi-integral y full wrap por tamano.',
    route: '#/servicios/rotulacion',
  },
]

export const productCatalog: ProductRecord[] = [
  {
    id: 'dtf-metro',
    name: 'DTF por metro',
    category: 'textil',
    salesMode: 'direct',
    pricingModel: 'unit',
    route: '#/producto/dtf',
    description: 'Producto flagship con configurador propio, preview y carrito activo.',
    unitLabel: 'metro',
    highlight: true,
    badge: 'Compra directa',
    basePrice: 14.5,
    productionTime: 'Segun flujo DTF y revision de archivo.',
  },
  {
    id: 'camiseta-basica',
    name: 'Camiseta basica estampada',
    category: 'textil',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/textil',
    description: 'Camiseta 100% algodon con estampado delante y atras segun el catalogo 2026.',
    unitLabel: 'ud',
    badge: 'Textil',
    productionTime: '24-48h o 5 dias habiles si traen prenda.',
    notes: ['Incluye delante y atras.', '+2 EUR por estampado adicional.'],
    tiers: [
      { min: 1, max: 1, unitPrice: 25, note: '1 sola camiseta' },
      { min: 8, max: 19, unitPrice: 13, note: 'Mas de 8 prendas' },
      { min: 20, unitPrice: 12, note: 'Mas de 20 prendas' },
    ],
  },
  {
    id: 'camiseta-premium',
    name: 'Camiseta premium estampada',
    category: 'textil',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/textil',
    description: 'Version premium 100% algodon con tramos por volumen.',
    unitLabel: 'ud',
    badge: 'Textil',
    productionTime: 'Segun stock y revison del pedido.',
    notes: ['+3 EUR por estampado adicional.'],
    tiers: [
      { min: 1, max: 5, unitPrice: 35, note: 'Menos de 6 prendas' },
      { min: 6, max: 13, unitPrice: 32, note: 'Mas de 6 prendas' },
      { min: 14, unitPrice: 28, note: 'Mas de 14 prendas' },
    ],
  },
  {
    id: 'gorra-camionero',
    name: 'Gorra camionero',
    category: 'textil',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/textil',
    description: 'Modelo camionero con tramo por volumen.',
    unitLabel: 'ud',
    tiers: [
      { min: 1, max: 7, unitPrice: 10 },
      { min: 8, unitPrice: 8 },
    ],
  },
  {
    id: 'polo-corto',
    name: 'Polo manga corta',
    category: 'textil',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/textil',
    description: 'Polo manga corta con tramos por volumen.',
    unitLabel: 'ud',
    tiers: [
      { min: 1, max: 7, unitPrice: 18 },
      { min: 8, unitPrice: 17 },
    ],
  },
  {
    id: 'sudadera',
    name: 'Sudadera',
    category: 'textil',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/textil',
    description: 'Sudadera con tarifa directa por volumen.',
    unitLabel: 'ud',
    tiers: [
      { min: 1, max: 7, unitPrice: 20 },
      { min: 8, unitPrice: 18 },
    ],
  },
  {
    id: 'tarjetas-estandar',
    name: 'Tarjetas 8,5 x 5,5 cm',
    category: 'papeleria',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/papeleria',
    description: 'Tarjetas estandar con tramos de tirada del catalogo 2026.',
    unitLabel: 'tirada',
    productionTime: '4-5 dias habiles.',
    notes: ['Diseno de tarjetas: 35 EUR/hora.', 'Mismo precio para 1 cara o 2 caras.'],
    tiers: [
      { min: 100, max: 100, totalPrice: 40 },
      { min: 250, max: 250, totalPrice: 50 },
      { min: 500, max: 500, totalPrice: 60 },
      { min: 1000, max: 1000, totalPrice: 85 },
      { min: 2500, max: 2500, totalPrice: 105 },
      { min: 5000, max: 5000, totalPrice: 135 },
    ],
  },
  {
    id: 'flyer-a6',
    name: 'Flyer A6',
    category: 'papeleria',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/papeleria',
    description: 'Flyer tamano A6 con tramos por tirada del PDF.',
    unitLabel: 'tirada',
    productionTime: '4-5 dias habiles.',
    notes: ['Mismo precio para 1 cara o 2 caras.'],
    tiers: [
      { min: 100, max: 100, totalPrice: 85 },
      { min: 250, max: 250, totalPrice: 90 },
      { min: 500, max: 500, totalPrice: 100 },
      { min: 1000, max: 1000, totalPrice: 110 },
      { min: 2500, max: 2500, totalPrice: 130 },
      { min: 5000, max: 5000, totalPrice: 165 },
    ],
  },
  {
    id: 'flyer-a5',
    name: 'Flyer A5',
    category: 'papeleria',
    salesMode: 'quote',
    pricingModel: 'quote',
    route: '#/producto/papeleria',
    description: 'A5, A4 y A3 quedan preparados para consulta comercial segun tirada.',
    badge: 'Consultar',
    notes: ['Consultar medidas y cantidades para otras variantes de flyers.'],
  },
  {
    id: 'vinilo-monomerico',
    name: 'Vinilo monomerico',
    category: 'materiales',
    salesMode: 'direct',
    pricingModel: 'm2',
    route: '#/producto/materiales',
    description: 'Vinilo monomerico por metro cuadrado.',
    unitLabel: 'm2',
    basePrice: 80,
  },
  {
    id: 'vinilo-microperforado',
    name: 'Vinilo microperforado',
    category: 'materiales',
    salesMode: 'direct',
    pricingModel: 'm2',
    route: '#/producto/materiales',
    description: 'Vinilo microperforado homologado por metro cuadrado.',
    unitLabel: 'm2',
    basePrice: 85,
  },
  {
    id: 'vinilo-polimerico',
    name: 'Vinilo polimerico',
    category: 'materiales',
    salesMode: 'direct',
    pricingModel: 'm2',
    route: '#/producto/materiales',
    description: 'Vinilo polimerico por metro cuadrado.',
    unitLabel: 'm2',
    basePrice: 90,
  },
  {
    id: 'vinilo-pared',
    name: 'Vinilo pared',
    category: 'materiales',
    salesMode: 'direct',
    pricingModel: 'm2',
    route: '#/producto/materiales',
    description: 'Vinilo de pared por metro cuadrado.',
    unitLabel: 'm2',
    basePrice: 100,
  },
  {
    id: 'lona-impresa',
    name: 'Lona impresa',
    category: 'carteleria',
    salesMode: 'quote',
    pricingModel: 'quote',
    route: '#/presupuesto?service=carteleria',
    description: 'Depende de medidas, cantidades, ojales y confeccion.',
    notes: ['La lona compleja pasa por presupuesto.'],
  },
  {
    id: 'llavero-6x6',
    name: 'Llavero 6 x 6 cm',
    category: 'accesorios',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/accesorios',
    description: 'Llavero de metacrilato cortado a laser en tirada de 1000 unidades.',
    unitLabel: 'tirada',
    tiers: [{ min: 1000, max: 1000, totalPrice: 150 }],
  },
  {
    id: 'llavero-8x8',
    name: 'Llavero 8 x 8 cm',
    category: 'accesorios',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/accesorios',
    description: 'Llavero de metacrilato 8 x 8 cm en tirada de 1000 unidades.',
    unitLabel: 'tirada',
    tiers: [{ min: 1000, max: 1000, totalPrice: 170 }],
  },
  {
    id: 'pegatina-sin-laminar',
    name: 'Pegatina 10 x 10 sin laminar',
    category: 'accesorios',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/accesorios',
    description: 'Pegatina ecosolvente sin laminar con tiradas cortas.',
    unitLabel: 'ud',
    tiers: [
      { min: 50, max: 50, unitPrice: 2.5 },
      { min: 100, max: 100, unitPrice: 2.2 },
      { min: 200, max: 200, unitPrice: 1.9 },
      { min: 300, max: 300, unitPrice: 1.7 },
    ],
  },
  {
    id: 'pegatina-laminada',
    name: 'Pegatina 10 x 10 laminada',
    category: 'accesorios',
    salesMode: 'direct',
    pricingModel: 'volume',
    route: '#/producto/accesorios',
    description: 'Pegatina laminada con acabado mate o brillo.',
    unitLabel: 'tirada',
    tiers: [
      { min: 100, max: 100, totalPrice: 90 },
      { min: 200, max: 200, totalPrice: 160 },
      { min: 300, max: 300, totalPrice: 220 },
    ],
  },
  {
    id: 'rotulacion-basica',
    name: 'Rotulacion basica de furgoneta',
    category: 'rotulacion',
    salesMode: 'quote',
    pricingModel: 'range',
    route: '#/servicios/rotulacion',
    description: 'Logo en puertas e informacion de contacto. Incluye material e instalacion. No incluye diseno.',
    range: { min: 180, max: 1000 },
    badge: 'Presupuesto',
    notes: ['Vinilo en color plano o impreso.'],
  },
  {
    id: 'rotulacion-parcial',
    name: 'Rotulacion parcial de furgoneta',
    category: 'rotulacion',
    salesMode: 'quote',
    pricingModel: 'range',
    route: '#/servicios/rotulacion',
    description: 'Aplicacion por secciones. Mas economica que la integral y util para flotas.',
    range: { min: 300, max: 1000 },
    badge: 'Presupuesto',
  },
  {
    id: 'rotulacion-semi',
    name: 'Rotulacion semi-integral',
    category: 'rotulacion',
    salesMode: 'quote',
    pricingModel: 'range',
    route: '#/servicios/rotulacion',
    description: 'Laterales, traseros y bajos con microperforado trasero homologado.',
    range: { min: 900, max: 2000 },
    badge: 'Presupuesto',
  },
  {
    id: 'rotulacion-full-wrap',
    name: 'Rotulacion full wrap',
    category: 'rotulacion',
    salesMode: 'quote',
    pricingModel: 'range',
    route: '#/servicios/rotulacion',
    description: 'Cubre la totalidad del vehiculo. Incluye material e instalacion. No incluye diseno.',
    range: { min: 1800, max: 3400 },
    badge: 'Presupuesto',
    notes: ['Duracion aproximada de 3 a 5 anos.'],
  },
  {
    id: 'neon-centro-estetica',
    name: 'Cartel decorativo neon',
    category: 'neones',
    salesMode: 'quote',
    pricingModel: 'range',
    route: '#/servicios/neones',
    description: 'Pieza decorativa personalizada. Variacion de precio segun complejidad del diseno.',
    range: { min: 300, max: 600 },
    badge: 'A consultar',
    notes: ['Mas de 3 colores: consultar presupuesto.', 'No incluye instalacion.'],
  },
  {
    id: 'neon-forma-personalizada',
    name: 'Neon de forma personalizada',
    category: 'neones',
    salesMode: 'quote',
    pricingModel: 'quote',
    route: '#/servicios/neones',
    description: 'Formato circular, cuadrado o forma personalizada con medida maxima sujeta a revision.',
    badge: 'A consultar',
  },
]

export const quoteServiceOptions = [
  'Rotulacion de vehiculos',
  'Vinilos decorativos',
  'Diseno grafico',
  'Lonas gran formato',
  'Textil personalizado',
  'Papeleria',
  'Materiales',
  'Neones',
  'Accesorios',
  'Carteleria',
  'Otro',
] as const

export function getProductsByCategory(category: ProductCategory['key']) {
  return productCatalog.filter((product) => product.category === category)
}

export function getProductById(productId: string) {
  return productCatalog.find((product) => product.id === productId)
}

export function getCatalogGroups() {
  return {
    direct: productCatalog.filter((product) => product.salesMode === 'direct' && !product.highlight),
    quote: productCatalog.filter((product) => product.salesMode === 'quote'),
    textil: productCatalog.filter((product) => product.category === 'textil' && product.id !== 'dtf-metro'),
    granFormato: productCatalog.filter((product) =>
      ['materiales', 'carteleria', 'rotulacion', 'neones'].includes(product.category),
    ),
  }
}

export function formatRangeLabel(min: number, max: number) {
  return `${min} EUR - ${max} EUR`
}

export function getOrderItemSummary(item: Pick<OrderItem, 'configuration' | 'artwork'>) {
  if (item.configuration.summary && item.configuration.summary.length > 0) {
    return item.configuration.summary
  }

  const summary: string[] = []

  if (item.configuration.meters) {
    summary.push(`${item.configuration.meters} m`)
  }

  if (item.configuration.quantity) {
    summary.push(`${item.configuration.quantity} uds`)
  }

  if (item.configuration.areaM2) {
    summary.push(`${item.configuration.areaM2} m2`)
  }

  if (item.configuration.variant) {
    summary.push(item.configuration.variant)
  }

  if (item.configuration.size) {
    summary.push(item.configuration.size)
  }

  if (item.artwork.fileName && item.artwork.fileName !== 'Sin archivo adjunto') {
    summary.push(item.artwork.fileName)
  }

  return summary
}
