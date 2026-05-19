type ProductGalleryFrameProps = {
  label: string
  title: string
  description: string
}

export function ProductGalleryFrame({ label, title, description }: ProductGalleryFrameProps) {
  return (
    <article className="content-card product-gallery-frame" aria-hidden="true">
      <p className="section-label">{label}</p>
      <div className="product-gallery-frame__visual" />
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}
