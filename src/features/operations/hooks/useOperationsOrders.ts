import { useEffect, useState } from 'react'
import type { OperationsFilters, OperationsOrderRecord } from '../types/operations'
import { getOperationsOrders } from '../services/operationsService'

export function useOperationsOrders(filters: OperationsFilters) {
  const [orders, setOrders] = useState<OperationsOrderRecord[]>([])

  useEffect(() => {
    let cancelled = false

    void getOperationsOrders(filters).then((next) => {
      if (!cancelled) {
        setOrders(next)
      }
    })

    return () => {
      cancelled = true
    }
  }, [filters])

  return orders
}
