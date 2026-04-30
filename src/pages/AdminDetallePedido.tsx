import { useMemo, useState } from 'react'

type AdminStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'in_production'
  | 'ready'
  | 'completed'

const statusFlow: AdminStatus[] = [
  'pending_review',
  'approved',
  'rejected',
  'in_production',
  'ready',
  'completed',
]

const timelineByStatus: Record<AdminStatus, string[]> = {
  pending_review: ['Pedido recibido', 'Archivo en revision'],
  approved: ['Pedido recibido', 'Archivo en revision', 'Archivo aprobado'],
  rejected: ['Pedido recibido', 'Archivo en revision', 'Archivo rechazado'],
  in_production: ['Pedido recibido', 'Archivo en revision', 'Archivo aprobado', 'En produccion'],
  ready: ['Pedido recibido', 'Archivo en revision', 'Archivo aprobado', 'En produccion', 'Listo para enviar'],
  completed: [
    'Pedido recibido',
    'Archivo en revision',
    'Archivo aprobado',
    'En produccion',
    'Listo para enviar',
    'Pedido completado',
  ],
}

function AdminDetallePedido() {
  const [status, setStatus] = useState<AdminStatus>('pending_review')

  const timeline = useMemo(() => timelineByStatus[status], [status])

  return (
    <section className="page admin-page">
      <div className="page-hero admin-hero">
        <p className="eyebrow">Admin detalle</p>
        <h1>Gestion operativa del pedido con acciones locales de estado.</h1>
        <p>
          Esta ficha simula el trabajo del equipo: revisar el archivo, aprobar o
          rechazar, mover a produccion y marcar el cierre sin depender de backend.
        </p>
      </div>

      <div className="split-grid admin-layout">
        <article className="content-card">
          <div className="order-card-head">
            <div>
              <p className="section-label">Pedido RP-24031</p>
              <h2 className="section-heading">DTF por metro</h2>
            </div>
            <span className={`status-badge status-${status}`}>{status}</span>
          </div>

          <div className="summary-list">
            <div className="summary-row">
              <span>Cliente</span>
              <strong>Studio Norte Textil</strong>
            </div>
            <div className="summary-row">
              <span>Metraje</span>
              <strong>4.2 m</strong>
            </div>
            <div className="summary-row">
              <span>Calidad</span>
              <strong>Premium</strong>
            </div>
            <div className="summary-row">
              <span>Urgencia</span>
              <strong>Express</strong>
            </div>
            <div className="summary-row summary-row-total">
              <span>Total</span>
              <strong>68,30 EUR</strong>
            </div>
          </div>

          <div className="admin-action-grid">
            {statusFlow.map((nextStatus) => (
              <button
                className={`action-button${status === nextStatus ? ' action-button-muted' : ''}`}
                key={nextStatus}
                onClick={() => setStatus(nextStatus)}
                type="button"
              >
                {nextStatus}
              </button>
            ))}
          </div>
        </article>

        <article className="content-card premium-file-panel">
          <p className="section-label">Archivo en revision</p>
          <div className="premium-file-card">
            <span className="premium-file-format">PDF</span>
            <h3>rp24031-frontal-camisetas.pdf</h3>
            <p>Arte principal enviado por cliente y listo para decisiones internas de aprobacion.</p>
          </div>
          <div className="summary-list">
            <div className="summary-row">
              <span>Resolucion</span>
              <strong>Pendiente de validar</strong>
            </div>
            <div className="summary-row">
              <span>Sangrado</span>
              <strong>Pendiente de validar</strong>
            </div>
            <div className="summary-row summary-row-total">
              <span>Pago</span>
              <strong>Placeholder</strong>
            </div>
          </div>
        </article>
      </div>

      <article className="content-card timeline-card">
        <p className="section-label">Timeline operativo</p>
        <div className="order-timeline">
          {timeline.map((step, index) => (
            <div className="timeline-step" key={step}>
              <div className="timeline-marker is-complete" />
              <div>
                <h3>{step}</h3>
                <p>
                  {index === timeline.length - 1
                    ? 'Estado actual del pedido segun la accion local seleccionada.'
                    : 'Paso ya registrado dentro del flujo interno.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default AdminDetallePedido
