import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createStripeClientCache } from '../src/features/dtf/stripeClientCache.mjs'

const componentSource = await readFile(new URL('../src/features/dtf/DtiStripePayment.tsx', import.meta.url), 'utf8')

test('Stripe client cache shares one instance for Payment Element creation and confirmation', async () => {
  const getOrCreateStripe = createStripeClientCache()
  const stripeClient = { id: 'one-test-stripe-instance' }
  let createCount = 0
  const createClient = () => {
    createCount += 1
    return stripeClient
  }

  const elementsStripe = await getOrCreateStripe('pk_test_checkout', createClient)
  const confirmStripe = await getOrCreateStripe('pk_test_checkout', createClient)

  assert.equal(elementsStripe, confirmStripe)
  assert.equal(createCount, 1)
  assert.match(componentSource, /const getOrCreateStripeClient = createStripeClientCache<StripeClient>\(\)/)
  assert.match(componentSource, /stripeRef\.current = stripe/)
  assert.match(componentSource, /stripe\.confirmPayment\(\{ elements,/)
  assert.doesNotMatch(componentSource, /const stripe = await getStripe\(\)\s*\n\s*const result = await stripe\.confirmPayment/)
})

test('Stripe client cache separates keys and retries a rejected load', async () => {
  const getOrCreateStripe = createStripeClientCache()
  const clients = new Map()
  const createClient = (key) => {
    const client = { key }
    clients.set(key, client)
    return client
  }

  assert.equal(await getOrCreateStripe('pk_test_a', createClient), clients.get('pk_test_a'))
  assert.equal(await getOrCreateStripe('pk_test_b', createClient), clients.get('pk_test_b'))
  assert.notEqual(clients.get('pk_test_a'), clients.get('pk_test_b'))

  let attempts = 0
  await assert.rejects(getOrCreateStripe('pk_test_retry', () => {
    attempts += 1
    throw new Error('temporary Stripe.js failure')
  }), /temporary Stripe.js failure/)
  const recoveredClient = { key: 'pk_test_retry' }
  assert.equal(await getOrCreateStripe('pk_test_retry', () => {
    attempts += 1
    return recoveredClient
  }), recoveredClient)
  assert.equal(attempts, 2)
})
