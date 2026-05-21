import { useEffect, useState } from 'react'
import { getClientServiceDashboard, getClientServiceTickets } from '../services/clientServiceService'
import type { ClientServiceDashboardData, ClientServiceFilters, ClientServiceTicketRecord } from '../types/clientService'

export const defaultClientServiceFilters: ClientServiceFilters = {
  search: '',
  ticketStatus: 'all',
  slaStatus: 'all',
  approvalState: 'all',
  escalationLevel: 'all',
  incidentType: 'all',
  sort: 'newest',
}

export function useOperationsClientService(filters: ClientServiceFilters = defaultClientServiceFilters) {
  const [dashboard, setDashboard] = useState<ClientServiceDashboardData | null>(null)
  const [tickets, setTickets] = useState<ClientServiceTicketRecord[]>([])

  useEffect(() => {
    let cancelled = false

    void Promise.all([getClientServiceDashboard(), getClientServiceTickets(filters)]).then(([nextDashboard, nextTickets]) => {
      if (!cancelled) {
        setDashboard(nextDashboard)
        setTickets(nextTickets)
      }
    })

    return () => {
      cancelled = true
    }
  }, [filters])

  return { dashboard, tickets }
}
