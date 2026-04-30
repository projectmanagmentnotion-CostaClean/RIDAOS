export type SEOKey =
  | 'home'
  | 'catalogo'
  | 'producto-dtf'
  | 'guia'
  | 'portafolio'
  | 'presupuesto'
  | 'contacto'
  | 'legal'

type SEOEntry = {
  title: string
  description: string
  ogType: 'website'
}

const defaultSEO: SEOEntry = {
  title: 'RidaosPrint',
  description: 'Produccion grafica con catalogo, DTF por metro y flujos frontend listos para crecer.',
  ogType: 'website',
}

export const pageSEO: Record<SEOKey, SEOEntry> = {
  home: {
    title: 'RidaosPrint | DTF por metro',
    description: 'Base clara para configurar DTF por metro, revisar archivos y avanzar a pedido.',
    ogType: 'website',
  },
  catalogo: {
    title: 'Catalogo | RidaosPrint',
    description: 'Catalogo base con DTF por metro, servicios a medida y accesos directos.',
    ogType: 'website',
  },
  'producto-dtf': {
    title: 'DTF por metro | RidaosPrint',
    description: 'Configura metraje, archivo y urgencia con resumen de precio en vivo.',
    ogType: 'website',
  },
  guia: {
    title: 'Guia de Archivos | RidaosPrint',
    description: 'Formatos, resolucion y checklist practico para preparar artes finales.',
    ogType: 'website',
  },
  portafolio: {
    title: 'Portafolio | RidaosPrint',
    description: 'Muestra visual de trabajos en rotulacion, textil, vinilos y gran formato.',
    ogType: 'website',
  },
  presupuesto: {
    title: 'Solicitar Presupuesto | RidaosPrint',
    description: 'Envia una solicitud base para proyectos personalizados y servicios a medida.',
    ogType: 'website',
  },
  contacto: {
    title: 'Contacto | RidaosPrint',
    description: 'Canales directos para consultas, pedidos y propuestas personalizadas.',
    ogType: 'website',
  },
  legal: {
    title: 'Legal y Confianza | RidaosPrint',
    description: 'Base legal, revision tecnica y estructura de confianza pendiente de validacion final.',
    ogType: 'website',
  },
}

function ensureMeta(selector: string, createTag: () => HTMLElement) {
  const existing = document.head.querySelector<HTMLElement>(selector)

  if (existing) {
    return existing
  }

  const element = createTag()
  document.head.appendChild(element)
  return element
}

export function applySEO(key: SEOKey) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return
  }

  const entry = pageSEO[key] ?? defaultSEO
  document.title = entry.title

  const description = ensureMeta('meta[name="description"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    return meta
  })
  description.setAttribute('content', entry.description)

  const ogTitle = ensureMeta('meta[property="og:title"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:title')
    return meta
  })
  ogTitle.setAttribute('content', entry.title)

  const ogDescription = ensureMeta('meta[property="og:description"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:description')
    return meta
  })
  ogDescription.setAttribute('content', entry.description)

  const ogType = ensureMeta('meta[property="og:type"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:type')
    return meta
  })
  ogType.setAttribute('content', entry.ogType)

  const canonical = ensureMeta('link[rel="canonical"]', () => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    return link
  })
  canonical.setAttribute(
    'href',
    `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash || '#/'}`,
  )
}
