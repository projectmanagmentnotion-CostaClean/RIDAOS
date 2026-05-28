import MetricCard from '../../../components/MetricCard'
import { StickySummaryPanel } from '../../products/components/StickySummaryPanel'

type DtfStickySummaryCardProps = {
  summaryItems: { label: string; value: string }[]
  total: string
  base: string
  subtotal: string
  extras: string
  fileStatus: string
}

export function DtfStickySummaryCard({
  summaryItems,
  total,
  base,
  subtotal,
  extras,
  fileStatus,
}: DtfStickySummaryCardProps) {
  return (
    <StickySummaryPanel
      className="dtf-sticky-summary"
      description="Visible mientras configuras metraje, urgencia, extras y archivo."
      eyebrow="Resumen fijo"
      title="Precio y preparacion en vivo."
    >
      <div className="summary-list compact-summary">
        {summaryItems.map((item) => (
          <div className="summary-row" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
        <div className="summary-row summary-row-total">
          <span>Total</span>
          <strong>{total}</strong>
        </div>
      </div>
      <div className="pricing-metric-grid">
        <MetricCard className="hover-lift" label="Base" value={base} />
        <MetricCard className="hover-lift" label="Subtotal" value={subtotal} />
        <MetricCard className="hover-lift" label="Extras" value={extras} />
        <MetricCard className="hover-lift" label="Archivo" value={fileStatus} />
      </div>
    </StickySummaryPanel>
  )
}
