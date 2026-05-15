import type { CatalogPricingResult } from '../catalog/adapters/catalogPricingAdapter'

type CatalogResultPanelProps = {
  result: CatalogPricingResult
  title?: string
  className?: string
}

function CatalogResultPanel({ result, title = 'Resultado comercial', className = '' }: CatalogResultPanelProps) {
  const nextStepCopy = result.quoteRequired
    ? 'Completa la solicitud para recibir una propuesta cerrada.'
    : result.canAddToCart
      ? 'Puedes seguir al carrito y dejar el pedido listo para revision.'
      : 'Ajusta los campos obligatorios para activar la siguiente accion.'

  return (
    <article className={`content-card catalog-result-panel ${className}`.trim()} data-cursor-zone="conversion">
      <p className="section-label">Estimacion</p>
      <h3>{title}</h3>
      <div className="summary-list">
        <div className="summary-row">
          <span>Base orientativa</span>
          <strong>{result.currency} {result.subtotal.toFixed(2)}</strong>
        </div>
        <div className="summary-row summary-row-total">
          <span>Total estimado</span>
          <strong>{result.pricingLabel}</strong>
        </div>
        <div className="summary-row">
          <span>Siguiente paso</span>
          <strong>{nextStepCopy}</strong>
        </div>
      </div>
      {result.validationMessage ? <p className="catalog-result-pill">Completa la configuracion</p> : null}
      {result.quoteRequired ? <p className="catalog-result-pill">Propuesta personalizada</p> : null}
      {!result.quoteRequired ? (
        <p className="catalog-result-caption">
          Precio orientativo antes de comprobacion tecnica, acabados especiales o validacion final del archivo.
        </p>
      ) : (
        <p className="catalog-result-caption">
          Esta referencia sirve para situar el proyecto antes de preparar una propuesta cerrada.
        </p>
      )}
      {result.breakdown.length > 0 ? (
        <ul className="hint-list catalog-result-list">
          {result.breakdown.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {result.warnings.length > 0 ? (
        <ul className="hint-list catalog-warning-list">
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

export default CatalogResultPanel
