import { textilEntries } from '../../products/textil'
import type { CatalogSeoContent } from '../types'

function createTextilContent(
  entry: (typeof textilEntries)[number],
  overrides?: Partial<Pick<CatalogSeoContent, 'intro' | 'benefits' | 'useCases'>>,
): CatalogSeoContent {
  return {
    entryId: entry.id,
    slug: entry.slug,
    seoTitle: `${entry.name} | RidaosPrint`,
    metaDescription: `${entry.name} con precio por volumen, lectura comercial directa y confirmacion posterior del pedido.`,
    h1: entry.name,
    eyebrow: 'Textil y estampacion',
    intro:
      overrides?.intro ??
      `${entry.name} dentro del catalogo textil con tramos por cantidad y base lista para carrito o presupuesto.`,
    benefits:
      overrides?.benefits ?? [
        'Tramos por volumen visibles desde el inicio.',
        'Lectura rapida para pedidos repetibles.',
        'Condiciones comerciales alineadas con el catalogo 2026.',
      ],
    useCases:
      overrides?.useCases ?? [
        'Merch, equipacion interna y series cortas.',
        'Pedidos con confirmacion comercial antes de fabricar.',
        'Reposiciones textiles con una base clara de precio.',
      ],
    uploadGuidance: [
      'Puedes adjuntar arte final si ya lo tienes preparado.',
      'Si la prenda la aporta el cliente, el plazo final queda sujeto a comprobacion.',
      'Anota acabados o posiciones especiales en el campo de notas.',
    ],
    faq: [
      {
        question: 'El precio ya incluye estampacion',
        answer: 'Si. El catalogo base contempla la pieza y la estampacion indicada en cada producto.',
      },
      {
        question: 'Puedo pedir una sola unidad',
        answer: 'Depende del tramo del producto. La lectura final la marca la configuracion activa.',
      },
    ],
    objectionHandlers: [
      {
        title: 'Necesito comparar varias prendas',
        response: 'Puedes cambiar de variante en la misma pagina sin salir del flujo.',
      },
      {
        title: 'No se si mi pedido ira a compra directa o presupuesto',
        response: 'La pagina mantiene carrito para casos simples y deja la via de presupuesto abierta cuando haga falta.',
      },
    ],
    primaryCta: {
      label: 'Anadir al carrito',
    },
    secondaryCta: {
      label: 'Solicitar presupuesto',
      href: '#/presupuesto?service=textil',
    },
  }
}

export const textilSeoContent: CatalogSeoContent[] = textilEntries.map((entry) =>
  createTextilContent(entry),
)
