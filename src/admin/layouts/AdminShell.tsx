import type { ReactNode } from 'react'
import { useAdminUiStore } from '../store/useAdminUiStore'

type AdminShellProps = {
  title: string
  description: string
  hasDtiWorkspace?: boolean
  children: ReactNode
}

const adminNavigation = [
  { href: '#/admin', label: 'Operations' },
  { href: '#/admin/content', label: 'Content Studio' },
  { href: '#/admin/service', label: 'Client service' },
  { href: '#/admin/accounts', label: 'Accounts' },
  { href: '#/admin/reporting', label: 'Reporting' },
  { href: '#/admin/orders', label: 'Pedidos' },
  { href: '#/admin/uploads', label: 'Artwork review' },
  { href: '#/admin/customers', label: 'Clientes' },
  { href: '#/admin/production', label: 'Produccion' },
]

function AdminShell({ title, description, hasDtiWorkspace = false, children }: AdminShellProps) {
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
          <p>{hasDtiWorkspace ? 'Operaciones DTI protegidas por Supabase QA. Las áreas legacy de este panel conservan sus datos de demostración.' : 'Demostracion local del panel de revision, produccion, notas internas y salida.'}</p>
        </div>
        <div className="admin-sidebar-mode">
          <span className={`status-badge ${hasDtiWorkspace ? 'status-info' : 'status-warning'}`}>{hasDtiWorkspace ? 'DTI QA · acceso por rol' : 'Modo demo · no operativo'}</span>
          <span className="status-badge status-muted">{hasDtiWorkspace ? 'Legacy · datos simulados' : 'Datos simulados · no son pedidos reales'}</span>
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
              {hasDtiWorkspace ? <>
                <span>Cola DTI conectada a QA después del inicio de sesión</span>
                <span>Las demás áreas siguen siendo demos</span>
                <span>Permisos comprobados por Supabase en cada acción</span>
              </> : <>
                <span>Demostracion local</span>
                <span>Los cambios solo afectan datos de muestra</span>
                <span>No conecta con pedidos DTI ni con Supabase</span>
              </>}
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
