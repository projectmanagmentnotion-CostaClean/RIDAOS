import { approvalStateLabels, escalationLevelLabels, incidentTypeLabels, slaStatusLabels, ticketStatusLabels } from '../mock/clientServiceMockData'
import type { ClientServiceTicketRecord } from '../types/clientService'

type ClientServiceTicketListProps = {
  tickets: ClientServiceTicketRecord[]
}

function ClientServiceTicketList({ tickets }: ClientServiceTicketListProps) {
  return (
    <div className="admin-list-card">
      {tickets.map((ticket) => (
        <a className="admin-list-row admin-list-row-block" href={`#/admin/orders/${ticket.id}`} key={ticket.id}>
          <div>
            <strong>{ticket.id}</strong>
            <p>{ticket.customer}</p>
            <small>
              {incidentTypeLabels[ticket.incidentType]} · {approvalStateLabels[ticket.approvalState]}
            </small>
          </div>
          <div className="admin-list-row-meta">
            <span>{ticketStatusLabels[ticket.ticketStatus]}</span>
            <span>{slaStatusLabels[ticket.slaStatus]}</span>
          </div>
          <p className="admin-inline-note">
            {escalationLevelLabels[ticket.escalationLevel]} · {ticket.approvalRecommendation}
          </p>
        </a>
      ))}
    </div>
  )
}

export default ClientServiceTicketList
