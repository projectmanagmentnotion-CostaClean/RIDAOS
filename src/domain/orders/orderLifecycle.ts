import type { OrderLifecycleStatus } from './order-status.types'

export type OrderLifecycleDescriptor = {
  status: OrderLifecycleStatus
  label: string
  publicLabel: string
  adminLabel: string
  customerExplanation: string
  adminExplanation: string
  nextAction: {
    customer: string
    admin: string
  }
  allowedTransitions: OrderLifecycleStatus[]
}

export const orderLifecycle: Record<OrderLifecycleStatus, OrderLifecycleDescriptor> = {
  draft: {
    status: 'draft',
    label: 'Borrador',
    publicLabel: 'Borrador',
    adminLabel: 'Borrador interno',
    customerExplanation: 'El pedido aun no se ha enviado y puede completarse o descartarse.',
    adminExplanation: 'Pedido aun no formalizado. No debe entrar en revisiones ni produccion.',
    nextAction: {
      customer: 'Completar los datos y enviar el pedido.',
      admin: 'No actuar hasta que el pedido se confirme.',
    },
    allowedTransitions: ['pending_review', 'cancelled'],
  },
  pending_review: {
    status: 'pending_review',
    label: 'Pendiente de revision',
    publicLabel: 'Pendiente de revision',
    adminLabel: 'Entrada pendiente',
    customerExplanation: 'Hemos recibido el pedido y estamos preparando la comprobacion inicial.',
    adminExplanation: 'Validar que el pedido tiene datos comerciales minimos y material asociado.',
    nextAction: {
      customer: 'Esperar la confirmacion del equipo.',
      admin: 'Registrar archivos y pasar a recepcion de arte.',
    },
    allowedTransitions: ['artwork_received', 'needs_changes', 'cancelled'],
  },
  artwork_received: {
    status: 'artwork_received',
    label: 'Arte recibido',
    publicLabel: 'Archivo recibido',
    adminLabel: 'Arte recibido',
    customerExplanation: 'El archivo ya esta vinculado y queda listo para comprobacion tecnica.',
    adminExplanation: 'Confirmar integridad del archivo y enviarlo a preflight.',
    nextAction: {
      customer: 'Esperar la comprobacion tecnica.',
      admin: 'Abrir comprobacion tecnica del archivo.',
    },
    allowedTransitions: ['artwork_checking', 'needs_changes', 'cancelled'],
  },
  artwork_checking: {
    status: 'artwork_checking',
    label: 'Comprobacion tecnica',
    publicLabel: 'Comprobacion tecnica',
    adminLabel: 'Preflight en curso',
    customerExplanation: 'Estamos revisando formato, resolucion y preparacion del archivo.',
    adminExplanation: 'Revisar medidas, perfiles, margenes y viabilidad de fabricacion.',
    nextAction: {
      customer: 'Responder si el equipo solicita ajustes.',
      admin: 'Aprobar arte o marcar cambios necesarios.',
    },
    allowedTransitions: ['artwork_approved', 'needs_changes', 'cancelled'],
  },
  artwork_approved: {
    status: 'artwork_approved',
    label: 'Arte aprobado',
    publicLabel: 'Archivo aprobado',
    adminLabel: 'Arte validado',
    customerExplanation: 'El archivo esta listo y ya puede pasar al siguiente paso comercial o productivo.',
    adminExplanation: 'Arte validado. Confirmar cobro o lanzamiento segun el flujo del pedido.',
    nextAction: {
      customer: 'Revisar pago o confirmacion final si aplica.',
      admin: 'Solicitar pago o lanzar el pedido.',
    },
    allowedTransitions: ['awaiting_payment', 'paid', 'queued_for_production', 'cancelled'],
  },
  needs_changes: {
    status: 'needs_changes',
    label: 'Cambios necesarios',
    publicLabel: 'Cambios necesarios',
    adminLabel: 'Correcciones pendientes',
    customerExplanation: 'Necesitamos una nueva version o una correccion antes de seguir.',
    adminExplanation: 'El pedido queda bloqueado hasta recibir una version corregida o una aclaracion.',
    nextAction: {
      customer: 'Subir una nueva version del archivo o responder al comentario.',
      admin: 'Documentar claramente la incidencia y esperar nueva version.',
    },
    allowedTransitions: ['artwork_received', 'artwork_checking', 'cancelled'],
  },
  awaiting_payment: {
    status: 'awaiting_payment',
    label: 'Pendiente de pago',
    publicLabel: 'Pendiente de pago',
    adminLabel: 'Cobro pendiente',
    customerExplanation: 'El pedido esta aprobado y queda pendiente de pago para avanzar.',
    adminExplanation: 'No debe entrar en cola de fabricacion hasta confirmar el cobro.',
    nextAction: {
      customer: 'Completar el pago para desbloquear la produccion.',
      admin: 'Hacer seguimiento del cobro y registrar confirmacion.',
    },
    allowedTransitions: ['paid', 'cancelled'],
  },
  paid: {
    status: 'paid',
    label: 'Pagado',
    publicLabel: 'Pagado',
    adminLabel: 'Cobro confirmado',
    customerExplanation: 'El pago esta confirmado y el pedido puede entrar en fabricacion.',
    adminExplanation: 'Cobro confirmado. Preparar paso a cola de produccion.',
    nextAction: {
      customer: 'Esperar la entrada en produccion.',
      admin: 'Mover a cola de produccion.',
    },
    allowedTransitions: ['queued_for_production', 'in_production', 'cancelled'],
  },
  queued_for_production: {
    status: 'queued_for_production',
    label: 'En cola de fabricacion',
    publicLabel: 'En cola de fabricacion',
    adminLabel: 'Cola de produccion',
    customerExplanation: 'El pedido esta planificado y espera hueco de fabricacion.',
    adminExplanation: 'Pedido preparado para produccion. Pendiente de capacidad o material.',
    nextAction: {
      customer: 'Esperar confirmacion de inicio.',
      admin: 'Asignar ventana de produccion.',
    },
    allowedTransitions: ['in_production', 'cancelled'],
  },
  in_production: {
    status: 'in_production',
    label: 'En fabricacion',
    publicLabel: 'En fabricacion',
    adminLabel: 'Fabricacion activa',
    customerExplanation: 'El pedido ya esta en proceso de fabricacion.',
    adminExplanation: 'Pedido en maquinas o acabado. Mantener trazabilidad interna.',
    nextAction: {
      customer: 'Esperar actualizacion final.',
      admin: 'Registrar avances y preparar control de calidad.',
    },
    allowedTransitions: ['quality_check', 'ready_for_pickup', 'shipped', 'cancelled'],
  },
  quality_check: {
    status: 'quality_check',
    label: 'Control de calidad',
    publicLabel: 'Control de calidad',
    adminLabel: 'QA final',
    customerExplanation: 'Estamos revisando el resultado antes de marcar el pedido como listo.',
    adminExplanation: 'Comprobar acabado, medidas y contenido antes de entrega.',
    nextAction: {
      customer: 'Esperar aviso de disponibilidad.',
      admin: 'Cerrar QA y definir salida.',
    },
    allowedTransitions: ['ready_for_pickup', 'shipped', 'needs_changes', 'cancelled'],
  },
  ready_for_pickup: {
    status: 'ready_for_pickup',
    label: 'Listo para recogida',
    publicLabel: 'Listo para recogida',
    adminLabel: 'Listo para salida',
    customerExplanation: 'El pedido esta listo para recogida o preparacion de envio.',
    adminExplanation: 'Pedido terminado. Coordinar recogida o expedicion.',
    nextAction: {
      customer: 'Coordinar recogida o esperar expedicion.',
      admin: 'Avisar al cliente o preparar etiqueta de envio.',
    },
    allowedTransitions: ['shipped', 'delivered', 'cancelled'],
  },
  shipped: {
    status: 'shipped',
    label: 'Enviado',
    publicLabel: 'Enviado',
    adminLabel: 'Expedido',
    customerExplanation: 'El pedido ya ha salido y va en camino.',
    adminExplanation: 'Pedido expedido. Mantener numero de seguimiento o referencia.',
    nextAction: {
      customer: 'Esperar la entrega.',
      admin: 'Confirmar trazabilidad del envio.',
    },
    allowedTransitions: ['delivered', 'cancelled'],
  },
  delivered: {
    status: 'delivered',
    label: 'Entregado',
    publicLabel: 'Entregado',
    adminLabel: 'Entrega cerrada',
    customerExplanation: 'El pedido ha sido entregado y el ciclo queda completado.',
    adminExplanation: 'Pedido entregado. Solo quedan incidencias o postventa si aparecen.',
    nextAction: {
      customer: 'Contactar solo si hace falta soporte posterior.',
      admin: 'Archivar y medir satisfaccion si aplica.',
    },
    allowedTransitions: [],
  },
  cancelled: {
    status: 'cancelled',
    label: 'Cancelado',
    publicLabel: 'Cancelado',
    adminLabel: 'Cancelado',
    customerExplanation: 'El pedido se ha cancelado y no seguira avanzando.',
    adminExplanation: 'Pedido cerrado sin continuidad. Registrar motivo si aplica.',
    nextAction: {
      customer: 'Contactar si hace falta rehacer el pedido.',
      admin: 'Documentar motivo y cerrar el expediente.',
    },
    allowedTransitions: [],
  },
}

export function getOrderLifecycleDescriptor(status: OrderLifecycleStatus) {
  return orderLifecycle[status]
}

export function canTransitionOrderStatus(
  currentStatus: OrderLifecycleStatus,
  nextStatus: OrderLifecycleStatus,
) {
  return orderLifecycle[currentStatus].allowedTransitions.includes(nextStatus)
}
