import type { ProductOptionDefinition } from '../types/productOptions'

type ProductOptionAssetPanelProps = {
  definition: ProductOptionDefinition
}

export function ProductOptionAssetPanel({ definition }: ProductOptionAssetPanelProps) {
  return (
    <section className="content-section product-option-assets" data-product-reveal>
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Guia visual y tecnica</p>
          <h2>Referencias utiles para preparar el producto con seguridad.</h2>
        </div>
      </div>
      <div className="product-option-assets__grid">
        {definition.assetRequirements.map((asset) => (
          <article className="content-card product-option-asset-card" key={asset.id}>
            <p className="section-label">{asset.label}</p>
            <h3>
              {asset.format === 'svg'
                ? 'Guia de corte y sangrado'
                : asset.fileName.includes('template')
                  ? 'Plantilla de preparacion'
                  : 'Visual de referencia'}
            </h3>
            <p>{asset.purpose}</p>
            <div className="product-option-asset-card__meta">
              <span>{asset.format.toUpperCase()}</span>
              <span>{asset.format === 'svg' ? 'Vectorial' : 'Bitmap'}</span>
            </div>
          </article>
        ))}
      </div>
      {definition.recommendedTemplateLabel ? (
        <p className="catalog-result-caption">Plantilla disponible: {definition.recommendedTemplateLabel}.</p>
      ) : null}
    </section>
  )
}
