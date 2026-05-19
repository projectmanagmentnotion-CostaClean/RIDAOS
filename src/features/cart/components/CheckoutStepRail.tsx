type CheckoutStepRailProps = {
  steps: readonly { id: string; label: string }[]
  activeStep: string
}

export function CheckoutStepRail({ steps, activeStep }: CheckoutStepRailProps) {
  const activeIndex = steps.findIndex((step) => step.id === activeStep)

  return (
    <div className="checkout-step-rail" aria-label="Progreso del checkout mock">
      {steps.map((step, index) => (
        <div className={`checkout-step${index <= activeIndex ? ' is-active' : ''}`} key={step.id}>
          <span className="checkout-step__index">{index + 1}</span>
          <span className="checkout-step__label">{step.label}</span>
        </div>
      ))}
    </div>
  )
}
