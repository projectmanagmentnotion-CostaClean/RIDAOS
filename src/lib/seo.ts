import { getSeoForRoute } from '../catalog/content/contentSelectors'
import { catalogEntries } from '../catalog/registry/catalogRegistry'
import { localSeoContent, siteUrl } from '../content/localSeoContent'
import { publicRoutes } from './navigation'

type StaticSeoEntry = {
  title: string
  description: string
  ogType: 'website'
  allowIndex?: boolean
  breadcrumb?: Array<{ name: string; path: string }>
}

type OpenGraphData = {
  title: string
  description: string
  type: 'website'
  url: string
}

type JsonLdRecord = Record<string, unknown>

const routePathMap = new Map<string, string>(
  Object.values(publicRoutes).map((route) => [route, route === '#/' ? '/' : route.replace(/^#/, '')]),
)

for (const entry of catalogEntries) {
  routePathMap.set(entry.route.split('?')[0], entry.route.split('?')[0].replace(/^#/, ''))
}

const staticRouteSEO: Record<string, StaticSeoEntry> = {
  '#/': {
    title: 'RidaosPrint | DTF, rotulacion e impresion personalizada',
    description:
      'DTF por metro, rotulacion de vehiculos, vinilos, escaparates e impresion personalizada con enfoque comercial y cobertura local.',
    ogType: 'website',
    allowIndex: true,
    breadcrumb: [{ name: 'Home', path: '/' }],
  },
  '#/catalogo': {
    title: 'Catalogo | RidaosPrint',
    description:
      'Catalogo modular con DTF, rotulacion, materiales, textil, papeleria y servicios preparados para compra o propuesta personalizada.',
    ogType: 'website',
    allowIndex: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Catalogo', path: '/catalogo' },
    ],
  },
  '#/guia': {
    title: 'Guia de archivos | RidaosPrint',
    description: 'Formatos, comprobaciones y checklist practico para preparar archivos antes de fabricar.',
    ogType: 'website',
    allowIndex: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Guia de archivos', path: '/guia' },
    ],
  },
  '#/portafolio': {
    title: 'Proyectos y portafolio | RidaosPrint',
    description: 'Casos de DTF, rotulacion, vinilo, stickers y gran formato con lectura clara de servicio y resultado.',
    ogType: 'website',
    allowIndex: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Portafolio', path: '/portafolio' },
    ],
  },
  '#/contacto': {
    title: 'Contacto | RidaosPrint',
    description:
      'Contacto directo para DTF, rotulacion de furgonetas, vinilos comerciales, impresion personalizada y proyectos a medida.',
    ogType: 'website',
    allowIndex: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Contacto', path: '/contacto' },
    ],
  },
  '#/legal': {
    title: 'Legal y condiciones comerciales | RidaosPrint',
    description: 'Condiciones comerciales, comprobacion tecnica y base legal visible para compra o propuesta.',
    ogType: 'website',
    allowIndex: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Legal', path: '/legal' },
    ],
  },
  '#/servicios/rotulacion': {
    title: 'Rotulacion de vehiculos y furgonetas | Barcelona, Blanes, Girona | RidaosPrint',
    description:
      'Rotulacion premium para furgonetas, vehiculos de empresa, flotas comerciales, escaparates y señaletica en Barcelona, Blanes, Girona y Costa Brava.',
    ogType: 'website',
    allowIndex: true,
    breadcrumb: [...localSeoContent.rotulacion.breadcrumbs],
  },
}

const defaultSEO: StaticSeoEntry = {
  title: 'RidaosPrint',
  description: 'Impresion profesional con catalogo modular, configuracion y flujos preparados para crecer.',
  ogType: 'website',
  allowIndex: true,
  breadcrumb: [{ name: 'Home', path: '/' }],
}

const noIndexPrefixes = ['#/admin', '#/mi-cuenta', '#/checkout', '#/carrito', '#/cursor-test', '#/motion-test']

function ensureElement<T extends HTMLElement>(selector: string, createTag: () => T) {
  const existing = document.head.querySelector<T>(selector)

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

function getPathOnlyHash(hash: string) {
  return normalizeHash(hash).split('?')[0]
}

function getCanonicalPath(hash: string) {
  const pathOnly = getPathOnlyHash(hash)
  return routePathMap.get(pathOnly) ?? (pathOnly === '#/' ? '/' : pathOnly.replace(/^#/, ''))
}

function buildAbsoluteUrl(hash: string) {
  return `${siteUrl}${getCanonicalPath(hash)}`
}

function shouldIndexRoute(hash: string) {
  const normalized = normalizeHash(hash)
  return !noIndexPrefixes.some((prefix) => normalized.startsWith(prefix))
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

function buildOrganizationSchema(): JsonLdRecord {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: localSeoContent.organization.name,
    legalName: localSeoContent.organization.legalName,
    url: siteUrl,
    description: localSeoContent.organization.description,
    email: localSeoContent.organization.email,
    telephone: localSeoContent.organization.telephone,
    areaServed: localSeoContent.organization.areaServed,
  }
}

function buildLocalBusinessSchema(): JsonLdRecord {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: localSeoContent.localBusiness.name,
    url: siteUrl,
    description: localSeoContent.localBusiness.description,
    priceRange: localSeoContent.localBusiness.priceRange,
    address: {
      '@type': 'PostalAddress',
      ...localSeoContent.localBusiness.address,
    },
    areaServed: localSeoContent.organization.areaServed,
  }
}

function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLdRecord {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}

function buildFaqSchema(
  items: Array<{ question: string; answer: string }>,
): JsonLdRecord | null {
  if (!items.length) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function buildJsonLdProductStub(entryId: string): JsonLdRecord | null {
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
    url: buildAbsoluteUrl(entry.route),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: entry.basePrice ?? undefined,
      availability: 'https://schema.org/InStock',
      url: buildAbsoluteUrl(entry.route),
    },
  }
}

export function buildJsonLdServiceStub(entryId: string): JsonLdRecord | null {
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
    areaServed:
      entry.category === 'rotulacion'
        ? localSeoContent.organization.areaServed
        : ['Espana'],
    url: buildAbsoluteUrl(entry.route),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: buildAbsoluteUrl(entry.route),
      description:
        entry.range
          ? `Servicio con rango orientativo desde ${entry.range.min} EUR hasta ${entry.range.max} EUR.`
          : 'Servicio sujeto a propuesta personalizada.',
    },
  }
}

function buildReviewSchemaPlaceholder(): JsonLdRecord[] {
  return []
}

export function applySEO(routeHash: string) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return
  }

  const normalizedHash = normalizeHash(routeHash)
  const pathOnly = getPathOnlyHash(normalizedHash)
  const staticSeo = staticRouteSEO[pathOnly] ?? defaultSEO
  const contentSeo = getSeoForRoute(normalizedHash)
  const canonicalUrl = buildAbsoluteUrl(normalizedHash)
  const title = buildPageTitle(contentSeo?.seoTitle ?? staticSeo.title)
  const description = buildMetaDescription(contentSeo?.metaDescription ?? staticSeo.description)
  const ogData = buildOpenGraphData({
    title,
    description,
    url: canonicalUrl,
  })

  document.title = title

  const descriptionMeta = ensureElement('meta[name="description"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    return meta
  })
  descriptionMeta.setAttribute('content', description)

  const robotsMeta = ensureElement('meta[name="robots"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'robots')
    return meta
  })
  robotsMeta.setAttribute('content', shouldIndexRoute(normalizedHash) && staticSeo.allowIndex !== false ? 'index,follow' : 'noindex,nofollow')

  const ogTitle = ensureElement('meta[property="og:title"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:title')
    return meta
  })
  ogTitle.setAttribute('content', ogData.title)

  const ogDescription = ensureElement('meta[property="og:description"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:description')
    return meta
  })
  ogDescription.setAttribute('content', ogData.description)

  const ogType = ensureElement('meta[property="og:type"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:type')
    return meta
  })
  ogType.setAttribute('content', ogData.type)

  const ogUrl = ensureElement('meta[property="og:url"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:url')
    return meta
  })
  ogUrl.setAttribute('content', ogData.url)

  const twitterCard = ensureElement('meta[name="twitter:card"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'twitter:card')
    return meta
  })
  twitterCard.setAttribute('content', 'summary_large_image')

  const twitterTitle = ensureElement('meta[name="twitter:title"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'twitter:title')
    return meta
  })
  twitterTitle.setAttribute('content', ogData.title)

  const twitterDescription = ensureElement('meta[name="twitter:description"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'twitter:description')
    return meta
  })
  twitterDescription.setAttribute('content', ogData.description)

  const canonical = ensureElement('link[rel="canonical"]', () => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    return link
  })
  canonical.setAttribute('href', canonicalUrl)

  const routeEntry = catalogEntries.find((entry) => entry.route === normalizedHash || entry.route.split('?')[0] === pathOnly)
  const schemas: JsonLdRecord[] = [
    buildOrganizationSchema(),
    buildLocalBusinessSchema(),
  ]

  if (staticSeo.breadcrumb?.length) {
    schemas.push(buildBreadcrumbSchema(staticSeo.breadcrumb))
  }

  if (routeEntry) {
    const routeSchema =
      routeEntry.kind === 'product'
        ? buildJsonLdProductStub(routeEntry.id)
        : buildJsonLdServiceStub(routeEntry.id)

    if (routeSchema) {
      schemas.push(routeSchema)
    }
  }

  const faqSchema = buildFaqSchema(contentSeo?.faq ?? [])
  if (faqSchema) {
    schemas.push(faqSchema)
  }

  schemas.push(...buildReviewSchemaPlaceholder())

  const jsonLdScript = ensureElement('script[data-ridaos-jsonld="true"]', () => {
    const script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.setAttribute('data-ridaos-jsonld', 'true')
    return script
  })
  jsonLdScript.textContent = JSON.stringify(schemas.filter(Boolean))
}
