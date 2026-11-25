import test from 'node:test'
import assert from 'node:assert/strict'
import {
  PUBLICATION_PRODUCT_CODES,
  isFullCatalogPublished,
  isPublicationRouteAllowed,
  isPublicLaunchHost,
  resolvePublicationPolicy,
  resolvePublicationRoute,
  shouldUseDtiLanding,
} from '../src/config/publicationPolicy.mjs'

const publicHost = 'dti.ridaosprint.com'
const allProducts = [...PUBLICATION_PRODUCT_CODES]

test('private preview and localhost retain the complete storefront', () => {
  const local = resolvePublicationPolicy('localhost', null)
  const preview = resolvePublicationPolicy('ridaos-branch-preview.vercel.app', null)

  assert.equal(local.isPublicLaunch, false)
  assert.equal(preview.isPublicLaunch, false)
  assert.equal(resolvePublicationPolicy('ridaos.vercel.app').isPublicLaunch, false)
  assert.equal(resolvePublicationPolicy('ridaosprint.com').isPublicLaunch, false)
  assert.equal(isPublicationRouteAllowed('#/catalogo/textil', preview), true)
  assert.equal(resolvePublicationRoute('home', preview), 'home')
})

test('an exact public host fails closed to DTI when config is missing or invalid', () => {
  assert.equal(isPublicLaunchHost(publicHost), true)
  const missing = resolvePublicationPolicy(publicHost)
  const invalid = resolvePublicationPolicy(publicHost, { dti_only_mode: 'false', published_product_codes: allProducts })

  for (const policy of [missing, invalid]) {
    assert.equal(policy.dtiOnlyMode, true)
    assert.equal(isPublicationRouteAllowed('#/producto/dti-por-metro', policy), true)
    assert.equal(isPublicationRouteAllowed('#/producto/textil-personalizado', policy), false)
    assert.equal(isPublicationRouteAllowed('#/admin', policy), false)
    assert.equal(resolvePublicationRoute('home', policy), 'dtf')
  }
})

test('DTI-only publication preserves cart and support routes while hiding general catalog', () => {
  const policy = resolvePublicationPolicy(publicHost, { dti_only_mode: true, published_product_codes: allProducts })

  assert.equal(isPublicationRouteAllowed('#/carrito', policy), true)
  assert.equal(isPublicationRouteAllowed('#/checkout', policy), true)
  assert.equal(isPublicationRouteAllowed('#/contacto', policy), true)
  assert.equal(isPublicationRouteAllowed('#/catalogo', policy), false)
  assert.equal(isPublicationRouteAllowed('#/catalogo/flyers', policy), false)
})

test('partial rollout always keeps DTI as landing and enables only explicitly published products', () => {
  const policy = resolvePublicationPolicy(publicHost, { dti_only_mode: false, published_product_codes: ['textil', 'invalid'] })

  assert.equal(shouldUseDtiLanding(policy), true)
  assert.equal(isPublicationRouteAllowed('#/producto/dti-por-metro', policy), true)
  assert.equal(isPublicationRouteAllowed('#/dtf', policy), true)
  assert.equal(isPublicationRouteAllowed('#/producto/textil-personalizado', policy), true)
  assert.equal(isPublicationRouteAllowed('#/textil', policy), true)
  assert.equal(isPublicationRouteAllowed('#/producto/flyers-personalizados', policy), false)
  assert.equal(isPublicationRouteAllowed('#/catalogo', policy), false)
})

test('the full catalog is available only when every known product is published', () => {
  const partial = resolvePublicationPolicy(publicHost, { dti_only_mode: false, published_product_codes: ['textil'] })
  const full = resolvePublicationPolicy(publicHost, { dti_only_mode: false, published_product_codes: allProducts })

  assert.equal(isFullCatalogPublished(partial), false)
  assert.equal(isFullCatalogPublished(full), true)
  assert.equal(shouldUseDtiLanding(full), false)
  assert.equal(isPublicationRouteAllowed('#/catalogo', full), true)
  assert.equal(resolvePublicationRoute('home', full), 'home')
})
