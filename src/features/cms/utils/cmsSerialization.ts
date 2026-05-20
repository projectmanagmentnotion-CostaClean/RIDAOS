export function cloneCmsPayload<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function stringifyCmsPayload(value: unknown) {
  return JSON.stringify(value, null, 2)
}
