import { rotulacionEntries } from '../../services/rotulacion'
import { localSeoContent } from '../../../content/localSeoContent'
import type { CatalogSeoContent } from '../types'

function createRotulacionContent(entry: (typeof rotulacionEntries)[number]): CatalogSeoContent {
  return {
    entryId: entry.id,
    slug: entry.slug,
    seoTitle: 'Rotulacion de vehiculos y furgonetas en Barcelona, Blanes y Girona | RidaosPrint',
    metaDescription:
      'Rotulacion premium para furgonetas, flotas comerciales, escaparates y vehiculos de empresa en Barcelona, Blanes, Girona y Costa Brava.',
    ogImage: '/assets/seo/og-rotulacion-furgonetas-barcelona.jpg',
    h1: 'Rotulacion premium para vehiculos y negocios.',
    eyebrow: 'Rotulacion comercial / vehiculos / flotas',
    intro:
      'Convierte cada trayecto en publicidad con rotulacion para furgonetas, vehiculos de empresa, escaparates y proyectos personalizados con cobertura local.',
    benefits: [
      'Rotulacion de furgonetas, vehiculos comerciales y particulares con lectura clara del alcance.',
      'Cobertura lista para media rotulacion, integral, escaparates, señaletica y flotas.',
      'Proceso pensado para negocios que necesitan visibilidad en calle sin depender de explicaciones largas.',
    ],
    useCases: [
      'Rotulacion de furgonetas en Barcelona para instaladores, retail, reparto y servicios.',
      'Vehiculos de empresa, flotas comerciales y proyectos con imagen corporativa repetible.',
      'Escaparates, vinilos comerciales y señaletica para negocios en Blanes, Girona y Costa Brava.',
    ],
    uploadGuidance: [
      'El archivo final ayuda, pero puedes pedir propuesta aunque todavia no tengas el diseño cerrado.',
      'Indica tipo de vehiculo, cobertura aproximada y zona de trabajo para orientar mejor la propuesta.',
      'La medicion final, materiales y montaje se confirman antes de fabricar e instalar.',
    ],
    faq: [...localSeoContent.rotulacion.faq],
    objectionHandlers: [
      {
        title: 'No quiero pedir presupuesto sin saber si encaja en mi presupuesto',
        response: 'La pagina deja una referencia orientativa y despues ajustamos el proyecto segun cobertura, vehiculo y montaje real.',
      },
      {
        title: 'Todavia no tengo el arte final',
        response: 'Puedes avanzar igual. Primero cerramos cobertura, objetivos y soporte, y despues revisamos el diseño final.',
      },
    ],
    primaryCta: {
      label: 'Solicitar presupuesto',
      href: '#/presupuesto?service=rotulacion',
    },
    secondaryCta: {
      label: 'Ver proyectos',
      href: '#/portafolio',
    },
    localCoverage: [...localSeoContent.rotulacion.localCoverage],
  }
}

export const rotulacionSeoContent: CatalogSeoContent[] = rotulacionEntries.map(createRotulacionContent)
