import type { ClientServiceTicketRecord } from '../types/clientService'

type SlaMonitorCardsProps = {
  tickets: ClientServiceTicketRecord[]
}

function SlaMonitorCards({ tickets }: SlaMonitorCardsProps) {
  return (
    <div className="admin-quick-actions">
      {tickets.map((ticket) => (
        <article className="content-card admin-quick-action" key={ticket.id}>
          <strong>{ticket.id}</strong>
          <p>{ticket.customer}</p>
          <small>SLA: {ticket.slaHoursRemaining}h</small>
        </article>
      ))}
    </div>
  )
}

export default SlaMonitorCards
