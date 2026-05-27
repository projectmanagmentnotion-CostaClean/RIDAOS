import type { RefObject } from 'react'
import {
  isNavigationItemActive,
  mobilePrimaryCards,
  navigationMeta,
  productLinks,
  resourceLinks,
  serviceLinks,
  type NavigationLinkItem,
} from './navigationData'

type MobileCommandDrawerProps = {
  brandLabel: string
  currentHashRoute: string
  open: boolean
  drawerId: string
  backdropRef: RefObject<HTMLDivElement | null>
  drawerRef: RefObject<HTMLElement | null>
  closeButtonRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
  onNavigate: () => void
}

function MobileLink({
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
      className={`ridaos-nav__mobile-link${isActive ? ' is-active' : ''}`}
      data-accent={item.accent}
      data-cursor="interactive"
      data-nav-item
      href={item.href}
      onClick={onNavigate}
      tabIndex={open ? 0 : -1}
    >
      <span>{item.label}</span>
      <small>{item.description}</small>
    </a>
  )
}

export function MobileCommandDrawer({
  brandLabel,
  currentHashRoute,
  open,
  drawerId,
  backdropRef,
  drawerRef,
  closeButtonRef,
  onClose,
  onNavigate,
}: MobileCommandDrawerProps) {
  return (
    <>
      <div
        aria-hidden={!open}
        className="ridaos-nav__drawer-backdrop"
        onClick={onClose}
        ref={backdropRef}
      />
      <aside
        aria-hidden={!open}
        aria-labelledby="ridaos-mobile-nav-title"
        aria-modal="true"
        className="ridaos-nav__drawer"
        id={drawerId}
        ref={drawerRef}
        role="dialog"
      >
        <div className="ridaos-nav__drawer-shell">
          <header className="ridaos-nav__drawer-header">
            <div>
              <p className="section-label">Navegacion</p>
              <h2 id="ridaos-mobile-nav-title">{navigationMeta.mobileTitle}</h2>
              <p>{brandLabel}</p>
            </div>
            <button
              aria-label="Cerrar menu"
              className="ridaos-nav__mobile-close"
              onClick={onClose}
              ref={closeButtonRef}
              type="button"
            >
              <span />
              <span />
            </button>
          </header>

          <a
            className="action-button action-link-button ridaos-nav__drawer-cta"
            data-cursor="sales"
            data-nav-item
            href={navigationMeta.primaryCta.href}
            onClick={onNavigate}
            tabIndex={open ? 0 : -1}
          >
            {navigationMeta.primaryCta.label}
          </a>

          <div className="ridaos-nav__mobile-grid">
            {mobilePrimaryCards.map((item) => (
              <a
                className="ridaos-nav__mobile-card"
                data-accent={item.accent}
                data-cursor="interactive"
                data-nav-item
                href={item.href}
                key={item.href}
                onClick={onNavigate}
                tabIndex={open ? 0 : -1}
              >
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </a>
            ))}
          </div>

          <section className="ridaos-nav__drawer-section">
            <header>
              <p>Productos</p>
            </header>
            <div className="ridaos-nav__mobile-links">
              {productLinks.map((item) => (
                <MobileLink
                  currentHashRoute={currentHashRoute}
                  item={item}
                  key={item.href}
                  onNavigate={onNavigate}
                  open={open}
                />
              ))}
            </div>
          </section>

          <section className="ridaos-nav__drawer-section">
            <header>
              <p>Rotulacion</p>
            </header>
            <div className="ridaos-nav__mobile-links">
              {serviceLinks.map((item) => (
                <MobileLink
                  currentHashRoute={currentHashRoute}
                  item={item}
                  key={item.href}
                  onNavigate={onNavigate}
                  open={open}
                />
              ))}
            </div>
          </section>

          <section className="ridaos-nav__drawer-section">
            <header>
              <p>Recursos</p>
            </header>
            <div className="ridaos-nav__mobile-links">
              {resourceLinks.map((item) => (
                <MobileLink
                  currentHashRoute={currentHashRoute}
                  item={item}
                  key={item.href}
                  onNavigate={onNavigate}
                  open={open}
                />
              ))}
            </div>
          </section>

          <footer className="ridaos-nav__drawer-footer">
            <p>Impresion, rotulacion y DTI con revision tecnica.</p>
          </footer>
        </div>
      </aside>
    </>
  )
}
