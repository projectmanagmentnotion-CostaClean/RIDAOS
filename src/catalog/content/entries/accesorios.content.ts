import { accesoriosEntries } from '../../products/accesorios'
import type { CatalogSeoContent } from '../types'

function createAccesorioContent(entry: (typeof accesoriosEntries)[number]): CatalogSeoContent {
  return {
    entryId: entry.id,
    slug: entry.slug,
    seoTitle:
      entry.id.startsWith('pegatina')
        ? 'Pegatinas personalizadas | Troquel, material y acabado | RidaosPrint'
        : `${entry.name} | RidaosPrint`,
    metaDescription:
      entry.id.startsWith('pegatina')
        ? 'Pegatinas personalizadas con material, troquel y acabado claros para marca, packaging y exterior.'
        : `${entry.name} con tirada definida, lectura practica de precio y soporte para archivo cuando aplique.`,
    ogImage: entry.id.startsWith('pegatina') ? '/assets/seo/og-pegatinas.jpg' : undefined,
    h1: entry.name,
    eyebrow: entry.id.startsWith('pegatina') ? 'Pegatinas personalizadas' : 'Accesorios y pegatinas',
    intro:
      entry.id.startsWith('pegatina')
        ? 'Pegatinas que parecen parte de tu marca, no un anadido, con material y corte visibles antes de pedir.'
        : `${entry.name} dentro de una linea directa para series cortas, promociones o piezas de apoyo de marca.`,
    benefits: [
      entry.id.startsWith('pegatina') ? 'Troquel, material y acabado claros.' : 'Tiradas claras para piezas promocionales.',
      entry.id.startsWith('pegatina') ? 'Compatibilidad con exterior, transparente o kiss cut.' : 'Compatibilidad con archivo cuando la pieza lo necesita.',
      'Transicion simple entre compra directa y comprobacion tecnica.',
    ],
    useCases: [
      entry.id.startsWith('pegatina') ? 'Pegatinas para branding, packaging y exterior.' : 'Stickers, llaveros y piezas de apoyo para marca urbana.',
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
