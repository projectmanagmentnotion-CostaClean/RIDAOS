import type { OperationsActivityItem } from '../types/operations'

type OperationsActivityFeedProps = {
  items: OperationsActivityItem[]
}

function OperationsActivityFeed({ items }: OperationsActivityFeedProps) {
  return (
    <div className="admin-comment-list">
      {items.map((item) => (
        <article className="admin-comment-item" key={item.id}>
          <strong>{item.title}</strong>
          <p>{item.detail}</p>
          <span>{new Date(item.timestamp).toLocaleString('es-ES')}</span>
          {item.href ? (
            <a className="card-link" href={item.href}>
              Abrir contexto
            </a>
          ) : null}
        </article>
      ))}
    </div>
  )
}

export default OperationsActivityFeed
