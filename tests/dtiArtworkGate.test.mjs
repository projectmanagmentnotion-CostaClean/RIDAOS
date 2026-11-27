import assert from 'node:assert/strict'
import test from 'node:test'
import { dtiArtworkCanEnterCart, dtiArtworkFileWasAccepted, dtiOrderCanRetryArtwork } from '../src/features/dtf/dtiArtworkGate.mjs'

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

test('DTI artwork retry stays available only while the order accepts file changes', () => {
  assert.equal(dtiOrderCanRetryArtwork(undefined), true)
  assert.equal(dtiOrderCanRetryArtwork('awaiting_artwork'), true)
  assert.equal(dtiOrderCanRetryArtwork('awaiting_artwork_review'), true)
  assert.equal(dtiOrderCanRetryArtwork('awaiting_manual_timeline'), true)
  assert.equal(dtiOrderCanRetryArtwork('awaiting_payment'), false)
  assert.equal(dtiOrderCanRetryArtwork('paid_awaiting_technical_review'), false)
  assert.equal(dtiOrderCanRetryArtwork('queued_for_production'), false)
  assert.equal(dtiOrderCanRetryArtwork('cancelled'), false)
  assert.equal(dtiOrderCanRetryArtwork('unknown'), false)
})
