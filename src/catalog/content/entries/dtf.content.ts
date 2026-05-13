import { dtfEntry } from '../../products/dtf'
import type { CatalogSeoContent } from '../types'

export const dtfSeoContent: CatalogSeoContent = {
  entryId: dtfEntry.id,
  slug: dtfEntry.slug,
  seoTitle: 'DTF por metro | RidaosPrint',
  metaDescription: 'Configura DTF por metro, revisa archivo y avanza con una base clara de precio y revision tecnica.',
  h1: 'DTF por metro.',
  eyebrow: 'DTF por metro para produccion flexible',
  intro:
    'Configura el metraje, sube el archivo y revisa el precio antes de pasar a la siguiente fase del pedido.',
  benefits: [
    'Precio base visible desde el inicio.',
    'Carga de archivo y previsualizacion dentro del flujo.',
    'Checklist preparado para revision tecnica posterior.',
  ],
  useCases: [
    'Tiradas DTF para textil propio o de cliente.',
    'Reposiciones rapidas sin rehacer el flujo comercial.',
    'Pedidos que necesitan control de archivo antes de producir.',
  ],
  uploadGuidance: [
    'Sube PDF, AI, EPS, SVG, PNG, JPG o ZIP cuando sea posible.',
    'Incluye notas si necesitas color, corte o prioridad especifica.',
    'La validacion tecnica definitiva sigue realizandose antes de producir.',
  ],
  faq: [
    {
      question: 'Como se calcula el precio',
      answer: 'Se toma el metraje base y se ajusta por calidad y urgencia.',
    },
    {
      question: 'Hace falta archivo',
      answer: 'Si. El archivo activa la previsualizacion y el pedido queda listo para revision.',
    },
    {
      question: 'Se produce al instante',
      answer: 'No. El flujo sigue sujeto a revision tecnica y confirmacion interna.',
    },
  ],
  objectionHandlers: [
    {
      title: 'No tengo claro si el archivo esta listo',
      response: 'La carga queda registrada y el flujo contempla una revision antes de producir.',
    },
    {
      title: 'Necesito rapidez pero sin perder control',
      response: 'Puedes marcar urgencia y mantener una lectura clara del total antes de cerrar.',
    },
  ],
  primaryCta: {
    label: 'Anadir al carrito',
  },
  secondaryCta: {
    label: 'Simular pedido',
  },
}
