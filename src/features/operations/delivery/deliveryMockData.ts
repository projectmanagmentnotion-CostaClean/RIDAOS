export const dispatchStatusColumns = [
  { key: 'packing', label: 'Packing queue' },
  { key: 'ready_for_pickup', label: 'Ready for pickup' },
  { key: 'delivery_queue', label: 'Delivery queue' },
  { key: 'incidents', label: 'Incidencias' },
] as const

export const mockDeliveryWindows = ['09-13', '13-17', '17-20'] as const
