import type { ProductProcessStep } from '../types/productExperience.types'

type ProductProcessSectionProps = {
  steps: ProductProcessStep[]
}

export function ProductProcessSection({ steps }: ProductProcessSectionProps) {
  return (
    <section className="product-experience-process" data-product-reveal>
      <div className="product-experience-process__header">
        <p className="section-label">Proceso</p>
        <h2>Coreografia ligera para leer el producto antes de cerrar.</h2>
      </div>
      <div className="product-experience-process__timeline">
        {steps.map((step, index) => (
          <article className="product-process-step content-card" key={step.id}>
            <span className="product-process-step__index">{index + 1}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
