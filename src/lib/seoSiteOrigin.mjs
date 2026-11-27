import { isDtiSeoHost } from './seoAssets.mjs'

const DTI_PUBLIC_ORIGIN = 'https://dti.ridaosprint.com'

export function getSeoSiteOrigin(hostname, fallbackOrigin) {
  return isDtiSeoHost(hostname) ? DTI_PUBLIC_ORIGIN : fallbackOrigin
}
