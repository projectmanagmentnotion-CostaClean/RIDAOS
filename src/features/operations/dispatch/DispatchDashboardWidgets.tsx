import { deliveryMethodLabels, packingStatusLabels } from './dispatchMockData'
import type { DispatchDashboardData } from '../types/operations'

type DispatchDashboardWidgetsProps = {
  data: DispatchDashboardData
}

export default function DispatchDashboardWidgets({ data }: DispatchDashboardWidgetsProps) {
  return (
    <div className="admin-two-column">
      <section className="content-card admin-overview-card">
        <p className="section-label">Pedidos listos para salida</p>
        <div className="admin-capacity-list">
          {data.readyForPickup.map((order) => (
            <div className="summary-row" key={order.id}>
              <span>{order.id} · {order.customer}</span>
              <strong>{deliveryMethodLabels[order.deliveryMethod]}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="content-card admin-overview-card">
        <p className="section-label">Pendientes de embalaje</p>
        <div className="admin-capacity-list">
          {data.packingQueue.map((order) => (
            <div className="summary-row" key={order.id}>
              <span>{order.id}</span>
              <strong>{packingStatusLabels[order.packingStatus]}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="content-card admin-overview-card">
        <p className="section-label">Recogidas y entregas</p>
        <div className="admin-capacity-list">
          {data.handoffs.map((order) => (
            <div className="summary-row" key={order.id}>
              <span>{order.customer}</span>
              <strong>{order.deliveryWindow}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="content-card admin-overview-card">
        <p className="section-label">Incidencias de entrega</p>
        <div className="admin-capacity-list">
          {data.incidents.length === 0 ? (
            <p className="admin-inline-note">Sin incidencias activas en la cola mock.</p>
          ) : (
            data.incidents.map((order) => (
              <div className="summary-row" key={order.id}>
                <span>{order.id}</span>
                <strong>{order.deliveryIncident}</strong>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
