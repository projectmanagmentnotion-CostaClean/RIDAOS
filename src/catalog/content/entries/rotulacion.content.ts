import { rotulacionEntries } from '../../services/rotulacion'
import type { CatalogSeoContent } from '../types'

function createRotulacionContent(entry: (typeof rotulacionEntries)[number]): CatalogSeoContent {
  return {
    entryId: entry.id,
    slug: entry.slug,
    seoTitle: `${entry.name} | RidaosPrint`,
    metaDescription: `${entry.name} con rango orientativo y paso directo a una propuesta personalizada.`,
    h1: entry.name,
    eyebrow: 'Rotulacion de vehiculos',
    intro: `${entry.name} con rango comercial visible para situar cobertura, tamano y complejidad antes de pedir una propuesta.`,
    benefits: [
      'Rango orientativo para no empezar la conversacion a ciegas.',
      'Lectura clara del nivel de cobertura del vehiculo.',
      'Base preparada para archivo, medidas y una propuesta clara.',
    ],
    useCases: [
      'Furgonetas de servicio, flotas y piezas promocionales sobre vehiculo.',
      'Proyectos donde la cobertura define el presupuesto real.',
      'Clientes que necesitan estimacion rapida antes de visita o medicion.',
    ],
    uploadGuidance: [
      'El archivo es util, pero no obligatorio para la primera propuesta.',
      'Indica el tamano del vehiculo para orientar el rango inicial.',
      'La medicion final y la instalacion siempre se confirman antes de cerrar el proyecto.',
    ],
    faq: [
      {
        question: 'El rango ya cierra el proyecto',
        answer: 'No. Sirve para orientar la conversacion; el presupuesto final se confirma con los detalles del proyecto.',
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
        response: 'Puedes avanzar igual y dejar la pieza preparada para recibir una propuesta.',
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
