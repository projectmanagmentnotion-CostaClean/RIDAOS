import { useEffect, useState } from 'react'
import type { DispatchBoardColumns, DispatchDashboardData } from '../types/operations'
import { getOperationsDispatchBoard, getOperationsDispatchDashboard } from '../services/operationsService'

export function useOperationsDispatch() {
  const [dashboard, setDashboard] = useState<DispatchDashboardData | null>(null)
  const [board, setBoard] = useState<DispatchBoardColumns | null>(null)

  useEffect(() => {
    let cancelled = false

    void Promise.all([getOperationsDispatchDashboard(), getOperationsDispatchBoard()]).then(([nextDashboard, nextBoard]) => {
      if (!cancelled) {
        setDashboard(nextDashboard)
        setBoard(nextBoard)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { dashboard, board }
}
