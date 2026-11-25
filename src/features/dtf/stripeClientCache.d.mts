export function createStripeClientCache<Client>(): (
  publishableKey: string,
  createClient: (publishableKey: string) => Client | Promise<Client>,
) => Promise<Client>
