import type { CartRecommendation } from '../types/cart.types'

export const cartRecommendations: CartRecommendation[] = [
  {
    id: 'guide',
    title: 'Guia de archivos',
    description: 'Prepara formatos, resolucion y sangrado antes de cerrar el pedido.',
    href: '#/guia',
    priceLabel: 'Checklist premium',
    tag: 'Soporte',
  },
  {
    id: 'textil',
    title: 'Textil personalizado',
    description: 'Amplia el pedido con prendas listas para recibir tu grafica.',
    href: '#/producto/textil-personalizado',
    priceLabel: 'Desde catalogo',
    tag: 'Cross-sell',
  },
  {
    id: 'quote',
    title: 'Proyecto a medida',
    description: 'Rotulacion, montaje o piezas especiales con propuesta comercial guiada.',
    href: '#/presupuesto',
    priceLabel: 'Propuesta guiada',
    tag: 'Servicio',
  },
]
