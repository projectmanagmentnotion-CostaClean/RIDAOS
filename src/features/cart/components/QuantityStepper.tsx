type QuantityStepperProps = {
  value: number
  min?: number
  onChange: (value: number) => void
}

export function QuantityStepper({ value, min = 1, onChange }: QuantityStepperProps) {
  return (
    <div className="quantity-stepper" data-cursor="interactive">
      <button
        className="quantity-stepper__button"
        onClick={() => onChange(Math.max(min, value - 1))}
        type="button"
      >
        -
      </button>
      <span className="quantity-stepper__value">{value}</span>
      <button
        className="quantity-stepper__button"
        onClick={() => onChange(value + 1)}
        type="button"
      >
        +
      </button>
    </div>
  )
}
