export function normalizeHashRoute(route) {
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

  return getHashRouteFromLocation(window.location)
}

export function getHashRouteFromLocation(location) {
  if (location.hash && location.hash !== '#') {
    return normalizeHashRoute(location.hash)
  }

  return normalizeHashRoute(location.pathname || '/')
}

export function navigateToHashRoute(route) {
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
