import type { ReportHistoryEntry } from '../types/reporting'

type ReportHistoryMockProps = {
  items: readonly ReportHistoryEntry[]
}

export function ReportHistoryMock({ items }: ReportHistoryMockProps) {
  return (
    <div className="admin-list-card">
      {items.map((item) => (
        <article className="admin-list-row" key={item.id}>
          <div>
            <strong>{item.label}</strong>
            <p>{new Date(item.generatedAt).toLocaleString('es-ES')}</p>
          </div>
          <div className="admin-list-row-meta">
            <span>{item.format.toUpperCase()}</span>
            <span className={`status-badge status-${item.status === 'generated' ? 'success' : 'info'}`}>{item.status}</span>
          </div>
        </article>
      ))}
    </div>
  )
}
