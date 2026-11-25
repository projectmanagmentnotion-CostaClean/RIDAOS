/**
 * Loads one Stripe.js client per publishable key and shares the in-flight
 * promise so concurrent checkout mounts cannot create competing instances.
 */
export function createStripeClientCache() {
  const clientsByKey = new Map()

  return function getOrCreateStripeClient(publishableKey, createClient) {
    const cachedClient = clientsByKey.get(publishableKey)
    if (cachedClient) return cachedClient

    const clientPromise = Promise.resolve()
      .then(() => createClient(publishableKey))
      .catch((error) => {
        if (clientsByKey.get(publishableKey) === clientPromise) {
          clientsByKey.delete(publishableKey)
        }
        throw error
      })

    clientsByKey.set(publishableKey, clientPromise)
    return clientPromise
  }
}
