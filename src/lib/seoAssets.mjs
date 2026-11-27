const DTI_ORIGIN = 'https://dti.ridaosprint.com'
const DTI_HOSTS = new Set([
  'dti.ridaosprint.com',
  'ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app',
])
const LEGACY_ORIGIN = 'https://ridaos.vercel.app'
const LEGACY_PATHS = [
  '/',
  '/catalogo',
  '/producto/dtf',
  '/producto/textil',
  '/producto/papeleria',
  '/producto/materiales',
  '/producto/accesorios',
  '/servicios/rotulacion',
  '/servicios/carteleria',
  '/servicios/neones',
  '/portafolio',
  '/guia',
  '/contacto',
  '/legal',
]

export function isDtiSeoHost(hostname) {
  return DTI_HOSTS.has(String(hostname ?? '').trim().toLowerCase().replace(/\.$/, ''))
}

function legacySitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${LEGACY_PATHS.map((path) => `  <url>\n    <loc>${LEGACY_ORIGIN}${path}</loc>\n  </url>`).join('\n')}\n</urlset>\n`
}

export function getRobotsTxtForHost(hostname) {
  const sitemapOrigin = isDtiSeoHost(hostname) ? DTI_ORIGIN : LEGACY_ORIGIN
  return `User-agent: *\nAllow: /\n\nDisallow: /admin\nDisallow: /mi-cuenta\nDisallow: /checkout\nDisallow: /carrito\n\nSitemap: ${sitemapOrigin}/sitemap.xml\n`
}

export function getSitemapXmlForHost(hostname) {
  if (!isDtiSeoHost(hostname)) return legacySitemap()

  const paths = ['/', '/producto/dti-por-metro']
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url>\n    <loc>${DTI_ORIGIN}${path}</loc>\n  </url>`).join('\n')}\n</urlset>\n`
}
