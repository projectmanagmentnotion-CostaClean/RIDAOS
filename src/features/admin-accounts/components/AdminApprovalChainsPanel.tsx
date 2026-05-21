import type { AdminApprovalChain } from '../../../admin/types/adminModels'

type AdminApprovalChainsPanelProps = {
  chains: AdminApprovalChain[]
}

function AdminApprovalChainsPanel({ chains }: AdminApprovalChainsPanelProps) {
  return (
    <div className="admin-list-card">
      {chains.map((chain) => (
        <article className="admin-list-row admin-list-row-block" key={`${chain.key}-${chain.label}`}>
          <div>
            <strong>{chain.label}</strong>
            <p>{chain.currentStatus}</p>
            <small>{chain.steps.map((step) => `${step.label} (${step.requiredRole})`).join(' · ')}</small>
          </div>
        </article>
      ))}
    </div>
  )
}

export default AdminApprovalChainsPanel
