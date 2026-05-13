export function formatCatalogCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
}

export function formatRangeLabel(min: number, max: number) {
  return `${min} EUR - ${max} EUR`
}
