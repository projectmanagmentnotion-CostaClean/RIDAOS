const dtfProgressSteps = [
  { id: 'metros', label: 'Metraje' },
  { id: 'acabado', label: 'Acabado' },
  { id: 'archivo', label: 'Archivo' },
  { id: 'resumen', label: 'Resumen' },
]

export function DtfProgressSteps() {
  return (
    <div className="dtf-progress-steps" aria-hidden="true">
      {dtfProgressSteps.map((step, index) => (
        <div className="dtf-progress-step" key={step.id}>
          <span>{index + 1}</span>
          <p>{step.label}</p>
        </div>
      ))}
    </div>
  )
}
