export const checkoutSteps = [
  { id: 'review', label: 'Revision' },
  { id: 'shipping', label: 'Entrega' },
  { id: 'payment', label: 'Confirmacion' },
  { id: 'success', label: 'Confirmacion' },
] as const

export const paymentMocks = [
  {
    id: 'request-only',
    label: 'Solicitud local · sin pago',
    description: 'Esta versión de prueba no envía el pedido ni cobra. El pago se habilitará después de revisar archivo y presupuesto.',
  },
] as const

