import type { RefObject } from 'react'
import { NavigationIcon } from './NavigationIcons'
import {
  featuredLinks,
  getNavigationItemKey,
  isNavigationItemActive,
  navigationMeta,
  productLinks,
  resourceLinks,
  serviceLinks,
  type NavigationLinkItem,
} from './navigationData'

type DesktopCommandMenuProps = {
  currentHashRoute: string
  open: boolean
  panelId: string
  backdropRef: RefObject<HTMLDivElement | null>
  panelRef: RefObject<HTMLDivElement | null>
  onClose: () => void
  onNavigate: () => void
}

function CommandLinkItem({
  item,
  currentHashRoute,
  open,
  onNavigate,
}: {
  item: NavigationLinkItem
  currentHashRoute: string
  open: boolean
  onNavigate: () => void
}) {
  const isActive = isNavigationItemActive(currentHashRoute, item)

  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={`ridaos-nav__panel-link${isActive ? ' is-active' : ''}`}
      data-accent={item.accent}
      data-cursor="interactive"
      data-nav-item
      href={item.href}
      onClick={onNavigate}
      tabIndex={open ? 0 : -1}
    >
      {item.icon ? <NavigationIcon className="ridaos-nav__item-icon" name={item.icon} /> : null}
      <div className="ridaos-nav__panel-link-copy">
        <span className="ridaos-nav__panel-link-title">
          {item.label}
          {item.badge ? <small>{item.badge}</small> : null}
        </span>
        <span>{item.description}</span>
      </div>
      <span className="ridaos-nav__panel-link-line ridaos-nav__accent-line" aria-hidden="true" />
    </a>
  )
}

export function DesktopCommandMenu({
  currentHashRoute,
  open,
  panelId,
  backdropRef,
  panelRef,
  onClose,
  onNavigate,
}: DesktopCommandMenuProps) {
  return (
    <>
      <div
        aria-hidden={!open}
        className="ridaos-nav__panel-backdrop"
        onClick={onClose}
        ref={backdropRef}
      />
      <div
        aria-hidden={!open}
        className="ridaos-nav__panel"
        id={panelId}
        ref={panelRef}
        role="group"
      >
        <div className="ridaos-nav__panel-grid">
          <section className="ridaos-nav__panel-card" data-accent="green">
            <header className="ridaos-nav__panel-head">
              <div className="ridaos-nav__section-label">
                <NavigationIcon className="ridaos-nav__section-icon" name={navigationMeta.sectionIcons.products} />
                <p>Productos</p>
              </div>
              <span className="ridaos-nav__section-line ridaos-nav__accent-line" aria-hidden="true" />
            </header>
            <div className="ridaos-nav__panel-list">
              {productLinks.map((item) => (
                <CommandLinkItem
                  currentHashRoute={currentHashRoute}
                  item={item}
                  key={getNavigationItemKey(item)}
                  onNavigate={onNavigate}
                  open={open}
                />
              ))}
            </div>
          </section>

          <section className="ridaos-nav__panel-card ridaos-nav__panel-card--wrap" data-accent="pink">
            <header className="ridaos-nav__panel-head">
              <div className="ridaos-nav__section-label">
                <NavigationIcon className="ridaos-nav__section-icon" name={navigationMeta.sectionIcons.rotulacion} />
                <p>Rotulacion</p>
              </div>
              <span className="ridaos-nav__section-line ridaos-nav__accent-line" aria-hidden="true" />
            </header>
            <div className="ridaos-nav__panel-list">
              {serviceLinks.map((item) => (
                <CommandLinkItem
                  currentHashRoute={currentHashRoute}
                  item={item}
                  key={getNavigationItemKey(item)}
                  onNavigate={onNavigate}
                  open={open}
                />
              ))}
            </div>
          </section>

          <section className="ridaos-nav__panel-card" data-accent="cyan">
            <header className="ridaos-nav__panel-head">
              <div className="ridaos-nav__section-label">
                <NavigationIcon className="ridaos-nav__section-icon" name={navigationMeta.sectionIcons.resources} />
                <p>Recursos</p>
              </div>
              <span className="ridaos-nav__section-line ridaos-nav__accent-line" aria-hidden="true" />
            </header>
            <div className="ridaos-nav__panel-list">
              {resourceLinks.map((item) => (
                <CommandLinkItem
                  currentHashRoute={currentHashRoute}
                  item={item}
                  key={getNavigationItemKey(item)}
                  onNavigate={onNavigate}
                  open={open}
                />
              ))}
            </div>
          </section>

          <aside className="ridaos-nav__featured" data-accent="green">
            <div className="ridaos-nav__featured-glow" aria-hidden="true" />
            <div className="ridaos-nav__featured-grid" aria-hidden="true" />
            <p className="ridaos-nav__featured-eyebrow">{navigationMeta.featuredBlock.eyebrow}</p>
            <div className="ridaos-nav__featured-title">
              <NavigationIcon className="ridaos-nav__featured-icon" name={navigationMeta.featuredBlock.icon} />
              <h3>{navigationMeta.featuredBlock.title}</h3>
            </div>
            <div className="ridaos-nav__featured-chips">
              {navigationMeta.featuredBlock.chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
            <div className="ridaos-nav__featured-links">
              {featuredLinks.map((item) => (
                <CommandLinkItem
                  currentHashRoute={currentHashRoute}
                  item={item}
                  key={getNavigationItemKey(item)}
                  onNavigate={onNavigate}
                  open={open}
                />
              ))}
            </div>
            <a
              className="action-button action-link-button"
              data-cursor="sales"
              data-nav-item
              href={navigationMeta.featuredBlock.ctaHref}
              onClick={onNavigate}
              tabIndex={open ? 0 : -1}
            >
              <NavigationIcon className="ridaos-nav__button-icon" name={navigationMeta.primaryCta.icon} />
              {navigationMeta.featuredBlock.ctaLabel}
            </a>
          </aside>
        </div>
      </div>
    </>
  )
}
