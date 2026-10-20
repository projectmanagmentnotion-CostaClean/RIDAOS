import { createHmac, timingSafeEqual } from 'node:crypto'

/** Return the Meta GET challenge only when the configured token matches. */
export function getMetaWebhookChallenge({ mode, verifyToken, expectedToken, challenge }) {
  if (mode !== 'subscribe' || !challenge || !safeEqual(verifyToken, expectedToken)) return null
  return challenge
}

/** Verify X-Hub-Signature-256 against the exact raw request body. Server use only. */
export function verifyMetaWebhookSignature(rawBody, signatureHeader, appSecret) {
  if (!(typeof rawBody === 'string' || rawBody instanceof Uint8Array)) return false
  if (typeof appSecret !== 'string' || appSecret.length === 0) return false
  if (typeof signatureHeader !== 'string') return false

  const match = /^sha256=([a-f0-9]{64})$/i.exec(signatureHeader)
  if (!match) return false

  const supplied = Buffer.from(match[1], 'hex')
  const expected = createHmac('sha256', appSecret).update(rawBody).digest()
  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
}

function safeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length === 0 || right.length === 0) return false
  const leftBytes = Buffer.from(left)
  const rightBytes = Buffer.from(right)
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes)
}
