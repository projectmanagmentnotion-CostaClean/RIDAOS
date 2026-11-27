import assert from 'node:assert/strict'
import test from 'node:test'
import { getSeoSiteOrigin } from '../src/lib/seoSiteOrigin.mjs'

const fallbackOrigin = 'https://ridaos.vercel.app'
const dtiOrigin = 'https://dti.ridaosprint.com'

test('DTI public domain and exact QA Preview canonicalize to the planned DTI subdomain', () => {
  assert.equal(getSeoSiteOrigin('dti.ridaosprint.com', fallbackOrigin), dtiOrigin)
  assert.equal(getSeoSiteOrigin('DTI.RIDAOSPRINT.COM.', fallbackOrigin), dtiOrigin)
  assert.equal(getSeoSiteOrigin('ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app', fallbackOrigin), dtiOrigin)
})

test('other hosts retain the existing e-commerce site origin', () => {
  for (const hostname of ['localhost', 'ridaos.vercel.app', 'ridaosprint.com', 'feature-branch.vercel.app', '']) {
    assert.equal(getSeoSiteOrigin(hostname, fallbackOrigin), fallbackOrigin, hostname)
  }
})
