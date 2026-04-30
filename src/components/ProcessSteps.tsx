const defaultSteps = ['Configura', 'Sube archivo', 'Revision', 'Produccion', 'Entrega'] as const

type ProcessStepsProps = {
  steps?: readonly string[]
}

function ProcessSteps({ steps = defaultSteps }: ProcessStepsProps) {
  return (
    <ol className="process-grid" data-animate="reveal">
      {steps.map((step, index) => (
        <li className="content-card process-card hover-lift" data-animate="panel" key={step}>
          <p className="section-label">Paso {index + 1}</p>
          <h3>{step}</h3>
        </li>
      ))}
    </ol>
  )
}

export default ProcessSteps
