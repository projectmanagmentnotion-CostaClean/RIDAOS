import type { CapacityBoardData } from '../types/operations'

type CapacityDashboardWidgetsProps = {
  data: CapacityBoardData
}

export default function CapacityDashboardWidgets({ data }: CapacityDashboardWidgetsProps) {
  return (
    <div className="admin-two-column">
      <section className="content-card admin-overview-card">
        <p className="section-label">Capacidad de hoy</p>
        <h3>
          {data.today.usedCapacity.toFixed(1)}h / {data.today.totalCapacity.toFixed(1)}h
        </h3>
        <p>
          Restante {data.today.remainingCapacity.toFixed(1)}h · {data.today.unassignedJobs} jobs sin asignar
        </p>
      </section>

      <section className="content-card admin-overview-card">
        <p className="section-label">Proximas entregas</p>
        <div className="admin-capacity-list">
          {data.upcomingDeliveries.map((order) => (
            <div className="summary-row" key={order.id}>
              <span>{order.id} · {order.customer}</span>
              <strong>{new Date(order.dueDate).toLocaleDateString('es-ES')}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="content-card admin-overview-card">
        <p className="section-label">Carga por operador</p>
        <div className="admin-capacity-list">
          {data.operatorWorkload.map((item) => (
            <div className="summary-row" key={item.operator.id}>
              <span>{item.operator.name}</span>
              <strong>
                {item.usedHours.toFixed(1)}h / {item.capacityHours}h
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section className="content-card admin-overview-card">
        <p className="section-label">Cola por maquina</p>
        <div className="admin-capacity-list">
          {data.machineQueue.map((item) => (
            <div className="summary-row" key={item.machine.id}>
              <span>{item.machine.label}</span>
              <strong>{item.queuedJobs} jobs</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="content-card admin-overview-card">
        <p className="section-label">Alertas de sobrecarga</p>
        <div className="admin-capacity-list">
          {data.overloadedOperators.length === 0 && data.machineQueue.every((item) => !item.overloaded) ? (
            <p className="admin-inline-note">Sin sobrecargas hoy. La cola queda equilibrada.</p>
          ) : (
            <>
              {data.overloadedOperators.map((item) => (
                <div className="summary-row" key={item.operator.id}>
                  <span>{item.operator.name}</span>
                  <strong>+{(item.usedHours - item.capacityHours).toFixed(1)}h</strong>
                </div>
              ))}
              {data.machineQueue.filter((item) => item.overloaded).map((item) => (
                <div className="summary-row" key={item.machine.id}>
                  <span>{item.machine.label}</span>
                  <strong>Cola saturada</strong>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      <section className="content-card admin-overview-card">
        <p className="section-label">Planning de entrega</p>
        <div className="admin-capacity-list">
          {data.deliveryPlanning.map((entry) => (
            <div className="summary-row" key={entry.date}>
              <span>{new Date(entry.date).toLocaleDateString('es-ES')}</span>
              <strong>{entry.items.length} salidas</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
