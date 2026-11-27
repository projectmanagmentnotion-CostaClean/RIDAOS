export function normalizeHashRoute(route: string): string
export function getCurrentHashRoute(): string
export function getHashRouteFromLocation(location: { hash: string; pathname: string }): string
export function navigateToHashRoute(route: string): void
