import { carteleriaEntries } from '../../services/carteleria'
import type { CatalogSeoContent } from '../types'

export const carteleriaSeoContent: CatalogSeoContent[] = carteleriaEntries.map((entry) => ({
  entryId: entry.id,
  slug: entry.slug,
  seoTitle: `${entry.name} | RidaosPrint`,
  metaDescription: `${entry.name} para gran formato con medidas, acabados y presupuesto sujeto a comprobacion comercial.`,
  h1: entry.name,
  eyebrow: 'Carteleria y gran formato',
  intro: `${entry.name} preparada para recoger medidas, acabados y contexto antes de generar una propuesta comercial seria.`,
  benefits: [
    'Entrada clara para proyectos que dependen de medidas y confeccion.',
    'Soporte a archivo y resumen del proyecto desde la primera toma.',
    'Proceso comercial alineado con comprobacion tecnica y tiempos sujetos a confirmacion.',
  ],
  useCases: [
    'Lonas promocionales y piezas de exterior.',
    'Carteleria de gran formato con acabados variables.',
    'Proyectos que dependen de instalacion o medida real.',
  ],
  uploadGuidance: [
    'Adjunta referencia si ya cuentas con arte final o boceto.',
    'Indica ancho, alto y confeccion si ya estan definidos.',
    'La propuesta final se ajusta tras revisar material, uso y acabado.',
  ],
  faq: [
    {
      question: 'Puedo comprarlo directo',
      answer: 'No. Este tipo de pieza depende de medidas y acabados, por eso va a propuesta.',
    },
    {
      question: 'Sirve sin archivo',
      answer: 'Si. El formulario admite contexto escrito para arrancar la estimacion comercial.',
    },
  ],
  objectionHandlers: [
    {
      title: 'No tengo todas las medidas cerradas',
      response: 'Puedes dejar una base y completar el proyecto durante la propuesta comercial.',
    },
    {
      title: 'Necesito saber si entra en gran formato complejo',
      response: 'La pagina ya marca este flujo como proyecto de presupuesto, no de compra directa.',
    },
  ],
  primaryCta: {
    label: 'Solicitar presupuesto',
    href: '#/presupuesto?service=carteleria',
  },
  secondaryCta: {
    label: 'Ir al formulario',
    href: '#/presupuesto?service=carteleria',
  },
}))
