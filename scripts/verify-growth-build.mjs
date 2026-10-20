import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const expectedSlugs = new Set([
  'rotulacion-vehiculos',
  'dtf-por-metro',
  'textil-personalizado',
  'papeleria',
  'promociones',
])
const growthDirectory = join(process.cwd(), 'dist', 'growth')
const generatedSlugs = new Set(await readdir(growthDirectory))

assert.deepEqual(generatedSlugs, expectedSlugs, 'Generated campaign routes must match the growth campaign registry.')

for (const slug of expectedSlugs) {
  const pagePath = join(growthDirectory, slug, 'index.html')
  const html = await readFile(pagePath, 'utf8')

  assert.match(html, /<html lang="es">/u, `${slug} should declare Spanish as its language.`)
  assert.match(html, /<title>[^<]+<\/title>/u, `${slug} should have a page title.`)
  assert.equal((html.match(/<title>/gu) ?? []).length, 1, `${slug} should have exactly one page title.`)
  assert.match(html, /<meta name="description" content="[^"]+"\s*\/>/u, `${slug} should have a description.`)
  assert.match(html, new RegExp(`<link rel="canonical" href="https://ridaos\\.vercel\\.app/growth/${slug}"\\s*/>`), `${slug} should use its clean canonical URL.`)
  assert.match(html, /<meta property="og:title" content="[^"]+"\s*\/>/u, `${slug} should expose a share title before JavaScript runs.`)
  assert.match(html, /<meta property="og:description" content="[^"]+"\s*\/>/u, `${slug} should expose a share description before JavaScript runs.`)
  assert.match(html, /<meta property="og:image" content="https:\/\/ridaos\.vercel\.app\/assets\/brand\/ridaos-logo-main\.png"\s*\/>/u, `${slug} should reference the existing brand image.`)
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"\s*\/>/u, `${slug} should expose a Twitter card type.`)
  assert.equal((html.match(/rel="canonical"/gu) ?? []).length, 1, `${slug} should have exactly one canonical link.`)

  const assetUrls = [...html.matchAll(/(?:src|href)="(\/assets\/[^"#]+)"/gu)].map((match) => match[1])
  assert.ok(assetUrls.length > 0, `${slug} should reference built assets.`)
  const ogImageUrl = html.match(/<meta property="og:image" content="https:\/\/ridaos\.vercel\.app(\/assets\/[^"#]+)"/u)?.[1]
  assert.ok(ogImageUrl, `${slug} should have a local social image path.`)
  await Promise.all([...assetUrls, ogImageUrl].map((assetUrl) => access(join(process.cwd(), 'dist', assetUrl.slice(1)))))
}

const vercelConfig = JSON.parse(await readFile(join(process.cwd(), 'vercel.json'), 'utf8'))
assert.ok(vercelConfig.rewrites.some((rewrite) => rewrite.source === '/growth/:slug' && rewrite.destination === '/growth/:slug/index.html'))
assert.ok(vercelConfig.rewrites.some((rewrite) => rewrite.source === '/growth/:slug/' && rewrite.destination === '/growth/:slug/index.html'))

console.log(`Verified ${expectedSlugs.size} static campaign pages, metadata, built assets, and Vercel route rewrites.`)
