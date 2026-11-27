/** Canonical customer-facing notification templates. Rendering never sends email. */
export const DTI_NOTIFICATION_TEMPLATES = Object.freeze({
  order_received: {
    subject: (order) => `Hemos recibido tu pedido ${order.reference}`,
    heading: 'Tu pedido ya está en revisión',
    message: (order) => `Hemos recibido tu solicitud de ${order.meters} m de DTI Innuro. Revisaremos el archivo y la configuración antes de confirmar la preparación.`,
  },
  payment_confirmed: {
    subject: (order) => `Pedido confirmado · ${order.reference}`,
    heading: 'Pago confirmado y pedido registrado',
    message: (order) => `Hemos confirmado el pago de tu pedido de ${order.meters} m de DTI Innuro. La revisión técnica del archivo sigue su propio proceso y te avisaremos de cada avance.`,
  },
  payment_failed: {
    subject: (order) => `No se ha podido confirmar el pago · ${order.reference}`,
    heading: 'Pago pendiente de confirmación',
    message: () => 'No hemos recibido confirmación del pago. Puedes consultar el estado de tu pedido o contactar con Ridaos Print si necesitas ayuda.',
  },
  payment_cancelled: {
    subject: (order) => `Pago cancelado · ${order.reference}`,
    heading: 'El intento de pago se ha cancelado',
    message: () => 'El intento de pago figura como cancelado. El pedido no se considera pagado hasta que se confirme correctamente.',
  },
  adaptation_quote_ready: {
    subject: (order) => `Presupuesto de adaptación disponible · ${order.reference}`,
    heading: 'Tu presupuesto está disponible',
    message: () => 'Hemos preparado el presupuesto profesional de adaptación. Revísalo y apruébalo antes de realizar el pago; la aprobación no inicia producción por sí sola.',
  },
  adaptation_quote_approved: {
    subject: (order) => `Presupuesto aprobado · ${order.reference}`,
    heading: 'Presupuesto de adaptación aprobado',
    message: () => 'Hemos registrado la aprobación del presupuesto. El pago y la validación técnica siguen siendo pasos independientes.',
  },
  adaptation_quote_rejected: {
    subject: (order) => `Presupuesto actualizado · ${order.reference}`,
    heading: 'Presupuesto de adaptación rechazado',
    message: () => 'Hemos registrado que no aceptas este presupuesto. Contacta con Ridaos Print si quieres valorar otra opción.',
  },
  artwork_revision_requested: {
    subject: (order) => `Necesitamos un ajuste en tu archivo · ${order.reference}`,
    heading: 'Revisión técnica: necesitamos un ajuste',
    message: () => 'El equipo necesita un cambio en el archivo antes de continuar. Consulta el estado del pedido para conocer los siguientes pasos.',
  },
  artwork_rejected: {
    subject: (order) => `Revisión del archivo · ${order.reference}`,
    heading: 'El archivo requiere una nueva versión',
    message: () => 'No podemos validar esta versión para producción. Consulta el estado del pedido y envía una versión corregida o contacta con el equipo.',
  },
  artwork_technically_approved: {
    subject: (order) => `Archivo validado · pedido ${order.reference}`,
    heading: 'Archivo revisado',
    message: () => 'La revisión técnica de tu archivo ha finalizado correctamente. La aceptación del archivo y cualquier presupuesto de adaptación se mantienen como pasos independientes antes del pago o la producción.',
  },
  production_started: {
    subject: (order) => `Tu pedido entra en producción · ${order.reference}`,
    heading: 'Comenzamos la producción',
    message: () => 'Tu pedido ha superado las validaciones necesarias y ha entrado en producción. Te avisaremos cuando esté preparado para el envío o la recogida.',
  },
  lead_time_confirmed: {
    subject: (order) => `Plazo confirmado · ${order.reference}`,
    heading: 'Hemos confirmado el plazo de preparación',
    message: () => 'El plazo de preparación de tu pedido se ha confirmado. El transporte se añade después de la preparación y te avisaremos cuando esté listo.',
  },
  quality_control_started: {
    subject: (order) => `Control de calidad · ${order.reference}`,
    heading: 'Tu pedido está en control de calidad',
    message: () => 'La producción ha terminado y estamos comprobando el pedido antes de prepararlo para envío o recogida.',
  },
  production_adjustment_required: {
    subject: (order) => `Actualización de producción · ${order.reference}`,
    heading: 'Estamos revisando un ajuste de producción',
    message: () => 'El equipo está resolviendo un ajuste detectado durante la producción. Te informaremos cuando tengamos una actualización confirmada.',
  },
  ready_for_dispatch: {
    subject: (order) => `Pedido preparado · ${order.reference}`,
    heading: 'Tu pedido está preparado',
    message: (order) => order.fulfilment === 'pickup'
      ? 'Tu pedido está preparado para recoger en Ridaos Print BCN, Carrer d’Aragó 423, Barcelona.'
      : 'Tu pedido está preparado para despacho. El transporte se añade al tiempo de preparación indicado en el pedido.',
  },
  order_dispatched: {
    subject: (order) => `Pedido enviado · ${order.reference}`,
    heading: 'Tu pedido está en camino',
    message: (order) => order.trackingReference
      ? `Hemos entregado el pedido al transportista. Referencia de seguimiento: ${order.trackingReference}.`
      : 'Hemos entregado el pedido al transportista. Si hay seguimiento disponible, te lo compartiremos por el canal de atención habitual.',
  },
  ready_for_pickup: {
    subject: (order) => `Pedido listo para recoger · ${order.reference}`,
    heading: 'Puedes recoger tu pedido',
    message: () => 'Tu pedido está listo para recoger en Ridaos Print BCN, Carrer d’Aragó 423, Barcelona.',
  },
  order_picked_up: {
    subject: (order) => `Pedido recogido · ${order.reference}`,
    heading: 'Hemos registrado la recogida',
    message: () => 'Hemos registrado que tu pedido se ha recogido en Ridaos Print BCN. Gracias por confiar en Ridaos Print.',
  },
})

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const safeOrder = (order) => ({
  reference: String(order?.reference ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 80) || 'Ridaos Print',
  meters: Number.isFinite(Number(order?.meters))
    ? Math.max(0, Math.min(10_000, Math.round(Number(order.meters) * 1000) / 1000))
    : 0,
  fulfilment: order?.fulfilment === 'pickup' ? 'pickup' : 'shipping',
  trackingReference: String(order?.trackingReference ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 100),
})

/** Builds minimal, escaped HTML and plain text from allowlisted order fields. */
export function renderDtiCustomerEmail(notificationKey, orderInput) {
  const template = DTI_NOTIFICATION_TEMPLATES[notificationKey]
  if (!template) throw new TypeError('Unsupported DTI notification')
  const order = safeOrder(orderInput)
  const subject = template.subject(order)
  const message = template.message(order)
  const heading = template.heading
  return Object.freeze({
    subject,
    text: `${heading}\n\n${message}\n\nPedido: ${order.reference}\n\nRidaos Print`,
    html: `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#101212;color:#f5f7f5;font:16px/1.6 Arial,sans-serif"><main style="max-width:600px;margin:0 auto;padding:32px 20px"><p style="color:#c6ff00;font-weight:700;letter-spacing:.12em">RIDAOS PRINT · DTI INNURO</p><h1 style="font-size:26px;line-height:1.2">${escapeHtml(heading)}</h1><p>${escapeHtml(message)}</p><p style="padding:14px;border:1px solid #343838;border-radius:12px">Pedido: <strong>${escapeHtml(order.reference)}</strong></p><p style="color:#aab2b0;font-size:13px">Este aviso es informativo. La validación técnica, aprobación de presupuesto y confirmación del pago se comunican por separado.</p></main></body></html>`,
  })
}

/** Stable key for transport-level idempotency; never use email or other PII. */
export function dtiNotificationIdempotencyKey(sourceEventId, notificationKey) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(sourceEventId))) {
    throw new TypeError('Invalid DTI notification source event')
  }
  if (!Object.hasOwn(DTI_NOTIFICATION_TEMPLATES, notificationKey)) {
    throw new TypeError('Unsupported DTI notification')
  }
  return `dti:${sourceEventId.toLowerCase()}:${notificationKey}`
}

/** Retry policy for transient transport errors; callers persist only safe error codes. */
export function planDtiNotificationRetry(attemptCount, now = Date.now()) {
  const attempt = Number(attemptCount)
  if (!Number.isInteger(attempt) || attempt < 1) throw new RangeError('attemptCount must be a positive integer')
  if (!Number.isFinite(now)) throw new TypeError('now must be a timestamp')
  if (attempt >= 6) return Object.freeze({ retry: false, availableAt: null, attemptCount: attempt })
  const delay = Math.min(60 * 60 * 1000, 60_000 * (2 ** (attempt - 1)))
  return Object.freeze({ retry: true, availableAt: new Date(now + delay), attemptCount: attempt })
}
