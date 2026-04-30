export function normalizeMotionToken(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]/g, '')
    .toLowerCase()
}

export function splitTextLines(text?: string, lines?: string[]) {
  if (lines && lines.length > 0) {
    return lines
  }

  return text ? [text] : []
}

export function splitTextWords(line: string) {
  return line.split(/\s+/).filter(Boolean)
}

export function wordHasSticker(word: string, stickerWords: string[]) {
  const normalizedWord = normalizeMotionToken(word)
  return stickerWords.some((candidate) => normalizeMotionToken(candidate) === normalizedWord)
}
