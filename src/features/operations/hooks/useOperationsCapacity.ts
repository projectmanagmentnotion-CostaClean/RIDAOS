import { useEffect, useState } from 'react'
import type { CapacityBoardData, SchedulingBoardData } from '../types/operations'
import { getOperationsCapacityBoard, getOperationsSchedulingBoard } from '../services/operationsService'

export function useOperationsCapacity() {
  const [capacity, setCapacity] = useState<CapacityBoardData | null>(null)
  const [schedule, setSchedule] = useState<SchedulingBoardData | null>(null)

  useEffect(() => {
    let cancelled = false

    void Promise.all([getOperationsCapacityBoard(), getOperationsSchedulingBoard()]).then(([nextCapacity, nextSchedule]) => {
      if (!cancelled) {
        setCapacity(nextCapacity)
        setSchedule(nextSchedule)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { capacity, schedule }
}
