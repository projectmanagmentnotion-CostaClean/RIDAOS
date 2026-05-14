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
      <p className="section-label">Confianza</p>
      <h3>{title}</h3>
      <ul className="hint-list">
        {block.trustBullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="conversion-copy-grid">
        <p><strong>Fabricacion:</strong> {block.productionPromise}</p>
        <p><strong>Comprobacion:</strong> {block.reviewNotice}</p>
        <p><strong>Riesgo:</strong> {block.riskReducer}</p>
        <p><strong>Calidad:</strong> {block.qualityProof}</p>
      </div>
    </article>
  )
}

export default ConversionTrustBlock
