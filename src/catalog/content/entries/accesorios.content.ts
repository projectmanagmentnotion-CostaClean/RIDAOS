import { accesoriosEntries } from '../../products/accesorios'
import type { CatalogSeoContent } from '../types'

function createAccesorioContent(entry: (typeof accesoriosEntries)[number]): CatalogSeoContent {
  return {
    entryId: entry.id,
    slug: entry.slug,
    seoTitle: `${entry.name} | RidaosPrint`,
    metaDescription: `${entry.name} con tirada definida, lectura practica de precio y soporte para archivo cuando aplique.`,
    h1: entry.name,
    eyebrow: 'Accesorios y pegatinas',
    intro: `${entry.name} dentro de una linea directa para series cortas, promociones o piezas de apoyo de marca.`,
    benefits: [
      'Tiradas claras para piezas promocionales.',
      'Compatibilidad con archivo cuando la pieza lo necesita.',
      'Transicion simple entre compra directa y comprobacion tecnica.',
    ],
    useCases: [
      'Stickers, llaveros y piezas de apoyo para marca urbana.',
      'Lotes de merchandising para acciones locales.',
      'Accesorios que necesitan confirmacion antes de fabricar a volumen.',
    ],
    uploadGuidance: [
      'Adjunta archivo cuando la pieza dependa de forma, corte o acabado.',
      'Las tiradas fijas se respetan segun el catalogo activo.',
      'Usa notas para indicar laminado, brillo o referencias de acabado.',
    ],
    faq: [
      {
        question: 'Hay pedido minimo',
        answer: 'Si. Cada accesorio o pegatina parte de una tirada base definida.',
      },
      {
        question: 'Puedo enviar el arte despues',
        answer: 'Si, pero la propuesta sera mas precisa si el archivo ya acompana el pedido.',
      },
    ],
    objectionHandlers: [
      {
        title: 'No se si me conviene carrito o presupuesto',
        response: 'Si la tirada encaja en la tabla, el carrito funciona. Si no, la propuesta personalizada sigue disponible.',
      },
      {
        title: 'Mi pieza necesita acabado especial',
        response: 'Usa notas o pasa a presupuesto para evitar rehacer el pedido mas adelante.',
      },
    ],
    primaryCta: {
      label: 'Anadir al carrito',
    },
    secondaryCta: {
      label: 'Solicitar presupuesto',
      href: '#/presupuesto?service=otro',
    },
  }
}

export const accesoriosSeoContent: CatalogSeoContent[] = accesoriosEntries.map(createAccesorioContent)
