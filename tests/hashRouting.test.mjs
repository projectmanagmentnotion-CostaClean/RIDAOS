import assert from 'node:assert/strict'
import test from 'node:test'
import { getHashRouteFromLocation } from '../src/lib/hashRouting.mjs'

test('direct pathname URLs enter the hash router without replacing the current route', () => {
  assert.equal(getHashRouteFromLocation({ hash: '', pathname: '/producto/dti-por-metro' }), '#/producto/dti-por-metro')
  assert.equal(getHashRouteFromLocation({ hash: '', pathname: '/catalogo' }), '#/catalogo')
})

test('an explicit hash route remains the source of truth', () => {
  assert.equal(getHashRouteFromLocation({ hash: '#/checkout?coupon=QA', pathname: '/' }), '#/checkout')
  assert.equal(getHashRouteFromLocation({ hash: '#', pathname: '/' }), '#/')
})
