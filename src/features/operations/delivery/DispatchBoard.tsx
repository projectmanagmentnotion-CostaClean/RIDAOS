import { deliveryMethodLabels, packingStatusLabels } from '../dispatch/dispatchMockData'
import { dispatchStatusColumns } from './deliveryMockData'
import type { DispatchBoardColumns } from '../types/operations'

type DispatchBoardProps = {
  board: DispatchBoardColumns
  onAdvanceStatus: (orderId: string) => void | Promise<void>
  onMarkPacked: (orderId: string) => void | Promise<void>
  onRegisterIncident: (orderId: string) => void | Promise<void>
}

export default function DispatchBoard({ board, onAdvanceStatus, onMarkPacked, onRegisterIncident }: DispatchBoardProps) {
  return (
    <div className="admin-dispatch-board">
      {dispatchStatusColumns.map((column) => (
        <section className="content-card admin-dispatch-column" key={column.key}>
          <div className="admin-scheduling-day__head">
            <div>
              <p className="section-label">{column.label}</p>
              <h3>{board[column.key].length}</h3>
            </div>
          </div>
          <div className="admin-dispatch-column__cards">
            {board[column.key].map((order) => (
              <article className="admin-dispatch-card" key={order.id}>
                <strong>{order.id} · {order.customer}</strong>
                <p>{deliveryMethodLabels[order.deliveryMethod]} · {order.carrierLabel}</p>
                <small>{order.deliveryWindow} · {packingStatusLabels[order.packingStatus]}</small>
                <small>{order.trackingCode || 'Sin tracking mock'}</small>
                <div className="catalog-card-actions">
                  <button className="action-button action-button-muted" onClick={() => void onMarkPacked(order.id)} type="button">
                    Marcar embalado
                  </button>
                  <button className="action-button" onClick={() => void onAdvanceStatus(order.id)} type="button">
                    Avanzar salida
                  </button>
                  <button className="action-button action-button-muted" onClick={() => void onRegisterIncident(order.id)} type="button">
                    Incidencia
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
