import { conversionBlocks } from './conversionRegistry'

export function getConversionByEntryId(entryId: string) {
  return conversionBlocks.find((entry) => entry.entryId === entryId) ?? null
}
