import { ProductGalleryFrame } from '../../product-gallery/ProductGalleryFrame'
import type { ProductGalleryFrameContent } from '../types/productExperience.types'

type ProductGallerySectionProps = {
  frames: ProductGalleryFrameContent[]
}

export function ProductGallerySection({ frames }: ProductGallerySectionProps) {
  return (
    <section className="product-experience-gallery" data-product-reveal>
      <div className="product-experience-gallery__grid">
        {frames.map((frame, index) => (
          <div data-product-depth={index === 0 ? '0.03' : '0.06'} key={frame.id}>
            <ProductGalleryFrame
              assetFileName={frame.assetFileName}
              assetPath={frame.assetPath}
              assetStatus={frame.assetStatus}
              description={frame.description}
              label={frame.label}
              title={frame.title}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
