import {
  DTI_NOTIFICATION_TEMPLATES,
  dtiNotificationIdempotencyKey,
  renderDtiCustomerEmail,
} from './dtiNotifications.mjs'

const SAFE_ERROR = Object.freeze({
  permanent: 'provider_rejected',
  transient: 'provider_unavailable',
  missingOrder: 'order_unavailable',
})

/** Processes an already-authorized service-role client. No email is logged. */
export async function processDtiNotificationBatch({ admin, provider, batchSize = 10, logger = () => {} }) {
  const { data: claimed, error: claimError } = await admin.rpc('dti_claim_customer_notifications', { p_batch_size: batchSize })
  if (claimError) {
    logger({ event: 'dti_notification_claim_failed', code: 'database_unavailable' })
    return { claimed: 0, sent: 0, retried: 0, failed: 0, error: 'database_unavailable' }
  }

  const summary = { claimed: claimed?.length ?? 0, sent: 0, retried: 0, failed: 0 }
  for (const notification of claimed ?? []) {
    let errorCode = SAFE_ERROR.transient
    let isPermanent = false
    try {
      if (!Object.hasOwn(DTI_NOTIFICATION_TEMPLATES, notification.notification_key)) {
        errorCode = 'template_unsupported'
        isPermanent = true
        throw new Error('notification_template_unsupported')
      }
      const { data: order, error: orderError } = await admin
        .from('dti_orders')
        .select('id,customer_email,meters,shipping_method,tracking_reference')
        .eq('id', notification.order_id)
        .maybeSingle()
      if (orderError || !order) {
        errorCode = SAFE_ERROR.missingOrder
        isPermanent = true
        throw new Error('notification_order_unavailable')
      }

      const email = renderDtiCustomerEmail(notification.notification_key, {
        reference: `DTI-${String(order.id).slice(0, 8).toUpperCase()}`,
        meters: Number(order.meters),
        fulfilment: order.shipping_method === 'pickup' ? 'pickup' : 'shipping',
        trackingReference: order.tracking_reference,
      })
      const result = await provider.send({
        to: order.customer_email,
        ...email,
        idempotencyKey: dtiNotificationIdempotencyKey(notification.source_event_id, notification.notification_key),
      })
      if (!result?.ok) {
        isPermanent = result?.permanent === true
        errorCode = isPermanent ? SAFE_ERROR.permanent : SAFE_ERROR.transient
        throw new Error('notification_provider_rejected')
      }

      const { data: completed, error: completeError } = await admin.rpc('dti_complete_customer_notification', {
        p_outbox_id: notification.id,
      })
      if (completeError || completed !== true) throw new Error('notification_completion_failed')
      summary.sent += 1
      logger({ event: 'dti_notification_sent', notificationId: notification.id, notificationKey: notification.notification_key, attempt: notification.attempt_count })
    } catch {
      const { data: failed, error: failError } = await admin.rpc('dti_fail_customer_notification', {
        p_outbox_id: notification.id,
        p_safe_error_code: errorCode,
      })
      if (failError || failed !== true) {
        logger({ event: 'dti_notification_state_update_failed', code: 'database_unavailable', notificationId: notification.id, notificationKey: notification.notification_key })
        summary.failed += 1
        continue
      }
      if (isPermanent || notification.attempt_count >= 6) summary.failed += 1
      else summary.retried += 1
      logger({ event: 'dti_notification_delivery_failed', code: errorCode, notificationId: notification.id, notificationKey: notification.notification_key, attempt: notification.attempt_count })
    }
  }
  return summary
}

/** Resend adapter. Retries use the same key and exact payload for 24 hours. */
export function createResendDtiProvider({ apiKey, from, fetchImpl = fetch }) {
  if (!apiKey || !from) throw new TypeError('Email provider configuration is incomplete')
  return {
    async send({ to, subject, html, text, idempotencyKey }) {
      try {
        const response = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${apiKey}`,
            'content-type': 'application/json',
            'idempotency-key': idempotencyKey,
          },
          body: JSON.stringify({ from, to: [to], subject, html, text }),
          signal: AbortSignal.timeout(8_000),
        })
        if (response.ok) return { ok: true }
        return { ok: false, permanent: response.status >= 400 && response.status < 500 && response.status !== 409 && response.status !== 429 }
      } catch {
        return { ok: false, permanent: false }
      }
    },
  }
}

export function authorizeDtiWorker(request, expectedToken) {
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  if (!expectedToken || expectedToken.length < 32 || supplied.length !== expectedToken.length) return false
  let difference = 0
  for (let index = 0; index < supplied.length; index += 1) difference |= supplied.charCodeAt(index) ^ expectedToken.charCodeAt(index)
  return difference === 0
}
