import { getSeoForRoute } from '../catalog/content/contentSelectors'
import { catalogEntries } from '../catalog/registry/catalogRegistry'

type StaticSeoEntry = {
  title: string
  description: string
  ogType: 'website'
}

type OpenGraphData = {
  title: string
  description: string
  type: 'website'
  url: string
}

const staticRouteSEO: Record<string, StaticSeoEntry> = {
  '#/': {
    title: 'RidaosPrint | DTF por metro y produccion grafica',
    description: 'Base comercial de RidaosPrint para DTF, catalogo, materiales, servicios y propuestas a medida.',
    ogType: 'website',
  },
  '#/catalogo': {
    title: 'Catalogo | RidaosPrint',
    description: 'Catalogo modular con compra directa, presupuesto y lectura clara de cada linea de producto o servicio.',
    ogType: 'website',
  },
  '#/guia': {
    title: 'Guia de Archivos | RidaosPrint',
    description: 'Formatos, revision y checklist practico para preparar archivos antes de producir.',
    ogType: 'website',
  },
  '#/portafolio': {
    title: 'Portafolio | RidaosPrint',
    description: 'Trabajos de DTF, vinilo, rotulacion, stickers y gran formato con lectura visual del taller.',
    ogType: 'website',
  },
  '#/presupuesto': {
    title: 'Solicitar Presupuesto | RidaosPrint',
    description: 'Formulario de propuesta comercial para proyectos personalizados, servicios y gran formato.',
    ogType: 'website',
  },
  '#/contacto': {
    title: 'Contacto | RidaosPrint',
    description: 'Contacto directo para pedidos, consultas y proyectos que requieren propuesta comercial.',
    ogType: 'website',
  },
  '#/legal': {
    title: 'Legal y condiciones comerciales | RidaosPrint',
    description: 'Condiciones comerciales, revision tecnica y base legal visible para el flujo de compra o presupuesto.',
    ogType: 'website',
  },
}

const defaultSEO: StaticSeoEntry = {
  title: 'RidaosPrint',
  description: 'Produccion grafica con catalogo modular, configuracion y flujos preparados para crecer.',
  ogType: 'website',
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

function normalizeHash(hash: string) {
  if (!hash || hash === '#') {
    return '#/'
  }

  return hash
}

export function buildPageTitle(title?: string) {
  return title || defaultSEO.title
}

export function buildMetaDescription(description?: string) {
  return description || defaultSEO.description
}

export function buildOpenGraphData(data: {
  title?: string
  description?: string
  url: string
}): OpenGraphData {
  return {
    title: buildPageTitle(data.title),
    description: buildMetaDescription(data.description),
    type: 'website',
    url: data.url,
  }
}

export function buildJsonLdProductStub(entryId: string) {
  const entry = catalogEntries.find((item) => item.id === entryId)
  const content = getSeoForRoute(entry?.route ?? '')

  if (!entry || entry.kind !== 'product') {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: entry.name,
    description: content?.metaDescription ?? entry.description,
    category: entry.category,
    sku: entry.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: entry.basePrice ?? undefined,
      availability: 'https://schema.org/InStock',
      url: entry.route,
    },
  }
}

export function buildJsonLdServiceStub(entryId: string) {
  const entry = catalogEntries.find((item) => item.id === entryId)
  const content = getSeoForRoute(entry?.route ?? '')

  if (!entry || entry.kind !== 'service') {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: entry.name,
    description: content?.metaDescription ?? entry.description,
    serviceType: entry.category,
    areaServed: 'ES',
    url: entry.route,
  }
}

export function applySEO(routeHash: string) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return
  }

  const normalizedHash = normalizeHash(routeHash)
  const staticSeo = staticRouteSEO[normalizedHash.split('?')[0]] ?? defaultSEO
  const contentSeo = getSeoForRoute(normalizedHash)

  const title = buildPageTitle(contentSeo?.seoTitle ?? staticSeo.title)
  const description = buildMetaDescription(contentSeo?.metaDescription ?? staticSeo.description)
  const ogData = buildOpenGraphData({
    title,
    description,
    url: `${window.location.origin}${window.location.pathname}${window.location.search}${normalizedHash}`,
  })

  document.title = title

  const descriptionMeta = ensureMeta('meta[name="description"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    return meta
  })
  descriptionMeta.setAttribute('content', description)

  const ogTitle = ensureMeta('meta[property="og:title"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:title')
    return meta
  })
  ogTitle.setAttribute('content', ogData.title)

  const ogDescription = ensureMeta('meta[property="og:description"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:description')
    return meta
  })
  ogDescription.setAttribute('content', ogData.description)

  const ogType = ensureMeta('meta[property="og:type"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:type')
    return meta
  })
  ogType.setAttribute('content', ogData.type)

  const canonical = ensureMeta('link[rel="canonical"]', () => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    return link
  })
  canonical.setAttribute('href', ogData.url)

  const routeEntry = catalogEntries.find((entry) => entry.route === normalizedHash || entry.route.split('?')[0] === normalizedHash.split('?')[0])
  const jsonLd = routeEntry
    ? routeEntry.kind === 'product'
      ? buildJsonLdProductStub(routeEntry.id)
      : buildJsonLdServiceStub(routeEntry.id)
    : null

  const jsonLdScript = ensureMeta('script[data-ridaos-jsonld="true"]', () => {
    const script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.setAttribute('data-ridaos-jsonld', 'true')
    return script
  })
  jsonLdScript.textContent = jsonLd ? JSON.stringify(jsonLd) : ''
}
