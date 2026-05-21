import { useEffect, useState } from 'react'
import type { OperationsDashboardData } from '../types/operations'
import { getOperationsDashboard } from '../services/operationsService'

export function useOperationsDashboard() {
  const [data, setData] = useState<OperationsDashboardData | null>(null)

  useEffect(() => {
    let cancelled = false

    void getOperationsDashboard().then((next) => {
      if (!cancelled) {
        setData(next)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return data
}
