import MetricCard from '../../components/MetricCard'
import { homeStats } from './homeData'

/**
 * Editable Zone: HOME_METRICS
 * Content: src/content/homeContent.ts
 * Visual component: src/sections/home/MetricsSection.tsx
 */
function MetricsSection() {
  return (
    <div aria-label="Resumen" className="stats-grid" data-zone="HOME_METRICS">
      {homeStats.map((stat) => (
        <MetricCard className="hover-lift premium-value-card cursor-interest" key={stat.label} label={stat.label} note={stat.note} value={stat.value} />
      ))}
    </div>
  )
}

export default MetricsSection
