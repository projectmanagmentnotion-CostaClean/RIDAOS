import type { OrderStatus } from '../../../types/backend'

export type MockLifecycleStep = {
  id: string
  label: string
  description: string
}

export const mockOrderLifecycleSteps: MockLifecycleStep[] = [
  {
    id: 'pending',
    label: 'Recibido',
    description: 'Solicitud recibida y lista para lectura interna.',
  },
  {
    id: 'reviewing-artwork',
    label: 'Revision de archivo',
    description: 'Archivo y configuracion en comprobacion tecnica.',
  },
  {
    id: 'production',
    label: 'Produccion',
    description: 'Produccion o acabados en curso.',
  },
  {
    id: 'shipped',
    label: 'En salida',
    description: 'Pedido listo o en proceso de entrega.',
  },
  {
    id: 'delivered',
    label: 'Entregado',
    description: 'Pedido cerrado para cliente.',
  },
]

export function getMockLifecycleIndex(status: OrderStatus) {
  if (status === 'pending_review' || status === 'needs_changes') return 1
  if (status === 'approved' || status === 'awaiting_payment' || status === 'paid') return 2
  if (status === 'in_production' || status === 'quality_check') return 3
  if (status === 'ready') return 4
  if (status === 'completed') return 5
  return 1
}

export function getMockLifecycleLabel(status: OrderStatus) {
  const index = Math.max(0, getMockLifecycleIndex(status) - 1)
  return mockOrderLifecycleSteps[index]?.label ?? 'Recibido'
}
