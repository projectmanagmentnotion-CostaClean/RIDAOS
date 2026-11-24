import { dtfEntry } from '../../products/dtf'
import type { CatalogSeoContent } from '../types'

export const dtfSeoContent: CatalogSeoContent = {
  entryId: dtfEntry.id,
  slug: dtfEntry.slug,
  seoTitle: 'DTI Innuro por metro | DTF textil Barcelona | RidaosPrint',
  metaDescription: 'DTI Innuro por metro a 15 €/m IVA incluido y 55 cm de ancho útil. DTF por metro en Barcelona con revisión del archivo y envío peninsular.',
  ogImage: '/assets/seo/og-dti.jpg',
  h1: 'DTI Innuro por metro.',
  eyebrow: 'DTI Innuro para transfer textil · Barcelona',
  intro:
    'Configura el metraje, carga el archivo y revisa el precio antes de añadirlo al carrito. DTI Innuro es el producto real; DTF es el término de búsqueda habitual.',
  benefits: [
    'Precio por metro visible desde el inicio.',
    'PNG y PDF con comprobación inicial; AI, PSD, SVG y CDR pasan a revisión manual.',
    'Adaptación profesional presupuestada y aprobada antes de cualquier pago.',
  ],
  useCases: [
    'Tiradas DTI para textil propio o de cliente.',
    'Reposiciones textiles con precio claro por metro y ancho útil de 55 cm.',
    'Pedidos que requieren una validacion tecnica antes de fabricar.',
  ],
  uploadGuidance: [
    'Sube PNG o PDF para comprobación inicial; AI, PSD, SVG y CDR pasan a revisión manual.',
    'Incluye notas si necesitas color, prioridad o una referencia concreta de produccion.',
    'La revisión final del archivo se realiza antes de fabricar o cobrar.',
  ],
  faq: [
    {
      question: 'Que diferencia hay entre DTI y DTF',
      answer: 'DTI Innuro es el producto que fabricamos y vendemos. DTF es el término de búsqueda habitual para este tipo de transfer textil.',
    },
    {
      question: 'Hace falta archivo para pedir DTI por metro',
      answer: 'Sí. PNG y PDF pasan una comprobación inicial; AI, PSD, SVG y CDR requieren revisión manual antes de producir.',
    },
    {
      question: 'Se fabrica al instante',
      answer: 'No. El tiempo de preparación depende del metraje; el transporte se suma por separado.',
    },
  ],
  objectionHandlers: [
    {
      title: 'No tengo claro si el archivo esta listo',
      response: 'PNG y PDF reciben una comprobación inicial; AI, PSD, SVG y CDR se revisan manualmente antes de producir.',
    },
    {
      title: 'Necesito rapidez pero sin perder control',
      response: 'La adaptación profesional cuesta 35 €/hora + IVA. Aprobamos el presupuesto antes de cualquier pago.',
    },
  ],
  primaryCta: {
    label: 'Anadir al carrito',
  },
  secondaryCta: {
    label: 'Preparar pedido',
  },
}
