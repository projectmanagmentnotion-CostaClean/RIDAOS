import CtaPanel from '../../../../components/CtaPanel'
import type { ProductFinalCtaContent } from '../types/productExperience.types'

type ProductFinalCtaSectionProps = {
  content: ProductFinalCtaContent
}

export function ProductFinalCtaSection({ content }: ProductFinalCtaSectionProps) {
  return (
    <section data-product-reveal>
      <CtaPanel
        actions={
          <>
            <a className="action-button action-link-button" href={content.primaryHref}>
              {content.primaryLabel}
            </a>
            {content.secondaryHref && content.secondaryLabel ? (
              <a className="card-link" href={content.secondaryHref}>
                {content.secondaryLabel}
              </a>
            ) : null}
          </>
        }
        className="product-final-cta"
        description={content.description}
        label={content.label}
        title={content.title}
      />
    </section>
  )
}
