import { getQuoteHref, publicRoutes } from '../../lib/navigation'
import { growthCampaignContent } from './campaignContent'

export type GrowthCampaign = {
  slug: string
  title: string
  description: string
  eyebrow: string
  benefits: readonly string[]
  productHref: string
  quoteHref: string
}

const destinations = {
  'rotulacion-vehiculos': { productHref: publicRoutes.productoRotulacion, quoteHref: getQuoteHref('rotulacion') },
  'dtf-por-metro': { productHref: publicRoutes.dtf, quoteHref: getQuoteHref('textil') },
  'textil-personalizado': { productHref: publicRoutes.productoTextil, quoteHref: getQuoteHref('textil') },
  papeleria: { productHref: publicRoutes.productoTarjetas, quoteHref: getQuoteHref('papeleria') },
  promociones: { productHref: publicRoutes.catalogo, quoteHref: getQuoteHref() },
} satisfies Record<(typeof growthCampaignContent)[number]['slug'], { productHref: string; quoteHref: string }>

const campaigns: GrowthCampaign[] = growthCampaignContent.map((campaign) => ({
  ...campaign,
  ...destinations[campaign.slug],
}))

export function getGrowthCampaign(slug: string | undefined) {
  return campaigns.find((campaign) => campaign.slug === slug)
}

export function getGrowthCampaignFromHash(hash: string) {
  const normalizedRoute = hash.startsWith('#') ? hash : `#${hash}`
  const match = normalizedRoute.match(/^#\/growth\/([^/?#]+)\/?/)
  return getGrowthCampaign(match?.[1])
}

export function getGrowthCampaigns() {
  return campaigns
}
