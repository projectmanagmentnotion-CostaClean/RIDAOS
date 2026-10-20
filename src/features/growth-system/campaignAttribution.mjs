const trackedParameters = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

/**
 * @param {string} href
 * @param {string} pageSearch
 * @param {string} pageHash
 * @param {string} [fallbackCampaign]
 */
export function carryCampaignAttribution(href, pageSearch, pageHash, fallbackCampaign) {
  const hashQuery = pageHash.includes('?') ? pageHash.slice(pageHash.indexOf('?') + 1) : ''
  const incoming = new URLSearchParams(`${pageSearch.replace(/^\?/, '')}&${hashQuery}`)
  const attribution = new URLSearchParams()

  for (const key of trackedParameters) {
    const value = incoming.get(key)
    if (value) attribution.set(key, value)
  }
  if (fallbackCampaign && !attribution.has('utm_campaign')) attribution.set('utm_campaign', fallbackCampaign)
  if (!attribution.size) return href

  const separator = href.includes('?') ? '&' : '?'
  return `${href}${separator}${attribution.toString()}`
}

/**
 * @param {{ slug: string, quoteHref: string }} campaign
 * @param {string} pageSearch
 * @param {string} pageHash
 */
export function getCampaignQuoteHref(campaign, pageSearch, pageHash) {
  return carryCampaignAttribution(campaign.quoteHref, pageSearch, pageHash, campaign.slug)
}

/** @param {{ slug: string, productHref: string }} campaign */
export function getCampaignProductHref(campaign, pageSearch, pageHash) {
  return carryCampaignAttribution(campaign.productHref, pageSearch, pageHash, campaign.slug)
}
