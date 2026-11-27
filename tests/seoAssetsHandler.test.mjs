import assert from 'node:assert/strict'
import test from 'node:test'
import handler from '../api/seo-assets.js'

function invokeHandler({ asset, host }) {
  const response = {
    headers: {},
    statusCode: 200,
    status(code) { this.statusCode = code; return this },
    setHeader(name, value) { this.headers[name] = value; return this },
    send(body) { this.body = body; return this },
  }
  handler({ query: { asset }, headers: { host } }, response)
  return response
}

test('Vercel SEO asset handler responds by exact host and asset type', () => {
  const dti = invokeHandler({ asset: 'sitemap', host: 'ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app' })
  assert.equal(dti.statusCode, 200)
  assert.equal(dti.headers['Content-Type'], 'application/xml; charset=utf-8')
  assert.match(dti.body, /dti\.ridaosprint\.com\/producto\/dti-por-metro/)

  const legacy = invokeHandler({ asset: 'sitemap', host: 'ridaos.vercel.app' })
  assert.match(legacy.body, /ridaos\.vercel\.app\/servicios\/rotulacion/)
  assert.doesNotMatch(legacy.body, /dti\.ridaosprint\.com/)

  const robots = invokeHandler({ asset: 'robots', host: 'dti.ridaosprint.com' })
  assert.equal(robots.headers['Content-Type'], 'text/plain; charset=utf-8')
  assert.match(robots.body, /Sitemap: https:\/\/dti\.ridaosprint\.com\/sitemap\.xml/)
})

test('Vercel SEO asset handler rejects unrecognized asset requests', () => {
  const result = invokeHandler({ asset: 'unexpected', host: 'ridaos.vercel.app' })
  assert.equal(result.statusCode, 404)
  assert.equal(result.body, 'Not found')
})
