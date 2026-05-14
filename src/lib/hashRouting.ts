export function normalizeHashRoute(route: string) {
  const rawRoute = route.trim()

  if (!rawRoute || rawRoute === '#') {
    return '#/'
  }

  const hashIndex = rawRoute.indexOf('#')
  const hashRoute = hashIndex >= 0 ? rawRoute.slice(hashIndex) : rawRoute
  const withoutQuery = hashRoute.split('?')[0]

  if (!withoutQuery || withoutQuery === '#') {
    return '#/'
  }

  if (withoutQuery.startsWith('#/')) {
    return withoutQuery
  }

  if (withoutQuery.startsWith('/')) {
    return `#${withoutQuery}`
  }

  if (withoutQuery.startsWith('#')) {
    return `#/${withoutQuery.slice(1).replace(/^\/+/, '')}`
  }

  return `#/${withoutQuery.replace(/^\/+/, '')}`
}

export function getCurrentHashRoute() {
  if (typeof window === 'undefined') {
    return '#/'
  }

  return normalizeHashRoute(window.location.hash)
}

export function navigateToHashRoute(route: string) {
  if (typeof window === 'undefined') {
    return
  }

  const normalizedRoute = normalizeHashRoute(route)

  if (window.location.hash === normalizedRoute) {
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    return
  }

  window.location.hash = normalizedRoute
}
