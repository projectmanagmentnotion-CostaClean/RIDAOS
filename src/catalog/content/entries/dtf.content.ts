import { dtfEntry } from '../../products/dtf'
import type { CatalogSeoContent } from '../types'

export const dtfSeoContent: CatalogSeoContent = {
  entryId: dtfEntry.id,
  slug: dtfEntry.slug,
  seoTitle: 'DTI por metro | Archivo, revision y urgencia clara | RidaosPrint',
  metaDescription: 'DTI por metro con precio mock por metraje, revision de archivo y urgencia clara antes del carrito. DTF como keyword secundaria.',
  ogImage: '/assets/seo/og-dti.jpg',
  h1: 'DTI por metro.',
  eyebrow: 'DTI por metro para produccion textil agil',
  intro:
    'Configura el metraje, carga el archivo y revisa el precio con un flujo claro antes de pasar al carrito. DTF queda como referencia SEO secundaria para quien llega con esa busqueda.',
  benefits: [
    'Precio por metro visible desde el inicio.',
    'Archivo, previsualizacion y checks en el mismo recorrido.',
    'Comprobacion tecnica antes de fabricar para evitar rehacer el pedido.',
  ],
  useCases: [
    'Tiradas DTI para textil propio o de cliente.',
    'Reposiciones rapidas que necesitan precio claro y subida de archivo.',
    'Pedidos que requieren una validacion tecnica antes de fabricar.',
  ],
  uploadGuidance: [
    'Sube PDF, AI, EPS, SVG, PNG, JPG, TIFF o ZIP cuando sea posible.',
    'Incluye notas si necesitas color, prioridad o una referencia concreta de produccion.',
    'La comprobacion final del archivo se realiza antes de fabricar.',
  ],
  faq: [
    {
      question: 'Que diferencia hay entre DTI y DTF',
      answer: 'En la web usamos DTI como naming comercial principal del producto por metro. DTF se mantiene como termino SEO secundario para capturar la busqueda habitual del mercado.',
    },
    {
      question: 'Hace falta archivo para pedir DTI por metro',
      answer: 'Si. El archivo activa la previsualizacion, el analisis previo y deja el pedido listo para confirmar.',
    },
    {
      question: 'Se fabrica al instante',
      answer: 'No. Antes se revisa el archivo para asegurar que el pedido entra correctamente en produccion.',
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
