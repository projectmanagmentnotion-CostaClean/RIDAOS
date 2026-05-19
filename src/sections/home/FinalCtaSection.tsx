import CtaPanel from '../../components/CtaPanel'
import { bannerContent } from '../../content/bannerContent'
import { getPublicCtaHref } from '../../lib/navigation'

/**
 * Editable Zone: HOME_FINAL_CTA
 * Content: src/content/bannerContent.ts
 * Visual component: src/sections/home/FinalCtaSection.tsx
 */
function FinalCtaSection() {
  return (
    <section className="content-section">
      <CtaPanel
        className="cursor-interest"
        actions={
          <a className="action-button action-link-button" data-cursor="interest" href={getPublicCtaHref('dtf')}>
            {bannerContent.homeFinalCta.primaryCtaLabel}
          </a>
        }
        description={bannerContent.homeFinalCta.description}
        label={bannerContent.homeFinalCta.label}
        title={bannerContent.homeFinalCta.title}
      />
    </section>
  )
}

export default FinalCtaSection
