import type { ClientServiceDashboardData } from '../types/clientService'

type ClientServiceDashboardWidgetsProps = {
  data: ClientServiceDashboardData
}

function ClientServiceDashboardWidgets({ data }: ClientServiceDashboardWidgetsProps) {
  return (
    <div className="admin-dispatch-kpi-grid">
      {data.kpis.map((item) => (
        <article className="content-card admin-dispatch-kpi-card" key={item.key}>
          <p className="section-label">{item.label}</p>
          <strong>{item.value}</strong>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  )
}

export default ClientServiceDashboardWidgets
