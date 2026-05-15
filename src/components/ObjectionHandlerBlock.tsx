import { getObjectionHandlersForEntry } from '../catalog/content/contentSelectors'

type ObjectionHandlerBlockProps = {
  entryId: string
  title?: string
}

function ObjectionHandlerBlock({
  entryId,
  title = 'Respuestas para objeciones habituales',
}: ObjectionHandlerBlockProps) {
  const objections = getObjectionHandlersForEntry(entryId)

  if (!objections.length) {
    return null
  }

  return (
    <section className="content-section objection-block">
      <div className="content-card panel-integrated objection-block-header">
        <p className="section-label">Objeciones</p>
        <h3>{title}</h3>
      </div>
      <div className="faq-grid">
        {objections.map((item) => (
          <article className="content-card panel-integrated faq-card hover-lift" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.response}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ObjectionHandlerBlock
