import { getRobotsTxtForHost, getSitemapXmlForHost } from '../src/lib/seoAssets.mjs'

export default function handler(request, response) {
  const asset = Array.isArray(request.query?.asset) ? request.query.asset[0] : request.query?.asset
  const hostname = String(request.headers.host ?? '').split(':')[0]

  if (asset !== 'robots' && asset !== 'sitemap') {
    response.status(404).send('Not found')
    return
  }

  response
    .status(200)
    .setHeader('Content-Type', asset === 'robots' ? 'text/plain; charset=utf-8' : 'application/xml; charset=utf-8')
    .setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    .setHeader('Vary', 'Host')
    .send(asset === 'robots' ? getRobotsTxtForHost(hostname) : getSitemapXmlForHost(hostname))
}
