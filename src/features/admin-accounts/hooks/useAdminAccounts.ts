import { useEffect, useState } from 'react'
import type { AdminAccountsDashboard } from '../types/adminAccounts'
import { getAdminAccountsDashboard } from '../services/adminAccountsService'

export function useAdminAccounts() {
  const [dashboard, setDashboard] = useState<AdminAccountsDashboard | null>(null)

  useEffect(() => {
    let cancelled = false

    void getAdminAccountsDashboard().then((next) => {
      if (!cancelled) {
        setDashboard(next)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return dashboard
}
