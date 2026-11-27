import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import test from 'node:test'

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
const rewrites = new Map(config.rewrites.map(({ source, destination }) => [source, destination]))

test('SEO asset rewrite sources are backed by the dynamic Vercel function, not public files', () => {
  assert.equal(rewrites.get('/robots.txt'), '/api/seo-assets?asset=robots')
  assert.equal(rewrites.get('/sitemap.xml'), '/api/seo-assets?asset=sitemap')
  assert.equal(existsSync(new URL('../public/robots.txt', import.meta.url)), false)
  assert.equal(existsSync(new URL('../public/sitemap.xml', import.meta.url)), false)
})

test('canonical and legacy route families plus commerce routes reach the SPA entrypoint', () => {
  for (const [route, expected] of [
    ['/catalogo', '/index.html'],
    ['/catalogo/:path*', '/index.html'],
    ['/producto/:path*', '/index.html'],
    ['/servicios/:path*', '/index.html'],
    ['/portafolio', '/index.html'],
    ['/portafolio', '/index.html'],
    ['/guia', '/index.html'],
    ['/contacto', '/index.html'],
    ['/legal', '/index.html'],
    ['/upload', '/index.html'],
    ['/carrito', '/index.html'],
    ['/checkout', '/index.html'],
    ['/ayuda', '/index.html'],
    ['/presupuesto', '/index.html'],
    ['/admin', '/index.html'],
    ['/admin/:path*', '/index.html'],
    ['/mi-cuenta', '/index.html'],
    ['/mi-cuenta/:path*', '/index.html'],
  ]) {
    assert.equal(rewrites.get(route), expected, route)
  }
})
