import type { AdminAuditEntry } from '../../../admin/types/adminModels'

type AdminAuditTrailListProps = {
  entries: AdminAuditEntry[]
}

function AdminAuditTrailList({ entries }: AdminAuditTrailListProps) {
  return (
    <div className="admin-list-card">
      {entries.map((entry) => (
        <article className="admin-list-row admin-list-row-block" key={entry.id}>
          <div>
            <strong>{entry.actorName}</strong>
            <p>{entry.action}</p>
            <small>
              {entry.module} · {new Date(entry.timestamp).toLocaleString('es-ES')}
            </small>
          </div>
          <p className="admin-inline-note">{entry.detail}</p>
        </article>
      ))}
    </div>
  )
}

export default AdminAuditTrailList
