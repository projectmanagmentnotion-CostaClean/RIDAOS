export const checkoutSteps = [
  { id: 'review', label: 'Revision' },
  { id: 'shipping', label: 'Envio mock' },
  { id: 'payment', label: 'Pago mock' },
  { id: 'success', label: 'Confirmacion' },
] as const

export const paymentMocks = [
  {
    id: 'bank-transfer',
    label: 'Transferencia guiada',
    description: 'La referencia de cobro se prepara despues de revisar el archivo.',
  },
  {
    id: 'bizum',
    label: 'Bizum comercial',
    description: 'Opcion rapida para cerrar pedidos pequenos tras validacion interna.',
  },
  {
    id: 'invoice',
    label: 'Factura proforma',
    description: 'Pensado para clientes recurrentes o pedidos con doble aprobacion.',
  },
] as const
