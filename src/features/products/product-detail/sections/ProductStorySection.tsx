import { ProductStoryPanel } from '../ProductStoryPanel'
import type { ProductStoryBlock } from '../types/productExperience.types'

type ProductStorySectionProps = {
  blocks: ProductStoryBlock[]
}

export function ProductStorySection({ blocks }: ProductStorySectionProps) {
  return (
    <section className="product-experience-story" data-product-reveal>
      <div className="product-experience-story__grid">
        {blocks.map((block, index) => (
          <div data-product-depth={index === 0 ? '0.02' : '0.05'} key={block.id}>
            <ProductStoryPanel
              bullets={block.bullets}
              description={block.description}
              eyebrow={block.eyebrow}
              title={block.title}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
