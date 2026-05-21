import AdminStatCard from '../../../admin/components/AdminStatCard'
import type { OperationsKpi } from '../types/operations'

type OperationsKpiGridProps = {
  items: OperationsKpi[]
}

function OperationsKpiGrid({ items }: OperationsKpiGridProps) {
  return (
    <div className="admin-stat-grid">
      {items.map((item) => (
        <AdminStatCard key={item.key} label={item.label} note={item.note} value={item.value} />
      ))}
    </div>
  )
}

export default OperationsKpiGrid
