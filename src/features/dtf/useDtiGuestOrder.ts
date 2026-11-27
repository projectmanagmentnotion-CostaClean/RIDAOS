import { useCallback, useEffect, useState } from 'react'
import { callDtiFunction } from './dtiCheckout'

export type DtiGuestOrder = {
  order: {
    id: string
    meters: number
    usefulWidthMm: number
    totalCents: number
    currency: string
    status: string
    paymentStatus: string
    shippingMethod: string
    estimatedDispatchDate: string | null
    confirmedLeadTime: string | null
    trackingReference: string | null
    createdAt: string
  }
  latestArtwork: null | { fileName: string; format: string; validation: string; validationSummary: string[]; clientAcceptedAt: string | null }
  adaptationQuote: null | { total_cents: number; status: string; hours: number }
}

type StoredAccess = { orderId: string; token: string; itemId: string }

function readGuestAccess(): StoredAccess | null {
  try {
    const raw = sessionStorage.getItem('dti-current-order')
    if (!raw) return null
    const access = JSON.parse(raw) as Partial<StoredAccess>
    if (typeof access.orderId !== 'string' || !/^[0-9a-f-]{36}$/i.test(access.orderId)
      || typeof access.token !== 'string' || access.token.length < 32
      || typeof access.itemId !== 'string') return null
    return access as StoredAccess
  } catch {
    return null
  }
}

export function useDtiGuestOrder() {
  const [access] = useState(readGuestAccess)
  const [order, setOrder] = useState<DtiGuestOrder | null>(null)
  const [loading, setLoading] = useState(Boolean(access))
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!access) return
    setLoading(true)
    setError('')
    try {
      const result = await callDtiFunction<DtiGuestOrder>(
        'dti-orders',
        { orderId: access.orderId },
        { method: 'GET', orderToken: access.token },
      )
      setOrder(result)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo consultar el pedido.')
    } finally {
      setLoading(false)
    }
  }, [access])

  useEffect(() => {
    if (!access) return
    let active = true
    callDtiFunction<DtiGuestOrder>(
      'dti-orders',
      { orderId: access.orderId },
      { method: 'GET', orderToken: access.token },
    ).then((result) => {
      if (active) setOrder(result)
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'No se pudo consultar el pedido.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [access])
  return { access, order, loading, error, refresh }
}

export const dtiCustomerStatusLabels: Record<string, string> = {
  awaiting_artwork: 'Esperando el archivo',
  awaiting_artwork_review: 'Revisión inicial del archivo',
  awaiting_manual_timeline: 'Plazo bajo consulta',
  awaiting_payment: 'Pendiente de pago',
  paid_awaiting_technical_review: 'Pago confirmado · revisión técnica pendiente',
  queued_for_production: 'Aprobado · pendiente de producción',
  in_production: 'En producción',
  quality_control: 'Control de calidad',
  rework_required: 'Ajuste de producción',
  preparing_dispatch: 'Preparando el pedido',
  ready_for_dispatch: 'Listo para envío',
  dispatched: 'Despachado',
  ready_for_pickup: 'Listo para recoger en Barcelona',
  picked_up: 'Recogido',
  cancelled: 'Cancelado',
}
