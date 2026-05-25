type ProductGalleryFrameProps = {
  label: string
  title: string
  description: string
  assetFileName?: string
  assetPath?: string
  assetStatus?: 'required' | 'mock' | 'pending'
}

export function ProductGalleryFrame({ label, title, description, assetFileName, assetPath, assetStatus }: ProductGalleryFrameProps) {
  return (
    <article className="content-card product-gallery-frame" aria-hidden="true">
      <p className="section-label">{label}</p>
      <div className="product-gallery-frame__visual">
        {assetFileName || assetPath || assetStatus ? (
          <div className="product-gallery-frame__asset">
            <strong>{title}</strong>
            <span>Visual editorial del producto</span>
          </div>
        ) : null}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}
