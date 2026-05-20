import type { CmsDocumentType, CmsZoneView } from '../types/cms'

type CmsZoneListProps = {
  zones: CmsZoneView[]
  selectedZoneId: string | null
  onSelect: (zoneId: string) => void
}

function getZoneTypeLabel(type: CmsDocumentType) {
  switch (type) {
    case 'section':
      return 'Section'
    case 'data':
      return 'Data'
    case 'config':
      return 'Config'
    case 'page':
      return 'Page'
    case 'admin':
      return 'Admin'
    case 'commerce':
      return 'Commerce'
    case 'motion':
      return 'Motion'
    default:
      return type
  }
}

export function CmsZoneList({ zones, selectedZoneId, onSelect }: CmsZoneListProps) {
  return (
    <div className="admin-list-card cms-zone-list">
      {zones.map((zone) => (
        <button
          className={`admin-list-row cms-zone-list__item${zone.id === selectedZoneId ? ' is-active' : ''}`}
          key={zone.id}
          onClick={() => onSelect(zone.id)}
          type="button"
        >
          <div>
            <strong>{zone.id}</strong>
            <p>{zone.label}</p>
            <small>{zone.description}</small>
          </div>
          <div className="admin-list-row-meta cms-zone-list__meta">
            <span className="status-badge status-muted">{getZoneTypeLabel(zone.type)}</span>
            <span className={`status-badge ${zone.status === 'modified' ? 'status-info' : 'status-muted'}`}>
              {zone.status === 'modified' ? 'Mock editado' : 'Default'}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
