type PathSegment = string | number

export function updateValueAtPath<T>(value: T, path: PathSegment[], nextValue: unknown): T {
  if (path.length === 0) {
    return nextValue as T
  }

  const [head, ...tail] = path

  if (Array.isArray(value)) {
    const nextArray = [...value]
    nextArray[Number(head)] = updateValueAtPath(nextArray[Number(head)], tail, nextValue)
    return nextArray as T
  }

  const nextObject = { ...(value as Record<string, unknown>) }
  nextObject[String(head)] = updateValueAtPath(nextObject[String(head)], tail, nextValue)
  return nextObject as T
}
