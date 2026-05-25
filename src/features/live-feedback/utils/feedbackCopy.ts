export function getConfigFeedbackLabel(key: string) {
  const normalizedKey = key.toLowerCase()

  if (normalizedKey.includes('acabado') || normalizedKey.includes('finish')) {
    return 'Acabado actualizado'
  }

  if (normalizedKey.includes('material') || normalizedKey.includes('papel')) {
    return 'Material actualizado'
  }

  if (normalizedKey.includes('cantidad') || normalizedKey.includes('quantity') || normalizedKey.includes('metros')) {
    return 'Precio recalculado'
  }

  if (normalizedKey.includes('urgencia')) {
    return 'Prioridad actualizada'
  }

  return 'Configuracion actualizada'
}
