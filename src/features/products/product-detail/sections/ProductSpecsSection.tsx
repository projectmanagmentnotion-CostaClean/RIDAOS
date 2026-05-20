import type { CatalogEntry } from '../../../../types/product'

type ProductSpecsSectionProps = {
  entry: CatalogEntry
}

export function ProductSpecsSection({ entry }: ProductSpecsSectionProps) {
  return (
    <section className="product-experience-specs" data-product-reveal>
      <div className="product-spec-card content-card hover-lift">
        <p className="section-label">Modo</p>
        <h3>{entry.purchaseMode === 'direct' ? 'Compra directa' : entry.purchaseMode === 'hybrid' ? 'Directo + revision' : 'Presupuesto'}</h3>
        <p>La ficha mantiene visible el camino comercial real del producto.</p>
      </div>
      <div className="product-spec-card content-card hover-lift">
        <p className="section-label">Precio</p>
        <h3>{entry.pricingMode === 'range' ? 'Rango orientativo' : entry.pricingMode === 'quote' ? 'Propuesta guiada' : 'Calculado en vivo'}</h3>
        <p>{entry.productionTime ?? 'El plazo final se confirma tras la comprobacion tecnica.'}</p>
      </div>
      <div className="product-spec-card content-card hover-lift">
        <p className="section-label">Archivo</p>
        <h3>{entry.upload.required ? 'Requerido' : 'Opcional'}</h3>
        <p>{entry.manualReviewRequired ? 'La revision tecnica sigue separada del cierre comercial.' : 'Flujo directo sin revision adicional.'}</p>
      </div>
    </section>
  )
}
