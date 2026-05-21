import type { AdminDeliveryMethod, AdminDeliveryWindow, AdminPackingStatus } from '../../../admin/types/adminModels'

export const deliveryMethodLabels: Record<AdminDeliveryMethod, string> = {
  pickup: 'Recogida en taller',
  local_delivery: 'Entrega local',
  courier: 'Mensajeria',
  own_route: 'Ruta propia',
}

export const packingStatusLabels: Record<AdminPackingStatus, string> = {
  not_packed: 'Sin embalar',
  packing: 'En embalaje',
  packed: 'Embalado',
  handoff_ready: 'Listo para handoff',
}

export const deliveryWindowLabels: Record<AdminDeliveryWindow, string> = {
  '09-13': '09:00 - 13:00',
  '13-17': '13:00 - 17:00',
  '17-20': '17:00 - 20:00',
}

export const carrierCatalog = [
  { id: 'pickup-desk', label: 'Desk pickup', method: 'pickup' as const },
  { id: 'local-rider', label: 'Rider local', method: 'local_delivery' as const },
  { id: 'courier-mock', label: 'Courier mock', method: 'courier' as const },
  { id: 'own-route-van', label: 'Ruta propia', method: 'own_route' as const },
]

export const deliveryMessageTemplates = {
  pickup_ready: 'Tu pedido {orderId} esta listo para recoger hoy en taller. Contacto: {contact}.',
  shipped: 'Tu pedido {orderId} ha salido. Tracking mock: {tracking}. Ventana: {window}.',
  incident: 'Tu pedido {orderId} tiene una incidencia operativa. El equipo revisa el siguiente paso.',
  delayed: 'Tu pedido {orderId} necesita una replanificacion de entrega. Nueva ventana propuesta: {window}.',
  delivered: 'Tu pedido {orderId} figura como entregado. Gracias por confiar en RidaosPrint.',
}
