import type { AdminAccountSummary } from '../types/adminAccounts'

type AdminAccountsUserListProps = {
  users: AdminAccountSummary[]
}

function AdminAccountsUserList({ users }: AdminAccountsUserListProps) {
  return (
    <div className="admin-list-card">
      {users.map((user) => (
        <article className="admin-list-row admin-list-row-block" key={user.id}>
          <div>
            <strong>{user.name}</strong>
            <p>{user.email}</p>
            <small>
              {user.role} · {user.workloadLabel}
            </small>
          </div>
          <div className="admin-list-row-meta">
            <span>{user.assignedOrders} pedidos</span>
            <span>{user.assignedTickets} tickets</span>
          </div>
          <p className="admin-inline-note">
            {user.latestActivity ? `${user.latestActivity.action} · ${new Date(user.latestActivity.timestamp).toLocaleString('es-ES')}` : 'Sin actividad registrada.'}
          </p>
        </article>
      ))}
    </div>
  )
}

export default AdminAccountsUserList
