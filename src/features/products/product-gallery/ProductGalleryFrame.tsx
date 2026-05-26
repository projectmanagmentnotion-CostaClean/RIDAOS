import type { CSSProperties } from 'react'

type ProductGalleryFrameProps = {
  label: string
  title: string
  description: string
  assetFileName?: string
  assetPath?: string
  assetStatus?: 'required' | 'mock' | 'pending'
}

export function ProductGalleryFrame({ label, title, description, assetFileName, assetPath, assetStatus }: ProductGalleryFrameProps) {
  const style = {
    '--product-gallery-image': assetPath ? `url("${assetPath}")` : 'none',
  } as CSSProperties

  return (
    <article className="content-card product-gallery-frame" aria-hidden="true">
      <p className="section-label">{label}</p>
      <div className="product-gallery-frame__visual" data-status={assetStatus} style={style}>
        <div className="product-gallery-frame__backdrop" />
        <div className="product-gallery-frame__grid" />
        <div className="product-gallery-frame__image" />
        {assetFileName || assetPath || assetStatus ? (
          <div className="product-gallery-frame__asset">
            <strong>{title}</strong>
            <span>{assetStatus === 'required' ? 'Visual principal' : 'Detalle de referencia'}</span>
          </div>
        ) : null}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}
