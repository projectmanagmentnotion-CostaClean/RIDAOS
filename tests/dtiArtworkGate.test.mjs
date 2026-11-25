import assert from 'node:assert/strict'
import test from 'node:test'
import { dtiArtworkCanEnterCart } from '../src/features/dtf/dtiArtworkGate.mjs'

const file = { name: 'qa-artwork.png' }

test('DTI artwork enters cart only after client acceptance or a design-help request', () => {
  assert.equal(dtiArtworkCanEnterCart(file, { clientAccepted: true }), true)
  assert.equal(dtiArtworkCanEnterCart(file, { designerHelpRequested: true }), true)
  assert.equal(dtiArtworkCanEnterCart(file, { clientAccepted: false, designerHelpRequested: false }), false)
  assert.equal(dtiArtworkCanEnterCart(null, { clientAccepted: true }), false)
  assert.equal(dtiArtworkCanEnterCart(file, null), false)
})
