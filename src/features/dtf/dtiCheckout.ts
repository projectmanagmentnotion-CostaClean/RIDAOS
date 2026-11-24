import type { CartItem } from '../../types/ecommerce'

const filesByCartItem = new Map<string, File>()
const env = import.meta.env as ImportMetaEnv & { VITE_DTI_SUPABASE_URL?: string; VITE_DTI_SUPABASE_ANON_KEY?: string; VITE_DTI_STRIPE_PUBLISHABLE_KEY?: string }

export function rememberDtiArtwork(itemId: string, file: File) { filesByCartItem.set(itemId, file) }
export function getDtiArtwork(itemId: string) { return filesByCartItem.get(itemId) }
export function forgetDtiArtwork(itemId: string) { filesByCartItem.delete(itemId) }
export function isDtiCart(items: CartItem[]) { return items.some((item) => item.productType === 'dtf') }
export function hasOnlyOneDtiLine(items: CartItem[]) { return items.length === 1 && items[0].productType === 'dtf' && (items[0].lineQuantity ?? 1) === 1 }
export function dtiBackendConfigured() { return Boolean(env.VITE_DTI_SUPABASE_URL && env.VITE_DTI_SUPABASE_ANON_KEY) }

function getSessionValue(name: string, size = 32) {
  const existing = sessionStorage.getItem(name)
  if (existing) return existing
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  const value = btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
  sessionStorage.setItem(name, value)
  return value
}

export async function callDtiFunction<T>(name: string, body: Record<string, unknown>, options: { method?: 'GET' | 'POST'; idempotencyKey?: string; orderToken?: string; recoveryKey?: string; file?: File; orderId?: string } = {}): Promise<T> {
  if (!dtiBackendConfigured()) throw new Error('DTI backend de pruebas no configurado.')
  const base = env.VITE_DTI_SUPABASE_URL!.replace(/\/$/, '')
  const headers = new Headers({ apikey: env.VITE_DTI_SUPABASE_ANON_KEY! })
  if (options.file) {
    const form = new FormData()
    form.set('orderId', options.orderId ?? '')
    form.set('file', options.file)
    if (options.idempotencyKey) headers.set('idempotency-key', options.idempotencyKey)
    if (options.orderToken) headers.set('x-dti-order-token', options.orderToken)
    const response = await fetch(`${base}/functions/v1/${name}`, { method: 'POST', headers, body: form })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error ?? 'No se pudo subir el archivo.')
    return result as T
  }
  const method = options.method ?? 'POST'
  if (method === 'GET') {
    const query = new URLSearchParams(body as Record<string, string>)
    if (options.orderToken) headers.set('x-dti-order-token', options.orderToken)
    const response = await fetch(`${base}/functions/v1/${name}?${query}`, { headers })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error ?? 'No se pudo consultar el pedido.')
    return result as T
  }
  headers.set('content-type', 'application/json')
  if (options.idempotencyKey) headers.set('idempotency-key', options.idempotencyKey)
  if (options.orderToken) headers.set('x-dti-order-token', options.orderToken)
  if (options.recoveryKey) headers.set('x-dti-recovery-key', options.recoveryKey)
  const response = await fetch(`${base}/functions/v1/${name}`, { method, headers, body: JSON.stringify(body) })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? 'No se pudo completar el pedido.')
  return result as T
}

export function dtiIdempotencyKey(orderId: string) { return getSessionValue(`dti-upload:${orderId}`, 18) }
export function dtiOrderKey() { return getSessionValue('dti-order-key', 18) }
export function dtiRecoveryKey() { return getSessionValue('dti-recovery-key') }
export function finishDtiOrderAttempt() { sessionStorage.removeItem('dti-order-key') }
