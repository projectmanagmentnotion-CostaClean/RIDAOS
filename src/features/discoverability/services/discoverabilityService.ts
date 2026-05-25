import { discoverabilityHubs } from '../hubs/discoverabilityHubs'
import { localServiceHubs } from '../local/localServiceHubs'
import { frequentlyCombinedBundles, upsellRules } from '../recommendations/upsellRules'
import { relatedServicesByKey } from '../related/relatedServices'

export function getDiscoverabilityHubById(id: string) {
  return discoverabilityHubs.find((hub) => hub.id === id) ?? null
}

export function getUpsellRuleByTrigger(trigger: string) {
  return upsellRules.find((rule) => rule.trigger === trigger) ?? null
}

export function getRelatedServicesByKey(key: string) {
  return relatedServicesByKey[key] ?? []
}

export function getLocalServiceHubs() {
  return localServiceHubs
}

export function getFrequentlyCombinedBundles() {
  return frequentlyCombinedBundles
}
