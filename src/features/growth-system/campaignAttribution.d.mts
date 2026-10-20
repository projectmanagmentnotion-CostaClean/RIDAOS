export function getCampaignQuoteHref(
  campaign: { slug: string; quoteHref: string },
  pageSearch: string,
  pageHash: string,
): string

export function getCampaignProductHref(
  campaign: { slug: string; productHref: string },
  pageSearch: string,
  pageHash: string,
): string

export function carryCampaignAttribution(
  href: string,
  pageSearch: string,
  pageHash: string,
  fallbackCampaign?: string,
): string
