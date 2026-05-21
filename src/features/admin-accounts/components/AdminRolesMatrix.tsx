import type { AdminRoleDefinition } from '../types/adminAccounts'

type AdminRolesMatrixProps = {
  roles: AdminRoleDefinition[]
}

function AdminRolesMatrix({ roles }: AdminRolesMatrixProps) {
  return (
    <div className="admin-quick-actions">
      {roles.map((role) => (
        <article className="content-card admin-quick-action" key={role.key}>
          <strong>{role.label}</strong>
          <p>{role.description}</p>
          <small>{role.permissions.join(' · ')}</small>
        </article>
      ))}
    </div>
  )
}

export default AdminRolesMatrix
