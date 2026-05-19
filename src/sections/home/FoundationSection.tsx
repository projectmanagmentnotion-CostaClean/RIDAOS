import CtaPanel from '../../components/CtaPanel'
import { homeFoundationContent } from '../../content/homeContent'
import SectionHeader from '../../components/SectionHeader'
import { getPublicCtaHref } from '../../lib/navigation'

/**
 * Editable Zone: HOME_FOUNDATION
 * Content: src/content/homeContent.ts
 * Visual component: src/sections/home/FoundationSection.tsx
 */
function FoundationSection() {
  return (
    <div className="split-grid home-lower-grid">
      <CtaPanel
        actions={
          <>
            <a className="action-button action-link-button" data-cursor="interest" href={getPublicCtaHref('catalogo')}>
              {homeFoundationContent.panelPrimaryCtaLabel}
            </a>
            <a className="card-link" data-cursor="interest" href={getPublicCtaHref('guia')}>
              {homeFoundationContent.panelSecondaryCtaLabel}
            </a>
          </>
        }
        className="home-foundation-panel cursor-interest"
        description={homeFoundationContent.panelDescription}
        label={homeFoundationContent.panelLabel}
        title={homeFoundationContent.panelTitle}
      />

      <article className="content-card home-quick-panel hover-lift cursor-interest" data-cursor="interest" tabIndex={0}>
        <SectionHeader title={homeFoundationContent.quickPanelTitle} />
        <ul className="detail-list">
          {homeFoundationContent.quickLinks.map((link) => (
            <li key={link.label}>
              <a className="card-link" data-cursor="interest" href={getPublicCtaHref(link.routeKey)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </div>
  )
}

export default FoundationSection
