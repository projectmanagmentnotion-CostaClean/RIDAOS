import MetricCard from '../../components/MetricCard'
import { homeStats } from './homeData'

function MetricsSection() {
  return (
    <div aria-label="Resumen" className="stats-grid">
      {homeStats.map((stat) => (
        <MetricCard className="hover-lift premium-value-card cursor-interest" key={stat.label} label={stat.label} note={stat.note} value={stat.value} />
      ))}
    </div>
  )
}

export default MetricsSection
