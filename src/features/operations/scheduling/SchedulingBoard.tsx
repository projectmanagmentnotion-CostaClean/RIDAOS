import { capacityWindows } from '../capacity/capacityMockData'
import type { SchedulingBoardData } from '../types/operations'

type SchedulingBoardProps = {
  board: SchedulingBoardData
}

export default function SchedulingBoard({ board }: SchedulingBoardProps) {
  return (
    <div className="admin-scheduling-board">
      {board.days.map((day) => (
        <article className="content-card admin-scheduling-day" key={day.date}>
          <div className="admin-scheduling-day__head">
            <div>
              <p className="section-label">{day.label}</p>
              <h3>{new Date(day.date).toLocaleDateString('es-ES')}</h3>
            </div>
            <span>{day.deliveries.length} entregas</span>
          </div>

          <div className="admin-scheduling-deliveries">
            {day.deliveries.length === 0 ? (
              <p className="admin-inline-note">Sin entregas marcadas para este dia.</p>
            ) : (
              day.deliveries.map((order) => (
                <div className="admin-scheduling-chip" key={order.id}>
                  <strong>{order.id}</strong>
                  <span>{order.customer}</span>
                </div>
              ))
            )}
          </div>

          <div className="admin-scheduling-machine-grid">
            {capacityWindows.map((window) => (
              <div className="admin-scheduling-window" key={window.key}>
                <strong>{window.label}</strong>
                {day.machineSlots
                  .filter((slot) => slot.window === window.key)
                  .map((slot) => (
                    <div className={`admin-scheduling-slot${slot.overloaded ? ' is-overloaded' : ''}`} key={slot.id}>
                      <span>{slot.machine.label}</span>
                      <small>{slot.order ? `${slot.order.id} · ${slot.order.operator.name}` : 'Libre'}</small>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </article>
      ))}

      {board.conflicts.length > 0 ? (
        <article className="content-card admin-scheduling-conflicts">
          <p className="section-label">Conflictos</p>
          <div className="admin-capacity-list">
            {board.conflicts.map((conflict) => (
              <div className="summary-row" key={conflict.id}>
                <span>{conflict.message}</span>
                <strong>{conflict.level === 'critical' ? 'Critico' : 'Aviso'}</strong>
              </div>
            ))}
          </div>
        </article>
      ) : null}
    </div>
  )
}
