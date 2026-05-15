import { useMemo } from 'react'
import CtaPanel from '../components/CtaPanel'
import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import { publicRoutes } from '../lib/navigation'
import { useOrderStore } from '../store/useOrderStore'
import { useUserStore } from '../store/useUserStore'

const quickLinks = [
  { label: 'Mis pedidos', href: '#/mi-cuenta/pedidos' },
  { label: 'Historial de archivos', href: '#/mi-cuenta/archivos' },
  { label: 'Direcciones', href: '#/mi-cuenta' },
  { label: 'Facturas', href: '#/mi-cuenta' },
]

function MiCuenta() {
  const customer = useUserStore((state) => state.customer)
  const orders = useOrderStore((state) => state.orders)

  const uploadCount = useMemo(
    () => orders.reduce((sum, order) => sum + order.items.length, 0),
    [orders],
  )

  return (
    <PageShell className="account-page premium-page">
      <SectionHeader
        className="account-hero premium-hero"
        description="Aqui reunimos perfil, pedidos y archivos para que el seguimiento del cliente sea claro en cada proyecto."
        eyebrow="Area cliente"
        hero
        title="Tu area cliente en un solo lugar."
      />

      <div className="split-grid account-layout">
        <article className="content-card account-profile-card hover-lift" data-animate="panel" tabIndex={0}>
          <SectionHeader eyebrow="Perfil" title={customer.company || customer.name} />
          <div className="account-profile-grid">
            <div className="account-profile-item">
              <span className="meta-label">Empresa</span>
              <strong>{customer.company || customer.name}</strong>
            </div>
            <div className="account-profile-item">
              <span className="meta-label">Email</span>
              <strong>{customer.email}</strong>
            </div>
            <div className="account-profile-item">
              <span className="meta-label">Telefono</span>
              <strong>{customer.phone}</strong>
            </div>
            <div className="account-profile-item">
              <span className="meta-label">Estado</span>
              <strong>Cliente recurrente</strong>
            </div>
          </div>
        </article>

        <CtaPanel
          actions={<a className="card-link" href={publicRoutes.dtf}>Volver al configurador DTF</a>}
          className="account-notice-card"
          description="Desde aqui puedes retomar pedidos, revisar archivos y volver al configurador principal."
          label="Acceso rapido"
          title="Tu cuenta queda conectada con el flujo de pedido."
        />
      </div>

      <section className="account-section">
        <SectionHeader eyebrow="Resumen" title="Actividad reciente del cliente." />
        <div className="account-dashboard-grid">
          <article className="content-card account-link-card hover-lift" data-animate="panel" tabIndex={0}>
            <h3>Pedidos guardados</h3>
            <p>Aqui puedes revisar los pedidos registrados y retomar su seguimiento.</p>
            <strong>{orders.length} pedidos</strong>
          </article>
          <article className="content-card account-link-card hover-lift" data-animate="panel" tabIndex={0}>
            <h3>Archivos vinculados</h3>
            <p>Los archivos quedan vinculados a cada pedido para mantener el seguimiento claro.</p>
            <strong>{uploadCount} archivos</strong>
          </article>
        </div>
      </section>

      <section className="account-section">
        <SectionHeader eyebrow="Accesos rapidos" title="Panel listo para crecer." />
        <div className="account-dashboard-grid">
          {quickLinks.map((item) => (
            <article className="content-card account-link-card hover-lift" data-animate="panel" key={item.label} tabIndex={0}>
              <h3>{item.label}</h3>
              <p>Acceso directo a la informacion principal de tu cuenta.</p>
              <a className="card-link" href={item.href}>
                Abrir
              </a>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

export default MiCuenta
