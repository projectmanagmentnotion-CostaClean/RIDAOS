import { useEffect, useState } from 'react'
import type { OperationsUploadRecord } from '../types/operations'
import { getOperationsUploads } from '../services/operationsService'

export function useOperationsUploads() {
  const [uploads, setUploads] = useState<OperationsUploadRecord[]>([])

  useEffect(() => {
    let cancelled = false

    void getOperationsUploads().then((next) => {
      if (!cancelled) {
        setUploads(next)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { uploads, setUploads }
}
