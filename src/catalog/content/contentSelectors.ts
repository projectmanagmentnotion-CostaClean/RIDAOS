import { catalogEntries } from '../registry/catalogRegistry'
import { catalogContentEntries } from './contentRegistry'
import type { FaqItem, ObjectionHandler } from './types'

function normalizeHash(hash: string) {
  if (!hash || hash === '#') {
    return '#/'
  }

  return hash
}

export function getContentByEntryId(entryId: string) {
  return catalogContentEntries.find((entry) => entry.entryId === entryId) ?? null
}

export function getContentBySlug(slug: string) {
  return catalogContentEntries.find((entry) => entry.slug === slug) ?? null
}

export function getSeoForRoute(routeHash: string) {
  const normalizedHash = normalizeHash(routeHash)
  const [pathOnly] = normalizedHash.split('?')

  const exactEntry = catalogEntries.find((entry) => entry.route === normalizedHash)
  if (exactEntry) {
    return getContentByEntryId(exactEntry.id)
  }

  const pathEntry = catalogEntries.find((entry) => entry.route.split('?')[0] === pathOnly)
  if (pathEntry) {
    return getContentByEntryId(pathEntry.id)
  }

  const query = normalizedHash.includes('?') ? normalizedHash.slice(normalizedHash.indexOf('?') + 1) : ''
  if (pathOnly === '#/presupuesto' && query) {
    const params = new URLSearchParams(query)
    const service = params.get('service')

    if (service) {
      const fromCategory = catalogEntries.find((entry) => entry.category === service)
      if (fromCategory) {
        return getContentByEntryId(fromCategory.id)
      }

      const fromServiceKey = catalogEntries.find((entry) => {
        if (entry.cta.type !== 'request_quote') {
          return false
        }

        return entry.cta.serviceKey === service
      })

      if (fromServiceKey) {
        return getContentByEntryId(fromServiceKey.id)
      }
    }
  }

  return null
}

export function getFaqForEntry(entryId: string): FaqItem[] {
  return getContentByEntryId(entryId)?.faq ?? []
}

export function getUploadGuidanceForEntry(entryId: string): string[] {
  return getContentByEntryId(entryId)?.uploadGuidance ?? []
}

export function getObjectionHandlersForEntry(entryId: string): ObjectionHandler[] {
  return getContentByEntryId(entryId)?.objectionHandlers ?? []
}
