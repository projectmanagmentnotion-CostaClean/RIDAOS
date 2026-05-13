import { getConversionByEntryId } from '../catalog/conversion/conversionSelectors'

type ConversionTrustBlockProps = {
  entryId: string
  title?: string
}

function ConversionTrustBlock({ entryId, title = 'Confianza comercial' }: ConversionTrustBlockProps) {
  const block = getConversionByEntryId(entryId)

  if (!block) {
    return null
  }

  return (
    <article className="content-card conversion-trust-block">
      <p className="section-label">Conversion</p>
      <h3>{title}</h3>
      <ul className="placeholder-list">
        {block.trustBullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="conversion-copy-grid">
        <p><strong>Produccion:</strong> {block.productionPromise}</p>
        <p><strong>Revision:</strong> {block.reviewNotice}</p>
        <p><strong>Riesgo:</strong> {block.riskReducer}</p>
        <p><strong>Prueba:</strong> {block.qualityProof}</p>
      </div>
    </article>
  )
}

export default ConversionTrustBlock
