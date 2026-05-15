import { neonesEntries } from '../../services/neones'
import type { CatalogSeoContent } from '../types'

function createNeonContent(entry: (typeof neonesEntries)[number]): CatalogSeoContent {
  return {
    entryId: entry.id,
    slug: entry.slug,
    seoTitle: `${entry.name} | RidaosPrint`,
    metaDescription: `${entry.name} con lectura comercial orientativa y foco en forma, color y complejidad.`,
    h1: entry.name,
    eyebrow: 'Neones y piezas luminosas',
    intro: `${entry.name} pensado para proyectos decorativos o de marca donde la forma y la complejidad mandan el presupuesto final.`,
    benefits: [
      'Lectura comercial seria antes de entrar en fabricacion.',
      'Espacio para archivo, medidas y contexto visual.',
      'Proceso claro para piezas especiales que no deben entrar en compra directa.',
    ],
    useCases: [
      'Interiores comerciales, escaparates y piezas de marca.',
      'Senales decorativas con forma o color personalizado.',
      'Proyectos que necesitan una comprobacion tecnica antes de fabricarse.',
    ],
    uploadGuidance: [
      'Adjunta referencia si ya existe boceto, logo o arte final.',
      'Si el proyecto depende de forma o varios colores, detalla esa parte en el resumen.',
      'La fabricacion final siempre se confirma con una comprobacion tecnica.',
    ],
    faq: [
      {
        question: 'El precio es cerrado',
        answer: 'Solo cuando el proyecto encaja en una pieza decorativa simple; el resto va a propuesta.',
      },
      {
        question: 'Incluye instalacion',
        answer: 'La instalacion se confirma segun el proyecto y no debe asumirse en el rango base.',
      },
    ],
    objectionHandlers: [
      {
        title: 'Mi idea todavia no esta definida',
        response: 'La pagina esta preparada para recoger una referencia y convertirla en propuesta comercial.',
      },
      {
        title: 'No se si mi pieza entra en rango o en consulta',
        response: 'La vista actual sirve para orientar y dejar claro cuando la complejidad ya exige una propuesta personalizada.',
      },
    ],
    primaryCta: {
      label: 'Solicitar presupuesto',
      href: '#/presupuesto?service=neones',
    },
    secondaryCta: {
      label: 'Ir al formulario',
      href: '#/presupuesto?service=neones',
    },
  }
}

export const neonesSeoContent: CatalogSeoContent[] = neonesEntries.map(createNeonContent)
