import { useEffect, useRef } from 'react'
import CtaPanel from '../components/CtaPanel'
import MetricCard from '../components/MetricCard'
import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'
import { initHeroAnimation, initPanelAnimations, initRevealAnimations } from '../lib/animations'

const kpis = [
  { label: 'Pedidos activos', value: '18', note: 'Cola operativa del dia' },
  { label: 'Revision pendiente', value: '6', note: 'Archivos esperando verificacion' },
  { label: 'En produccion', value: '8', note: 'Pedidos ya aprobados' },
  { label: 'Listos', value: '4', note: 'Recogida o envio pendiente' },
]

const board = [
  {
    title: 'Pendientes de revision',
    status: 'pending_review',
    orders: ['RP-24031', 'RP-24042', 'RP-24045'],
  },
  {
    title: 'Aprobados',
    status: 'approved',
    orders: ['RP-24018', 'RP-24021'],
  },
  {
    title: 'En produccion',
    status: 'in_production',
    orders: ['RP-23994', 'RP-24012', 'RP-24027'],
  },
  {
    title: 'Listos / completados',
    status: 'ready',
    orders: ['RP-23970', 'RP-23921'],
  },
]

function AdminDashboard() {
  const pageRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const scope = pageRef.current

    if (!scope) {
      return
    }

    const heroContext = initHeroAnimation(scope)
    const revealContext = initRevealAnimations(scope)
    const panelContext = initPanelAnimations(scope)

    return () => {
      panelContext.revert()
      revealContext.revert()
      heroContext.revert()
    }
  }, [])

  return (
    <PageShell className="admin-page premium-page" ref={pageRef}>
      <SectionHeader
        className="admin-hero premium-hero"
        description="Este dashboard frontend-only organiza una base clara para pedidos, archivos y cambios de estado sin activar backend ni autenticacion."
        eyebrow="Panel admin"
        hero
        title="Centro operativo visual para revision, produccion y seguimiento."
      />

      <div className="admin-kpi-grid" data-animate="reveal">
        {kpis.map((kpi) => (
          <MetricCard className="admin-kpi-card hover-lift" key={kpi.label} label={kpi.label} note={kpi.note} value={kpi.value} />
        ))}
      </div>

      <div className="split-grid admin-layout" data-animate="reveal">
        <CtaPanel
          actions={
            <div className="admin-link-stack">
              <a className="action-button action-link-button" href="#/admin/pedidos">
                Abrir pedidos
              </a>
              <a className="action-button action-button-muted action-link-button" href="#/admin/archivos">
                Revisar archivos
              </a>
            </div>
          }
          description="Entradas rapidas para el tablero interno y la cola de revision."
          label="Accesos"
          title="Control operativo inmediato."
        />

        <article className="content-card hover-lift" data-animate="panel" tabIndex={0}>
          <SectionHeader eyebrow="Estado general" title="Base interna preparada para escalar." />
          <ul className="guide-checklist">
            <li>Cola de revision preparada para moderacion manual.</li>
            <li>Transiciones de estado simuladas desde el detalle del pedido.</li>
            <li>Panel listo para conectar datos reales mas adelante.</li>
          </ul>
        </article>
      </div>

      <section className="admin-board" data-animate="reveal">
        {board.map((column) => (
          <article className="content-card admin-board-column hover-lift" data-animate="panel" key={column.title} tabIndex={0}>
            <div className="order-card-head">
              <div>
                <p className="section-label">{column.title}</p>
                <h3>{column.orders.length} pedidos</h3>
              </div>
              <StatusBadge status={column.status} />
            </div>
            <div className="admin-board-list">
              {column.orders.map((order) => (
                <a className="admin-board-item" href="#/admin/pedidos/demo" key={order}>
                  <span>{order}</span>
                  <strong>Ver pedido</strong>
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  )
}

export default AdminDashboard
