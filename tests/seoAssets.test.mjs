import assert from 'node:assert/strict'
import test from 'node:test'
import { getRobotsTxtForHost, getSitemapXmlForHost, isDtiSeoHost } from '../src/lib/seoAssets.mjs'

const previewHost = 'ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app'

test('DTI hosts receive a DTI-only sitemap and DTI canonical sitemap reference', () => {
  for (const host of [previewHost, 'dti.ridaosprint.com']) {
    assert.equal(isDtiSeoHost(host), true)
    assert.match(getRobotsTxtForHost(host), /Sitemap: https:\/\/dti\.ridaosprint\.com\/sitemap\.xml/)
    const sitemap = getSitemapXmlForHost(host)
    assert.match(sitemap, /https:\/\/dti\.ridaosprint\.com\//)
    assert.match(sitemap, /https:\/\/dti\.ridaosprint\.com\/producto\/dti-por-metro/)
    assert.doesNotMatch(sitemap, /\/catalogo|\/producto\/dtf|\/servicios\//)
  }
})

test('all other hosts preserve the full existing ecommerce sitemap', () => {
  for (const host of ['localhost', 'ridaos.vercel.app', 'feature-branch.vercel.app', '']) {
    assert.equal(isDtiSeoHost(host), false)
    const robots = getRobotsTxtForHost(host)
    assert.match(robots, /Sitemap: https:\/\/ridaos\.vercel\.app\/sitemap\.xml/)
    const sitemap = getSitemapXmlForHost(host)
    assert.match(sitemap, /https:\/\/ridaos\.vercel\.app\/catalogo/)
    assert.match(sitemap, /https:\/\/ridaos\.vercel\.app\/producto\/papeleria/)
    assert.match(sitemap, /https:\/\/ridaos\.vercel\.app\/servicios\/rotulacion/)
  }
})
