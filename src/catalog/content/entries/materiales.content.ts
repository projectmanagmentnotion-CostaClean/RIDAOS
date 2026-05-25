import { materialesEntries } from '../../products/materiales'
import type { CatalogSeoContent } from '../types'

function createMaterialContent(entry: (typeof materialesEntries)[number]): CatalogSeoContent {
  return {
    entryId: entry.id,
    slug: entry.slug,
    seoTitle: `${entry.name} | RidaosPrint`,
    metaDescription: `${entry.name} por metro cuadrado con base comercial clara y comprobacion posterior del soporte final.`,
    h1: entry.name,
    eyebrow: 'Materiales y vinilos',
    intro: `${entry.name} con lectura por superficie para piezas directas o proyectos que luego puedan ampliarse a presupuesto.`,
    benefits: [
      'Calculo por m2 desde la propia pagina.',
      'Soportes preparados para derivar a propuesta si el proyecto crece.',
      'Condiciones comerciales unificadas en toda la linea de materiales.',
    ],
    useCases: [
      'Escaparates, cristaleras y senaletica puntual.',
      'Decoracion mural y piezas de retail.',
      'Proyectos que luego escalan a instalacion o gran formato.',
    ],
    uploadGuidance: [
      'El archivo es opcional en la primera estimacion del proyecto.',
      'Si el soporte requiere homologacion o una comprobacion extra, se confirmara despues.',
      'Indica medidas reales y contexto de uso para evitar rehacer la propuesta.',
    ],
    faq: [
      {
        question: 'El precio es definitivo',
        answer: 'Es una base util para estimar. El soporte final y la instalacion pueden requerir una comprobacion adicional.',
      },
      {
        question: 'Puedo pedir solo material',
        answer: 'Si. La pagina parte de ese caso y deja abierta la ampliacion a servicios.',
      },
    ],
    objectionHandlers: [
      {
        title: 'No se cuanto m2 necesito',
        response: 'Puedes estimar aqui y pasar a presupuesto si el proyecto necesita medicion real.',
      },
      {
        title: 'Mi proyecto incluye instalacion',
        response: 'La pagina resuelve la base de material y la propuesta comercial recoge el resto.',
      },
    ],
    primaryCta: {
      label: 'Anadir al carrito',
    },
    secondaryCta: {
      label: 'Solicitar presupuesto',
      href: '#/presupuesto?service=materiales',
    },
  }
}

export const materialesSeoContent: CatalogSeoContent[] = materialesEntries.map(createMaterialContent)
