import type { ProductOptionDefinition } from '../types/productOptions'

type ProductOptionAssetPanelProps = {
  definition: ProductOptionDefinition
}

export function ProductOptionAssetPanel({ definition }: ProductOptionAssetPanelProps) {
  return (
    <section className="content-section product-option-assets" data-product-reveal>
      <div className="commerce-recommendations__header">
        <div>
          <p className="section-label">Assets y plantilla</p>
          <h2>Lo que esta pagina necesita para verse y producirse bien.</h2>
        </div>
      </div>
      <div className="product-option-assets__grid">
        {definition.assetRequirements.map((asset) => (
          <article className="content-card product-option-asset-card" key={asset.id}>
            <p className="section-label">{asset.label}</p>
            <h3>{asset.fileName}</h3>
            <p>{asset.purpose}</p>
            <div className="product-option-asset-card__meta">
              <span>{asset.format.toUpperCase()}</span>
              <span>{asset.status}</span>
            </div>
            <code>{asset.expectedPath}</code>
          </article>
        ))}
      </div>
      {definition.recommendedTemplateLabel ? (
        <p className="catalog-result-caption">Plantilla recomendada: {definition.recommendedTemplateLabel}.</p>
      ) : null}
    </section>
  )
}
