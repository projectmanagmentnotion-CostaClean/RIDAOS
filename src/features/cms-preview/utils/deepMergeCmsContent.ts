function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function deepMergeCmsContent<T>(fallback: T, override: unknown): T {
  if (override === undefined) {
    return fallback
  }

  if (Array.isArray(fallback)) {
    return (Array.isArray(override) ? override : fallback) as T
  }

  if (isPlainObject(fallback)) {
    if (!isPlainObject(override)) {
      return fallback
    }

    const result: Record<string, unknown> = { ...fallback }
    for (const [key, fallbackValue] of Object.entries(fallback)) {
      result[key] = deepMergeCmsContent(fallbackValue, override[key])
    }

    for (const [key, overrideValue] of Object.entries(override)) {
      if (!(key in result) && overrideValue !== undefined) {
        result[key] = overrideValue
      }
    }

    return result as T
  }

  if (typeof fallback === 'string') {
    return (typeof override === 'string' ? override : fallback) as T
  }

  if (typeof fallback === 'number') {
    return (typeof override === 'number' && Number.isFinite(override) ? override : fallback) as T
  }

  if (typeof fallback === 'boolean') {
    return (typeof override === 'boolean' ? override : fallback) as T
  }

  return (override ?? fallback) as T
}
