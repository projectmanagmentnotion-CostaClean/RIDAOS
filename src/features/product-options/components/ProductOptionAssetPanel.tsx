import type { ProductOptionDefinition } from '../types/productOptions'

type ProductOptionAssetPanelProps = {
  definition: ProductOptionDefinition
}

export function ProductOptionAssetPanel({ definition }: ProductOptionAssetPanelProps) {
  return (
    <section className="content-section product-option-assets" data-product-reveal>
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Preparacion visual</p>
          <h2>Referencias utiles para revisar acabados, corte y presentacion antes de producir.</h2>
        </div>
      </div>
      <div className="product-option-assets__grid">
        {definition.assetRequirements.map((asset) => (
          <article className="content-card product-option-asset-card" key={asset.id}>
            <p className="section-label">{asset.label}</p>
            <h3>
              {asset.format === 'svg'
                ? 'Guia de corte y preparacion'
                : asset.fileName.includes('template')
                  ? 'Plantilla de trabajo'
                  : 'Referencia visual'}
            </h3>
            <p>{asset.purpose}</p>
            <div className="product-option-asset-card__meta">
              <span>{asset.format.toUpperCase()}</span>
              <span>{asset.format === 'svg' ? 'Linea tecnica' : 'Vista editorial'}</span>
            </div>
          </article>
        ))}
      </div>
      {definition.recommendedTemplateLabel ? (
        <p className="catalog-result-caption">Plantilla recomendada: {definition.recommendedTemplateLabel}.</p>
      ) : null}
    </section>
  )
}
