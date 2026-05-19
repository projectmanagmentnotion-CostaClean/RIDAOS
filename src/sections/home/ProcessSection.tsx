import ProcessSteps from '../../components/ProcessSteps'
import SectionHeader from '../../components/SectionHeader'

function ProcessSection() {
  return (
    <section className="content-section">
      <SectionHeader eyebrow="Como funciona" title="Proceso base de pedido." />
      <ProcessSteps />
    </section>
  )
}

export default ProcessSection
