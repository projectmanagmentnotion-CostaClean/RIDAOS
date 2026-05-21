import type { DeliveryMessagePreview } from '../types/operations'

type DeliveryMessagePreviewCardProps = {
  items: DeliveryMessagePreview[]
}

export default function DeliveryMessagePreviewCard({ items }: DeliveryMessagePreviewCardProps) {
  return (
    <div className="admin-message-preview-grid">
      {items.map((item) => (
        <article className="content-card admin-message-preview-card" key={item.key}>
          <p className="section-label">{item.label}</p>
          <p>{item.message}</p>
        </article>
      ))}
    </div>
  )
}
