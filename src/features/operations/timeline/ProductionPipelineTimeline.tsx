import type { OperationsOrderRecord, ProductionStageDefinition } from '../types/operations'
import { getProductionStatusTone } from '../services/operationsMappers'

type ProductionPipelineTimelineProps = {
  order: OperationsOrderRecord
  stages: ProductionStageDefinition[]
}

function ProductionPipelineTimeline({ order, stages }: ProductionPipelineTimelineProps) {
  const activeIndex = stages.findIndex((stage) => stage.key === order.queueStage)

  return (
    <div className="order-lifecycle-timeline">
      {stages.map((stage, index) => {
        const isComplete = index < activeIndex
        const isActive = index === activeIndex
        const tone = isActive ? getProductionStatusTone(stage.key) : isComplete ? 'success' : 'default'

        return (
          <article className="order-lifecycle-step" key={stage.key}>
            <div className={`order-lifecycle-step__index timeline-dot-${tone}`}>
              {index + 1}
            </div>
            <div>
              <h3>{stage.label}</h3>
              <p>{stage.description}</p>
              {isActive ? <span className="premium-caption">Etapa activa</span> : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default ProductionPipelineTimeline
