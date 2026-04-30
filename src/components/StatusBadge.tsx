type StatusBadgeProps = {
  status: string
  children?: string
}

function StatusBadge({ status, children }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{children ?? status}</span>
}

export default StatusBadge
