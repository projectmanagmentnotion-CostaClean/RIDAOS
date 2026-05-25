import PageShell from '../../../../components/PageShell'
import type { ReactNode, RefObject } from 'react'

type ProductExperienceLayoutProps = {
  pageRef: RefObject<HTMLElement | null>
  className?: string
  hero: ReactNode
  gallery?: ReactNode
  configurator: ReactNode
  stickySummary: ReactNode
  templateDownloads?: ReactNode
  optionAssets?: ReactNode
  specs?: ReactNode
  story?: ReactNode
  process?: ReactNode
  recommendations?: ReactNode
  discoverability?: ReactNode
  faq?: ReactNode
  finalCta?: ReactNode
}

export function ProductExperienceLayout({
  pageRef,
  className,
  hero,
  gallery,
  configurator,
  stickySummary,
  templateDownloads,
  optionAssets,
  specs,
  story,
  process,
  recommendations,
  discoverability,
  faq,
  finalCta,
}: ProductExperienceLayoutProps) {
  return (
    <PageShell className={`premium-page product-experience-page${className ? ` ${className}` : ''}`} ref={pageRef}>
      {hero}
      {gallery}
      <div className="split-grid immersive-grid product-layout product-experience-layout">
        {configurator}
        {stickySummary}
      </div>
      {templateDownloads}
      {optionAssets}
      {specs}
      {story}
      {process}
      {recommendations}
      {discoverability}
      {faq}
      {finalCta}
    </PageShell>
  )
}
