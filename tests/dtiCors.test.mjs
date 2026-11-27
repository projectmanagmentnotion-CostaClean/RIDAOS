import test from 'node:test'
import assert from 'node:assert/strict'
import { dtiCorsHeaders, dtiCorsOriginsForProject } from '../supabase/functions/_shared/dtiCommerce.mjs'

const origins = 'http://localhost:5173,https://ridaos-nyx2ke2te-projectmanagmentnotion-costacleans-projects.vercel.app,https://ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app'

test('DTI CORS reflects only an exact configured localhost or preview origin', () => {
  for (const origin of origins.split(',')) {
    const headers = dtiCorsHeaders(new Request('https://qa.supabase.co/functions/v1/dti-orders', { headers: { origin } }), origins, 'content-type', 'POST, OPTIONS')
    assert.equal(headers.get('access-control-allow-origin'), origin)
    assert.equal(headers.get('vary'), 'Origin')
  }
})

test('DTI CORS rejects wildcard, lookalike, unrelated and opaque origins', () => {
  const configured = `${origins},*.vercel.app,https://ridaos-nyx2ke2te-projectmanagmentnotion-costacleans-projects.vercel.app/path`
  for (const origin of ['https://evil.vercel.app', 'https://evil.vercel.app.attacker.test', 'https://ridaos-nyx2ke2te-projectmanagmentnotion-costacleans-projects.vercel.app.attacker.test', 'null']) {
    const headers = dtiCorsHeaders(new Request('https://qa.supabase.co/functions/v1/dti-orders', { headers: { origin } }), configured, 'content-type', 'POST, OPTIONS')
    assert.equal(headers.has('access-control-allow-origin'), false)
  }
})

test('DTI CORS omits origin for absent or malformed configured values', () => {
  const noOrigin = dtiCorsHeaders(new Request('https://qa.supabase.co/functions/v1/dti-orders'), origins, 'content-type', 'POST, OPTIONS')
  const malformed = dtiCorsHeaders(new Request('https://qa.supabase.co/functions/v1/dti-orders', { headers: { origin: 'http://localhost:5173' } }), 'http://localhost:5173/path,https://user:pass@example.test', 'content-type', 'POST, OPTIONS')
  assert.equal(noOrigin.has('access-control-allow-origin'), false)
  assert.equal(malformed.has('access-control-allow-origin'), false)
})

test('QA order and artwork functions add only the exact protected preview origin', () => {
  const configured = 'http://localhost:5173'
  const qaOrigins = dtiCorsOriginsForProject(configured, 'https://uzldkpnenmfjfwqfkhre.supabase.co')
  const qaAllowed = dtiCorsHeaders(new Request('https://qa.supabase.co/functions/v1/dti-orders', { headers: { origin: 'https://ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app' } }), qaOrigins, 'content-type', 'POST, OPTIONS')
  assert.equal(qaAllowed.get('access-control-allow-origin'), 'https://ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app')
  assert.equal(qaOrigins.includes('*.vercel.app'), false)

  const productionOrigins = dtiCorsOriginsForProject(configured, 'https://production-ref.supabase.co')
  const productionDenied = dtiCorsHeaders(new Request('https://prod.supabase.co/functions/v1/dti-orders', { headers: { origin: 'https://ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app' } }), productionOrigins, 'content-type', 'POST, OPTIONS')
  assert.equal(productionOrigins, configured)
  assert.equal(productionDenied.has('access-control-allow-origin'), false)
})
