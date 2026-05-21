import type { ReactNode } from 'react'
import { useAdminUiStore } from '../store/useAdminUiStore'

type AdminShellProps = {
  title: string
  description: string
  children: ReactNode
}

const adminNavigation = [
  { href: '#/admin', label: 'Operations' },
  { href: '#/admin/content', label: 'Content Studio' },
  { href: '#/admin/service', label: 'Client service' },
  { href: '#/admin/orders', label: 'Pedidos' },
  { href: '#/admin/uploads', label: 'Artwork review' },
  { href: '#/admin/customers', label: 'Clientes' },
  { href: '#/admin/production', label: 'Produccion' },
]

function AdminShell({ title, description, children }: AdminShellProps) {
  const mobileSidebarOpen = useAdminUiStore((state) => state.mobileSidebarOpen)
  const toggleMobileSidebar = useAdminUiStore((state) => state.toggleMobileSidebar)
  const closeMobileSidebar = useAdminUiStore((state) => state.closeMobileSidebar)
  const currentHash = typeof window !== 'undefined' ? window.location.hash : '#/admin'

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${mobileSidebarOpen ? ' is-open' : ''}`}>
        <div className="admin-sidebar-head">
          <p className="section-label">RidaosPrint</p>
          <h2>Operaciones</h2>
          <p>Panel operativo mock para revision de arte, produccion, notas internas y salida.</p>
        </div>
        <div className="admin-sidebar-mode">
          <span className="status-badge status-info">Modo interno preparado</span>
          <span className="status-badge status-muted">Datos mock activos</span>
        </div>
        <nav aria-label="Admin" className="admin-sidebar-nav">
          {adminNavigation.map((item) => (
            <a
              className={`admin-sidebar-link${currentHash === item.href ? ' is-active' : ''}`}
              href={item.href}
              key={item.href}
              onClick={closeMobileSidebar}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="section-label">Panel interno</p>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="admin-topbar-meta">
              <span>Admin mock</span>
              <span>Sin conexiones reales activas</span>
              <span>Preparado para datos y roles futuros</span>
            </div>
          </div>
          <button
            aria-expanded={mobileSidebarOpen}
            className="action-button action-button-muted admin-menu-button"
            onClick={toggleMobileSidebar}
            type="button"
          >
            Menu
          </button>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}

export default AdminShell
