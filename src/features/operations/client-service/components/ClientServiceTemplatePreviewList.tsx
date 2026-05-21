import type { ClientServiceTemplatePreview } from '../types/clientService'

type ClientServiceTemplatePreviewListProps = {
  items: ClientServiceTemplatePreview[]
}

function ClientServiceTemplatePreviewList({ items }: ClientServiceTemplatePreviewListProps) {
  return (
    <div className="admin-message-preview-grid">
      {items.map((item) => (
        <article className="content-card admin-message-preview-card" key={item.key}>
          <div className="admin-message-preview-head">
            <strong>{item.label}</strong>
            <span className={`status-badge status-${item.tone === 'warning' ? 'warning' : item.tone === 'success' ? 'success' : 'info'}`}>
              Mock
            </span>
          </div>
          <p className="admin-inline-note">{item.subject}</p>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  )
}

export default ClientServiceTemplatePreviewList
