import MetricCard from '../../components/MetricCard'
import { homeStats } from './homeData'

function MetricsSection() {
  return (
    <div aria-label="Resumen" className="stats-grid">
      {homeStats.map((stat) => (
        <MetricCard className="hover-lift premium-value-card" key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  )
}

export default MetricsSection
