import { getMockLifecycleIndex, mockOrderLifecycleSteps } from '../utils/orderLifecycle'
import type { OrderStatus } from '../../../types/backend'

type OrderLifecycleTimelineProps = {
  status: OrderStatus
}

export function OrderLifecycleTimeline({ status }: OrderLifecycleTimelineProps) {
  const activeSteps = getMockLifecycleIndex(status)

  return (
    <div className="order-lifecycle-timeline">
      {mockOrderLifecycleSteps.map((step, index) => (
        <article
          className={`order-lifecycle-step${index + 1 <= activeSteps ? ' is-active' : ''}`}
          key={step.id}
        >
          <span className="order-lifecycle-step__index">{index + 1}</span>
          <div>
            <h3>{step.label}</h3>
            <p>{step.description}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
