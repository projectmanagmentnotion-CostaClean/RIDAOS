import assert from 'node:assert/strict'
import test from 'node:test'
import { getDtiArtworkAcceptanceError, isValidDtiDeliveryAddress, validateCheckoutContact } from '../src/features/cart/utils/checkoutValidation.mjs'

test('checkout requires customer name, valid email, and phone', () => {
  assert.deepEqual(validateCheckoutContact({ name: '', email: '', phone: '' }), {
    name: 'Introduce el nombre del cliente.',
    email: 'Introduce un email de contacto.',
    phone: 'Introduce un telefono de contacto.',
  })
  assert.deepEqual(validateCheckoutContact({ name: 'Ada Lovelace', email: 'ada@example.test', phone: '+34 600 000 000' }), {})
  assert.equal(validateCheckoutContact({ name: 'Ada', email: 'invalid', phone: '1' }).email, 'Introduce un email válido.')
})

test('DTI delivery requires street, municipality, province and a five-digit postal code', () => {
  assert.equal(isValidDtiDeliveryAddress({ line1: '', city: '', province: '', postalCode: '' }), false)
  assert.equal(isValidDtiDeliveryAddress({ line1: 'Carrer d’Aragó 423', city: 'Barcelona', province: 'Barcelona', postalCode: '08013' }), true)
  assert.equal(isValidDtiDeliveryAddress({ line1: 'Carrer d’Aragó 423', city: 'Barcelona', province: 'Barcelona', postalCode: '8013' }), false)
})

test('DTI test-order submission requires explicit client artwork acceptance', () => {
  assert.match(getDtiArtworkAcceptanceError(false), /Confirma que el archivo/)
  assert.equal(getDtiArtworkAcceptanceError(true), '')
})
