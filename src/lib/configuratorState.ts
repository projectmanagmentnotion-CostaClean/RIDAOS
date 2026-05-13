import type { CatalogEntry, ConfiguratorField } from '../types/product'

export type ConfigState = Record<string, string>

function getInitialFieldValue(entry: CatalogEntry, field: ConfiguratorField) {
  if (field.type === 'select' || field.type === 'variant' || field.type === 'size') {
    if ((field.key === 'product' || field.key === 'variant') && field.options.some((option) => option.value === entry.id)) {
      return entry.id
    }

    return field.options[0]?.value ?? ''
  }

  if (field.type === 'quantity') {
    return String(entry.tiers?.[0]?.min ?? field.min ?? '')
  }

  if (field.type === 'meters') {
    return String(field.min ?? 1)
  }

  if (field.type === 'area') {
    return String(field.min ?? 1)
  }

  return ''
}

export function createInitialConfig(entry: CatalogEntry): ConfigState {
  return entry.configuratorFields.reduce<ConfigState>((config, field) => {
    config[field.key] = getInitialFieldValue(entry, field)
    return config
  }, {})
}

export function updateConfigValue(config: ConfigState, key: string, value: string): ConfigState {
  return {
    ...config,
    [key]: value,
  }
}

export function getRequiredFieldErrors(entry: CatalogEntry, config: ConfigState) {
  const errors: Record<string, string> = {}

  for (const field of entry.configuratorFields) {
    if (!field.required) {
      continue
    }

    const value = config[field.key]?.trim()

    if (!value) {
      errors[field.key] = `Completa ${field.label.toLowerCase()}.`
    }
  }

  return errors
}

export function isUploadRequired(entry: CatalogEntry) {
  return entry.upload.required
}

export function getUploadField(entry: CatalogEntry) {
  return entry.configuratorFields.find((field) => field.type === 'file')
}
