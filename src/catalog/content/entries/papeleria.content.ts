import { papeleriaEntries } from '../../products/papeleria'
import type { CatalogSeoContent } from '../types'

function createPapeleriaContent(entry: (typeof papeleriaEntries)[number]): CatalogSeoContent {
  return {
    entryId: entry.id,
    slug: entry.slug,
    seoTitle:
      entry.id === 'tarjetas-estandar'
        ? 'Tarjetas de visita premium | Soft touch, barniz 3D y foil | RidaosPrint'
        : 'Flyers y folletos personalizados | Formato, papel y doble cara | RidaosPrint',
    metaDescription:
      entry.id === 'tarjetas-estandar'
        ? 'Tarjetas de visita con papel, gramaje y acabados premium para una primera impresion mas fuerte.'
        : 'Flyers y folletos personalizados con formato, papel y doble cara claros antes de pedir.',
    ogImage:
      entry.id === 'tarjetas-estandar'
        ? '/assets/seo/og-tarjetas.jpg'
        : '/assets/seo/og-flyers.jpg',
    h1: entry.name,
    eyebrow: entry.id === 'tarjetas-estandar' ? 'Tarjetas premium' : 'Flyers y folletos',
    intro:
      entry.id === 'tarjetas-estandar'
        ? 'Tarjetas con una lectura directa de formato, papel y acabado para comprar mejor y discutir menos.'
        : 'Flyers y folletos con formato, orientacion y papel claros para decidir rapido sin perder el tono premium.',
    benefits: [
      entry.id === 'tarjetas-estandar'
        ? 'Formatos y acabados premium visibles desde el primer paso.'
        : 'Formatos de reparto y promocion listos para configurar.',
      entry.id === 'tarjetas-estandar'
        ? 'Archivo opcional si aun estas cerrando el diseno.'
        : 'Doble cara, papel y gramaje sin esconder la configuracion.',
      'Via de presupuesto disponible para variantes fuera de tramo.',
    ],
    useCases: [
      entry.id === 'tarjetas-estandar'
        ? 'Tarjetas de visita para empresa, retail y equipos comerciales.'
        : 'Flyers para campanas locales, aperturas y reparto comercial.',
      entry.id === 'tarjetas-estandar'
        ? 'Piezas con tacto, gramaje y detalle de marca.'
        : 'Folletos cortos para promociones, eventos y mostrador.',
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
