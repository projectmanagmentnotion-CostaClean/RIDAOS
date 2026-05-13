import type { CatalogPricingResult } from '../catalog/adapters/catalogPricingAdapter'

type CatalogResultPanelProps = {
  result: CatalogPricingResult
  title?: string
  className?: string
}

function CatalogResultPanel({ result, title = 'Resultado comercial', className = '' }: CatalogResultPanelProps) {
  return (
    <article className={`content-card catalog-result-panel ${className}`.trim()}>
      <p className="section-label">Resultado</p>
      <h3>{title}</h3>
      <div className="summary-list">
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>{result.currency} {result.subtotal.toFixed(2)}</strong>
        </div>
        <div className="summary-row summary-row-total">
          <span>Total</span>
          <strong>{result.pricingLabel}</strong>
        </div>
      </div>
      {result.quoteRequired ? <p className="catalog-result-pill">Precio a consultar</p> : null}
      {result.breakdown.length > 0 ? (
        <ul className="placeholder-list catalog-result-list">
          {result.breakdown.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {result.warnings.length > 0 ? (
        <ul className="placeholder-list catalog-warning-list">
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

export default CatalogResultPanel
