import { rotulacionEntries } from '../../services/rotulacion'
import type { CatalogSeoContent } from '../types'

function createRotulacionContent(entry: (typeof rotulacionEntries)[number]): CatalogSeoContent {
  return {
    entryId: entry.id,
    slug: entry.slug,
    seoTitle: `${entry.name} | RidaosPrint`,
    metaDescription: `${entry.name} con rango orientativo, revision manual y paso directo a propuesta personalizada.`,
    h1: entry.name,
    eyebrow: 'Rotulacion de vehiculos',
    intro: `${entry.name} con rango comercial visible para situar cobertura, tamano y complejidad antes de pedir propuesta.`,
    benefits: [
      'Rango orientativo para no empezar la conversacion a ciegas.',
      'Lectura clara del nivel de cobertura del vehiculo.',
      'Base preparada para archivo, medidas y revision comercial.',
    ],
    useCases: [
      'Furgonetas de servicio, flotas y piezas promocionales sobre vehiculo.',
      'Proyectos donde la cobertura define el presupuesto real.',
      'Clientes que necesitan estimacion rapida antes de visita o medicion.',
    ],
    uploadGuidance: [
      'El archivo es util, pero no obligatorio para la primera propuesta.',
      'Indica el tamano del vehiculo para orientar el rango inicial.',
      'La medicion final y la instalacion siempre pasan por revision manual.',
    ],
    faq: [
      {
        question: 'El rango ya cierra el proyecto',
        answer: 'No. Sirve para orientar la conversacion; el presupuesto final requiere revision.',
      },
      {
        question: 'Incluye instalacion',
        answer: 'La definicion final de instalacion y materiales se confirma en la propuesta.',
      },
    ],
    objectionHandlers: [
      {
        title: 'No quiero pedir presupuesto sin saber el orden de magnitud',
        response: 'Por eso la pagina muestra un rango antes de pasar a la propuesta personalizada.',
      },
      {
        title: 'No tengo el arte final cerrado',
        response: 'Puedes avanzar igual y dejar la pieza preparada para revision comercial.',
      },
    ],
    primaryCta: {
      label: 'Solicitar presupuesto',
      href: '#/presupuesto?service=rotulacion',
    },
    secondaryCta: {
      label: 'Ir al formulario',
      href: '#/presupuesto?service=rotulacion',
    },
  }
}

export const rotulacionSeoContent: CatalogSeoContent[] = rotulacionEntries.map(createRotulacionContent)
