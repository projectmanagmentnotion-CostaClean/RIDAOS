import { dtfEntry } from '../../products/dtf'
import type { CatalogSeoContent } from '../types'

export const dtfSeoContent: CatalogSeoContent = {
  entryId: dtfEntry.id,
  slug: dtfEntry.slug,
  seoTitle: 'DTF por metro | RidaosPrint',
  metaDescription: 'Configura DTF por metro, sube tu archivo y revisa el precio con un proceso claro y profesional.',
  h1: 'DTF por metro.',
  eyebrow: 'DTF por metro para pedidos agiles',
  intro:
    'Configura el metraje, sube el archivo y revisa el precio antes de confirmar el siguiente paso del pedido.',
  benefits: [
    'Precio base visible desde el inicio.',
    'Carga de archivo y previsualizacion dentro del flujo.',
    'Comprobaciones previas listas para confirmar el pedido con seguridad.',
  ],
  useCases: [
    'Tiradas DTF para textil propio o de cliente.',
    'Reposiciones rapidas sin rehacer el flujo comercial.',
    'Pedidos que necesitan revisar el archivo antes de fabricar.',
  ],
  uploadGuidance: [
    'Sube PDF, AI, EPS, SVG, PNG, JPG o ZIP cuando sea posible.',
    'Incluye notas si necesitas color, corte o prioridad especifica.',
    'La comprobacion final del archivo se realiza antes de fabricar.',
  ],
  faq: [
    {
      question: 'Como se calcula el precio',
      answer: 'Se toma el metraje base y se ajusta por calidad y urgencia.',
    },
    {
      question: 'Hace falta archivo',
      answer: 'Si. El archivo activa la previsualizacion y deja el pedido listo para confirmar.',
    },
    {
      question: 'Se fabrica al instante',
      answer: 'No. Antes se revisa el archivo para asegurar que el pedido entra correctamente.',
    },
  ],
  objectionHandlers: [
    {
      title: 'No tengo claro si el archivo esta listo',
      response: 'La carga queda registrada y el equipo revisa el archivo antes de fabricar.',
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
    label: 'Preparar pedido',
  },
}
