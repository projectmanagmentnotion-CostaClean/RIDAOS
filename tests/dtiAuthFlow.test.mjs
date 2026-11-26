import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildDtiAuthCallbackUrl,
  getSafeCallbackError,
  parseDtiAuthCallback,
} from '../src/admin/services/dtiAuthFlow.mjs'

test('builds an application-owned callback URL and requires HTTPS off localhost', () => {
  assert.equal(buildDtiAuthCallbackUrl('https://qa-preview.example'), 'https://qa-preview.example/auth/callback')
  assert.equal(buildDtiAuthCallbackUrl('http://localhost:5173'), 'http://localhost:5173/auth/callback')
  assert.throws(() => buildDtiAuthCallbackUrl('http://qa-preview.example'), /HTTPS/)
})

test('parses invitation and recovery callback data without accepting partial tokens', () => {
  const invite = parseDtiAuthCallback('#access_token=test-access&refresh_token=test-refresh&expires_at=2000000000&type=invite')
  assert.equal(invite.kind, 'invite')
  assert.equal(invite.accessToken, 'test-access')
  assert.equal(invite.refreshToken, 'test-refresh')
  assert.equal(invite.expiresAt, 2_000_000_000_000)

  const recovery = parseDtiAuthCallback('#access_token=test-access&refresh_token=test-refresh&type=recovery')
  assert.equal(recovery.kind, 'recovery')
  assert.ok(recovery.expiresAt > Date.now())
  assert.deepEqual(parseDtiAuthCallback('#access_token=partial'), { kind: 'invalid' })
  assert.equal(parseDtiAuthCallback('#/admin/production'), null)
})

test('maps callback errors to safe messages without echoing provider details', () => {
  assert.match(getSafeCallbackError('otp_expired'), /caducado/)
  assert.match(getSafeCallbackError('unknown-provider-detail'), /nuevo/)
})
