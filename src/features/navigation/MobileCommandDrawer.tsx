import type { RefObject } from 'react'
import { NavigationIcon } from './NavigationIcons'
import {
  getNavigationItemKey,
  isNavigationItemActive,
  mobileProductLinks,
  mobilePrimaryCards,
  mobileResourceLinks,
  navigationMeta,
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
      <div className="ridaos-nav__mobile-link-copy">
        <span>{item.label}</span>
        <small>{item.description}</small>
      </div>
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
        className={`ridaos-nav__drawer-backdrop${open ? ' is-open' : ''}`}
        onClick={onClose}
        ref={backdropRef}
      />
      <aside
        aria-hidden={!open}
        aria-labelledby="ridaos-mobile-nav-title"
        aria-label={navigationMeta.mobileDialogLabel}
        aria-modal="true"
        className={`ridaos-nav__drawer${open ? ' is-open' : ''}`}
        id={drawerId}
        ref={drawerRef}
        role="dialog"
      >
        <div className="ridaos-nav__drawer-shell">
          <header className="ridaos-nav__drawer-header">
            <div className="ridaos-nav__drawer-brand">
              <a
                aria-label="Ir a la pagina de inicio"
                className="brand ridaos-nav__drawer-logo"
                data-cursor="interactive"
                href="#/"
                onClick={onNavigate}
                tabIndex={open ? 0 : -1}
              >
                <img
                  alt={brandLabel}
                  className="brand__logo"
                  loading="eager"
                  src="/assets/brand/ridaos-logo-main.png"
                />
              </a>
              <h2 id="ridaos-mobile-nav-title">{navigationMeta.mobileTitle}</h2>
              <p>Acceso rapido a catalogo, rotulacion y DTI.</p>
            </div>
            <button
              aria-label={navigationMeta.mobileCloseAriaLabel}
              className="ridaos-nav__mobile-close"
              onClick={onClose}
              ref={closeButtonRef}
              type="button"
            >
              <NavigationIcon className="ridaos-nav__button-icon" name={navigationMeta.mobileCloseIcon} />
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
                <div className="ridaos-nav__mobile-card-head">
                  <strong>{item.label}</strong>
                </div>
                <span>{item.description}</span>
              </a>
            ))}
          </div>

          <section className="ridaos-nav__drawer-section">
            <header>
              <div className="ridaos-nav__section-label">
                <p>Productos</p>
              </div>
            </header>
            <div className="ridaos-nav__mobile-links">
              {mobileProductLinks.map((item) => (
                <MobileLink
                  currentHashRoute={currentHashRoute}
                  item={item}
                  key={getNavigationItemKey(item)}
                  onNavigate={onNavigate}
                  open={open}
                />
              ))}
            </div>
          </section>

          <section className="ridaos-nav__drawer-section">
            <header>
              <div className="ridaos-nav__section-label">
                <p>Recursos</p>
              </div>
            </header>
            <div className="ridaos-nav__mobile-links">
              {mobileResourceLinks.map((item) => (
                <MobileLink
                  currentHashRoute={currentHashRoute}
                  item={item}
                  key={getNavigationItemKey(item)}
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
