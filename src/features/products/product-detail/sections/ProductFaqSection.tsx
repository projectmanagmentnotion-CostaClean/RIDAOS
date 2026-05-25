import FaqBlock from '../../../../components/FaqBlock'
import LocalCoverageBlock from '../../../../components/LocalCoverageBlock'
import ObjectionHandlerBlock from '../../../../components/ObjectionHandlerBlock'
import SeoContentBlock from '../../../../components/SeoContentBlock'
import UploadGuidanceBlock from '../../../../components/UploadGuidanceBlock'
import ConversionTrustBlock from '../../../../components/ConversionTrustBlock'

type ProductFaqSectionProps = {
  entryId: string
  faqTitle: string
}

export function ProductFaqSection({ entryId, faqTitle }: ProductFaqSectionProps) {
  return (
    <>
      <section className="content-section content-grid-two" data-product-reveal>
        <SeoContentBlock entryId={entryId} />
        <SeoContentBlock entryId={entryId} mode="useCases" />
      </section>
      <section data-product-reveal>
        <LocalCoverageBlock entryId={entryId} />
      </section>
      <section className="content-section content-grid-two" data-product-reveal>
        <UploadGuidanceBlock entryId={entryId} />
        <ConversionTrustBlock entryId={entryId} />
      </section>
      <section data-product-reveal>
        <ObjectionHandlerBlock entryId={entryId} />
      </section>
      <section data-product-reveal>
        <FaqBlock entryId={entryId} title={faqTitle} />
      </section>
    </>
  )
}
