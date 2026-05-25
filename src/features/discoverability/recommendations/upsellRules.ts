import type { FrequentlyCombinedBundle, UpsellRule } from '../types/discoverability'

export const upsellRules: UpsellRule[] = [
  {
    id: 'upsell-rotulacion-furgoneta',
    trigger: 'rotulacion',
    label: 'Upselling para rotulacion de furgoneta',
    suggestions: [
      { id: 'u-wrap-design', title: 'Diseno de rotulacion', description: 'Propuesta visual para vehiculo y cobertura comercial.', href: '#/contacto', tag: 'Design' },
      { id: 'u-cards', title: 'Tarjetas empresa', description: 'Refuerzo comercial para visitas y entrega.', href: '#/producto/papeleria', tag: 'Papeleria' },
      { id: 'u-dtf-uniformes', title: 'DTI uniformes', description: 'Textil corporativo para alinear vehiculo y equipo.', href: '#/producto/dtf', tag: 'Textil' },
      { id: 'u-stickers', title: 'Pegatinas de marca', description: 'Aplicaciones adhesivas complementarias para packaging y showroom.', href: '#/catalogo', tag: 'Sticker' },
      { id: 'u-window-vinyl', title: 'Vinilos escaparate', description: 'Continuidad visual del vehiculo al local.', href: '#/servicios/carteleria', tag: 'Retail' },
    ],
  },
  {
    id: 'upsell-dtf',
    trigger: 'dtf',
    label: 'Upselling para DTF por metro',
    suggestions: [
      { id: 'u-shirts', title: 'Camisetas', description: 'Soporte textil para lanzar produccion directa.', href: '#/producto/textil', tag: 'Apparel' },
      { id: 'u-hoodies', title: 'Sudaderas', description: 'Sube ticket medio con prendas de mayor valor.', href: '#/producto/textil', tag: 'Upsell' },
      { id: 'u-bags', title: 'Bolsas textiles', description: 'Extiende la aplicacion a retail, eventos y merchandising.', href: '#/producto/textil', tag: 'Merch' },
      { id: 'u-labels', title: 'Etiquetas', description: 'Refina acabado y presentacion de marca.', href: '#/producto/materiales', tag: 'Acabado' },
      { id: 'u-review', title: 'Revision profesional de archivo', description: 'Reduce errores antes de imprimir y producir.', href: '#/guia', tag: 'Prepress' },
    ],
  },
  {
    id: 'upsell-tarjetas',
    trigger: 'papeleria',
    label: 'Upselling para tarjetas y papeleria',
    suggestions: [
      { id: 'u-flyers', title: 'Flyers', description: 'Amplia el kit comercial con material de reparto.', href: '#/producto/papeleria', tag: 'Print' },
      { id: 'u-stickers-brand', title: 'Pegatinas', description: 'Apoya packaging y promociones locales.', href: '#/catalogo', tag: 'Sticker' },
      { id: 'u-rollup', title: 'Roll-up y carteleria', description: 'Lleva la marca a feria, mostrador o punto de venta.', href: '#/servicios/carteleria', tag: 'Display' },
      { id: 'u-window-wrap', title: 'Rotulacion escaparate', description: 'Convierte la grafica impresa en presencia fisica visible.', href: '#/servicios/rotulacion', tag: 'Retail' },
    ],
  },
]

export const frequentlyCombinedBundles: FrequentlyCombinedBundle[] = [
  {
    id: 'bundle-empresa-local',
    title: 'Pack empresa local',
    description: 'Rotulacion, tarjetas, pegatinas y textil basico para lanzar marca con coherencia.',
    items: [
      { id: 'b-rot', title: 'Rotulacion comercial', description: 'Visibilidad en calle para vehiculo o local.', href: '#/servicios/rotulacion' },
      { id: 'b-cards', title: 'Tarjetas empresa', description: 'Soporte comercial fisico.', href: '#/producto/papeleria' },
      { id: 'b-stickers', title: 'Pegatinas marca', description: 'Aplicacion adhesiva rapida.', href: '#/catalogo' },
      { id: 'b-textil', title: 'DTF o textil', description: 'Identidad de equipo y eventos.', href: '#/producto/dtf' },
    ],
  },
  {
    id: 'bundle-dtf-launch',
    title: 'Pack DTF y textil',
    description: 'DTF por metro, prendas y revision de archivo para produccion mas segura.',
    items: [
      { id: 'b-dtf', title: 'DTF por metro', description: 'Base de produccion.', href: '#/producto/dtf' },
      { id: 'b-shirts', title: 'Camisetas', description: 'Soporte textil.', href: '#/producto/textil' },
      { id: 'b-prepress', title: 'Revision de archivo', description: 'Control previo a impresion.', href: '#/guia' },
    ],
  },
]
