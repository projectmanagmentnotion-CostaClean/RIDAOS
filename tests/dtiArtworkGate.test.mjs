import assert from 'node:assert/strict'
import test from 'node:test'
import { dtiArtworkCanEnterCart, dtiArtworkFileWasAccepted } from '../src/features/dtf/dtiArtworkGate.mjs'

const file = { name: 'qa-artwork.png' }

test('DTI artwork enters cart only after client acceptance or a design-help request', () => {
  assert.equal(dtiArtworkCanEnterCart(file, { clientAccepted: true }), true)
  assert.equal(dtiArtworkCanEnterCart(file, { designerHelpRequested: true }), true)
  assert.equal(dtiArtworkCanEnterCart(file, { clientAccepted: false, designerHelpRequested: false }), false)
  assert.equal(dtiArtworkCanEnterCart(null, { clientAccepted: true }), false)
  assert.equal(dtiArtworkCanEnterCart(file, null), false)
})

test('DTI acceptance is bound to the selected File instance', () => {
  const replacement = { name: file.name }
  assert.equal(dtiArtworkFileWasAccepted(file, file), true)
  assert.equal(dtiArtworkFileWasAccepted(replacement, file), false)
  assert.equal(dtiArtworkFileWasAccepted(null, file), false)
})
