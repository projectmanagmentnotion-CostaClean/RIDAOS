import type { ReactNode } from 'react'
import { useAdminUiStore } from '../store/useAdminUiStore'

type AdminShellProps = {
  title: string
  description: string
  children: ReactNode
}

const adminNavigation = [
  { href: '#/admin', label: 'Resumen' },
  { href: '#/admin/orders', label: 'Pedidos' },
  { href: '#/admin/uploads', label: 'Archivos' },
  { href: '#/admin/customers', label: 'Clientes' },
  { href: '#/admin/production', label: 'Produccion' },
]

function AdminShell({ title, description, children }: AdminShellProps) {
  const mobileSidebarOpen = useAdminUiStore((state) => state.mobileSidebarOpen)
  const toggleMobileSidebar = useAdminUiStore((state) => state.toggleMobileSidebar)
  const closeMobileSidebar = useAdminUiStore((state) => state.closeMobileSidebar)

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${mobileSidebarOpen ? ' is-open' : ''}`}>
        <div className="admin-sidebar-head">
          <p className="section-label">RidaosPrint</p>
          <h2>Operaciones</h2>
        </div>
        <nav aria-label="Admin" className="admin-sidebar-nav">
          {adminNavigation.map((item) => (
            <a className="admin-sidebar-link" href={item.href} key={item.href} onClick={closeMobileSidebar}>
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
