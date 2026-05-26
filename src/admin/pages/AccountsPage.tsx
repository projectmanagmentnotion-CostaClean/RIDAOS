import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import AdminShell from '../layouts/AdminShell'
import AdminAccountsUserList from '../../features/admin-accounts/components/AdminAccountsUserList'
import AdminApprovalChainsPanel from '../../features/admin-accounts/components/AdminApprovalChainsPanel'
import AdminAuditTrailList from '../../features/admin-accounts/components/AdminAuditTrailList'
import AdminRolesMatrix from '../../features/admin-accounts/components/AdminRolesMatrix'
import { useAdminAccounts } from '../../features/admin-accounts/hooks/useAdminAccounts'

/**
 * Editable Zones:
 * - ADMIN_ACCOUNTS
 * - ADMIN_ROLES
 * - ADMIN_PERMISSIONS
 * - ADMIN_APPROVAL_CHAINS
 * - ADMIN_AUDIT_TRAIL
 * Visual component: src/admin/pages/AccountsPage.tsx
 * Data layer: src/features/admin-accounts/mock/adminAccountsMockData.ts
 */
function AccountsPage() {
  const dashboard = useAdminAccounts()

  return (
    <AdminShell
      description="Usuarios internos, roles, permisos visuales, ownership y trazabilidad administrativa en una sola vista."
      title="Accounts, roles y approvals"
    >
      {!dashboard ? (
        <EmptyAdminState title="Cargando cuentas" description="Preparando usuarios, roles y cadenas de aprobacion." />
      ) : (
        <>
          <AdminSection
            description="Lectura de ownership operativo, carga y actividad reciente por usuario."
            title="Usuarios internos"
          >
            <AdminAccountsUserList users={dashboard.users} />
          </AdminSection>

          <div className="admin-two-column">
            <AdminSection
              description="Permisos visibles y roles operativos para organizar accesos y responsabilidades."
              title="Roles y permisos"
            >
              <AdminRolesMatrix roles={dashboard.roles} />
            </AdminSection>

            <AdminSection
              description="Cadenas de aprobacion activas o preparadas para artwork, incidencias y contenido."
              title="Approval chains"
            >
              <AdminApprovalChainsPanel chains={dashboard.approvalChains} />
            </AdminSection>
          </div>

          <AdminSection
            description="Timeline de auditoria sobre cambios internos, ownership y acciones operativas."
            title="Audit trail"
          >
            <AdminAuditTrailList entries={dashboard.recentAudit} />
          </AdminSection>
        </>
      )}
    </AdminShell>
  )
}

export default AccountsPage
