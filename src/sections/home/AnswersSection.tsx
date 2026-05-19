import FaqBlock from '../../components/FaqBlock'
import ObjectionHandlerBlock from '../../components/ObjectionHandlerBlock'
import { dtfEntry } from '../../catalog/products/dtf'

function AnswersSection() {
  return (
    <>
      <ObjectionHandlerBlock entryId={dtfEntry.id} title="Respuestas rapidas antes de pedir." />
      <FaqBlock entryId={dtfEntry.id} title="Preguntas rapidas antes de pedir." />
    </>
  )
}

export default AnswersSection
