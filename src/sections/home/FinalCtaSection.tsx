import CtaPanel from '../../components/CtaPanel'
import { bannerContent } from '../../content/bannerContent'
import { useCmsPreviewDocument } from '../../features/cms-preview'
import { getPublicCtaHref } from '../../lib/navigation'

/**
 * Editable Zone: HOME_FINAL_CTA
 * Content: src/content/bannerContent.ts
 * Visual component: src/sections/home/FinalCtaSection.tsx
 */
function FinalCtaSection() {
  const previewBanner = useCmsPreviewDocument(
    'src/content/bannerContent.ts',
    bannerContent.homeFinalCta,
    (document: { homeFinalCta?: typeof bannerContent.homeFinalCta }) => document.homeFinalCta,
  )

  return (
    <section className="content-section" data-scene="FINAL_BRAND_REVEAL" data-zone="HOME_FINAL_CTA">
      <CtaPanel
        className="cursor-interest"
        actions={
          <a className="action-button action-link-button" data-cursor="interest" href={getPublicCtaHref('dtf')}>
            {previewBanner.primaryCtaLabel}
          </a>
        }
        description={previewBanner.description}
        label={previewBanner.label}
        title={previewBanner.title}
      />
    </section>
  )
}

export default FinalCtaSection
