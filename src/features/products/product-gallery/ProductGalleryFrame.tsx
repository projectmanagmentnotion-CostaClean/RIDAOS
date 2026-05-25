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
        {assetFileName ? (
          <div className="product-gallery-frame__asset">
            <strong>{assetFileName}</strong>
            {assetStatus ? <span>{assetStatus}</span> : null}
            {assetPath ? <code>{assetPath}</code> : null}
          </div>
        ) : null}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}
