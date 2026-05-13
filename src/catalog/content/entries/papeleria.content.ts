import { papeleriaEntries } from '../../products/papeleria'
import type { CatalogSeoContent } from '../types'

function createPapeleriaContent(entry: (typeof papeleriaEntries)[number]): CatalogSeoContent {
  return {
    entryId: entry.id,
    slug: entry.slug,
    seoTitle: `${entry.name} | RidaosPrint`,
    metaDescription: `${entry.name} con lectura por tirada, condiciones comerciales claras y opcion de archivo de referencia.`,
    h1: entry.name,
    eyebrow: 'Papeleria comercial',
    intro: `${entry.name} con tiradas del catalogo 2026 y un flujo pensado para confirmar archivo, cantidad y condiciones antes de cerrar.`,
    benefits: [
      'Tiradas directas donde el catalogo ya define precio.',
      'Archivo opcional para acelerar la preparacion de la propuesta.',
      'Via de presupuesto disponible para variantes fuera de tramo.',
    ],
    useCases: [
      'Tarjetas de presentacion y material de punto de venta.',
      'Flyers para campanas locales y aperturas.',
      'Pedidos con necesidad de diseno o adaptacion adicional.',
    ],
    uploadGuidance: [
      'Adjunta el archivo si ya tienes el arte final.',
      'Si necesitas diseno o adaptacion, indicarlo en notas acelera la propuesta.',
      'La comprobacion final sigue sujeta a formato, cantidad y acabado.',
    ],
    faq: [
      {
        question: 'Puedo pedir otras cantidades',
        answer: 'Si la cantidad no encaja en los tramos visibles, el siguiente paso es presupuesto.',
      },
      {
        question: 'El diseno esta incluido',
        answer: 'No siempre. El catalogo separa la impresion del trabajo de diseno cuando corresponde.',
      },
    ],
    objectionHandlers: [
      {
        title: 'Mi pedido no encaja exactamente en la tirada',
        response: 'Usa la via de presupuesto para adaptar cantidad, formato o acabado sin perder el contexto comercial.',
      },
      {
        title: 'No tengo el archivo final',
        response: 'Puedes avanzar sin archivo y dejar la referencia lista para la propuesta.',
      },
    ],
    primaryCta: {
      label: entry.purchaseMode === 'quote' ? 'Solicitar presupuesto' : 'Anadir al carrito',
    },
    secondaryCta: {
      label: 'Solicitar presupuesto',
      href: '#/presupuesto?service=papeleria',
    },
  }
}

export const papeleriaSeoContent: CatalogSeoContent[] = papeleriaEntries.map(createPapeleriaContent)
