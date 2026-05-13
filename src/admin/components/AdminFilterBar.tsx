import type { ReactNode } from 'react'

type AdminFilterBarProps = {
  children: ReactNode
}

function AdminFilterBar({ children }: AdminFilterBarProps) {
  return <div className="admin-filter-bar">{children}</div>
}

export default AdminFilterBar
