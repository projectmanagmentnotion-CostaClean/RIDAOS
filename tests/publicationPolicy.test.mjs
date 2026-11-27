import test from 'node:test'
import assert from 'node:assert/strict'
import {
  PUBLICATION_PRODUCT_CODES,
  PUBLICATION_PRODUCT_BY_ROUTE,
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
  assert.equal(isPublicationRouteAllowed('#/admin/production', policy), true)
    assert.equal(resolvePublicationRoute('home', policy), 'dtf')
  }
})

test('the exact protected QA Preview applies DTI-only fail-closed rules', () => {
  const preview = resolvePublicationPolicy('ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app')

  assert.equal(preview.isPublicLaunch, true)
  assert.equal(preview.dtiOnlyMode, true)
  assert.equal(isPublicationRouteAllowed('#/producto/dti-por-metro', preview), true)
  assert.equal(isPublicationRouteAllowed('#/producto/textil-personalizado', preview), false)
  assert.equal(isPublicationRouteAllowed('#/presupuesto?service=rotulacion', preview), false)
  assert.equal(isPublicationRouteAllowed('#/mi-cuenta/archivos', preview), false)
  assert.equal(isPublicationRouteAllowed('#/admin', preview), false)
  assert.equal(isPublicationRouteAllowed('#/admin/production', preview), true)
  assert.equal(resolvePublicationRoute('adminProduction', preview), 'adminProduction')
  assert.equal(isPublicationRouteAllowed('#/admin/orders', preview), false)
})

test('DTI-only publication preserves cart and support routes while hiding general catalog', () => {
  const policy = resolvePublicationPolicy(publicHost, { dti_only_mode: true, published_product_codes: allProducts })

  assert.equal(isPublicationRouteAllowed('#/carrito', policy), true)
  assert.equal(isPublicationRouteAllowed('#/checkout', policy), true)
  assert.equal(isPublicationRouteAllowed('#/upload', policy), true)
  assert.equal(isPublicationRouteAllowed('#/guia', policy), true)
  assert.equal(isPublicationRouteAllowed('#/ayuda', policy), true)
  assert.equal(isPublicationRouteAllowed('#/contacto', policy), true)
  assert.equal(isPublicationRouteAllowed('#/legal', policy), true)
  for (const route of ['#/mi-cuenta', '#/mi-cuenta/pedidos', '#/mi-cuenta/pedidos/demo']) {
    assert.equal(isPublicationRouteAllowed(route, policy), true, `customer tracking route should remain: ${route}`)
    assert.equal(isPublicationRouteAllowed(`${route}?utm_source=direct`, policy), true)
  }
  assert.equal(isPublicationRouteAllowed('#/mi-cuenta/archivos', policy), false)
  assert.equal(isPublicationRouteAllowed('#/presupuesto?service=rotulacion', policy), false)
  assert.equal(isPublicationRouteAllowed('#/catalogo', policy), false)
  assert.equal(isPublicationRouteAllowed('#/catalogo/flyers', policy), false)
  for (const [route, productCode] of Object.entries(PUBLICATION_PRODUCT_BY_ROUTE)) {
    assert.equal(isPublicationRouteAllowed(route, policy), productCode === 'dti-innuro', `DTI-only route policy: ${route}`)
  }
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
  assert.equal(isPublicationRouteAllowed('#/portafolio', full), true)
  assert.equal(isPublicationRouteAllowed('#/product-configurator', full), true)
  for (const route of ['#/', '#/carrito', '#/checkout', '#/upload', '#/guia', '#/ayuda', '#/contacto', '#/legal', '#/presupuesto', '#/mi-cuenta', '#/mi-cuenta/pedidos', '#/mi-cuenta/pedidos/demo', '#/mi-cuenta/archivos']) {
    assert.equal(isPublicationRouteAllowed(route, full), true, `public utility route should remain: ${route}`)
  }
  for (const route of Object.keys(PUBLICATION_PRODUCT_BY_ROUTE)) {
    assert.equal(isPublicationRouteAllowed(route, full), true, `route should return with full catalog: ${route}`)
  }
  assert.equal(resolvePublicationRoute('home', full), 'home')
})
