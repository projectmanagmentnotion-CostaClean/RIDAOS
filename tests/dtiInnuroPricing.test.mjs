import assert from 'node:assert/strict'
import test from 'node:test'
import {
  calculateDtiAdaptationRate,
  calculateDtiInnuroPrice,
  getDtiCutoffStatus,
  getDtiPreparationPlan,
} from '../src/config/pricing/dtiInnuroPricing.mjs'
import { calculateCartGrossTotals } from '../src/features/cart/utils/cartGrossTotals.mjs'
import { getCartShippingMethods, resolveCartShippingMethod } from '../src/features/cart/utils/cartShipping.mjs'

test('DTI price is 15 EUR per meter with VAT included and a one-meter minimum', () => {
  assert.deepEqual(calculateDtiInnuroPrice(1), {
    meters: 1,
    valid: true,
    unitPrice: 15,
    net: 12.4,
    vatIncluded: 2.6,
    total: 15,
  })
  assert.equal(calculateDtiInnuroPrice(2.5).total, 37.5)
  assert.equal(calculateDtiInnuroPrice(0.9).valid, false)
})

test('adaptation rate is 35 EUR per hour plus 21 percent VAT', () => {
  assert.deepEqual(calculateDtiAdaptationRate(2), { hours: 2, net: 70, vat: 14.7, total: 84.7 })
})

test('preparation lead times change at 5 and 10 meter boundaries', () => {
  assert.equal(getDtiPreparationPlan(5).label, '48 horas laborables')
  assert.equal(getDtiPreparationPlan(5.1).label, '3 días laborables')
  assert.equal(getDtiPreparationPlan(10).label, '3 días laborables')
  assert.equal(getDtiPreparationPlan(10.1).label, 'Plazo bajo consulta')
})

test('18:30 cutoff follows Europe/Madrid local time across daylight saving', () => {
  assert.equal(getDtiCutoffStatus(new Date('2026-01-15T17:29:00Z')).afterCutoff, false)
  assert.equal(getDtiCutoffStatus(new Date('2026-01-15T17:30:00Z')).afterCutoff, true)
  assert.equal(getDtiCutoffStatus(new Date('2026-07-15T16:30:00Z')).afterCutoff, true)
})

test('cart keeps DTI and peninsular delivery prices gross with VAT included', () => {
  const totals = calculateCartGrossTotals(
    [{ pricing: { total: 15, vatIncluded: true } }],
    { price: 5, vatIncluded: true },
    0,
  )

  assert.deepEqual(totals, { subtotal: 15, taxes: 3.47, total: 20 })
})

test('cart still adds VAT to legacy exclusive items without charging VAT twice on delivery', () => {
  const totals = calculateCartGrossTotals(
    [{ pricing: { total: 100 } }],
    { price: 5, vatIncluded: true },
    0,
  )

  assert.deepEqual(totals, { subtotal: 100, taxes: 21.87, total: 126 })
})

test('DTI Innuro shipping is 5 EUR gross while existing catalog shipping options stay intact', () => {
  const dtiMethods = getCartShippingMethods([{ productName: 'DTI Innuro por metro' }])
  const otherMethods = getCartShippingMethods([{ productName: 'Vinilo por metro' }])

  assert.deepEqual(dtiMethods.map(({ id }) => id), ['pickup', 'standard'])
  assert.equal(resolveCartShippingMethod('standard', [{ productName: 'DTI Innuro por metro' }]).price, 5)
  assert.deepEqual(otherMethods.map(({ id, price }) => [id, price]), [
    ['pickup', 0],
    ['standard', 6.9],
    ['express', 14.9],
  ])
  assert.equal(resolveCartShippingMethod('express', [{ productName: 'DTI Innuro por metro' }]).id, 'standard')
})

test('mixed baskets keep DTI shipping inclusive and preserve the other catalog shipping rate', () => {
  const items = [
    { productName: 'DTI Innuro por metro', pricing: { total: 15, vatIncluded: true } },
    { productName: 'Vinilo por metro', pricing: { total: 100 } },
  ]
  const shipping = resolveCartShippingMethod('standard', items)
  const totals = calculateCartGrossTotals(items, shipping, 0)

  assert.equal(shipping.price, 11.9)
  assert.equal(shipping.includedPrice, 5)
  assert.equal(shipping.taxablePrice, 6.9)
  assert.deepEqual(totals, { subtotal: 115, taxes: 25.92, total: 149.35 })
  assert.equal(resolveCartShippingMethod('express', items).price, 19.9)
})
