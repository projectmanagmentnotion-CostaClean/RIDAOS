import { DesktopCommandMenu } from './DesktopCommandMenu'
import { MobileCommandDrawer } from './MobileCommandDrawer'
import { NavigationIcon } from './NavigationIcons'
import { isNavigationItemActive, navigationMeta, primaryLinks } from './navigationData'
import { useNavigationMotion } from './useNavigationMotion'
import { getPublicHref } from '../../lib/navigation'

type PremiumNavBarProps = {
  brandLabel: string
  currentHashRoute: string
}

export function PremiumNavBar({ brandLabel, currentHashRoute }: PremiumNavBarProps) {
  const {
    desktopOpen,
    mobileOpen,
    navRootRef,
    desktopTriggerRef,
    mobileTriggerRef,
    mobileCloseRef,
    desktopBackdropRef,
    desktopPanelRef,
    mobileBackdropRef,
    mobileDrawerRef,
    closeDesktop,
    closeMobile,
    toggleDesktop,
    openMobile,
  } = useNavigationMotion(currentHashRoute)

  return (
    <div className="ridaos-nav" ref={navRootRef}>
      <nav aria-label="Principal" className="ridaos-nav__bar">
        <a
          aria-label="Ir a la pagina de inicio"
          className="brand ridaos-nav__logo"
          data-cursor="interactive"
          href={getPublicHref('home')}
        >
          <img
            alt={brandLabel}
            className="brand__logo"
            loading="eager"
            src="/assets/brand/ridaos-logo-main.png"
          />
          <span className="sr-only">{brandLabel}</span>
        </a>

        <div className="ridaos-nav__primary">
          {primaryLinks.map((item) => {
            const isActive = isNavigationItemActive(currentHashRoute, item)

            return (
              <a
                aria-current={isActive ? 'page' : undefined}
                className={`ridaos-nav__link${isActive ? ' is-active' : ''}`}
                data-accent={item.accent}
                data-cursor="interactive"
                href={item.href}
                key={item.href}
              >
                {item.icon ? <NavigationIcon className="ridaos-nav__link-icon" name={item.icon} /> : null}
                {item.label}
              </a>
            )
          })}
        </div>

        <div className="ridaos-nav__actions">
          <button
            aria-controls="ridaos-command-panel"
            aria-expanded={desktopOpen}
            aria-haspopup="dialog"
            aria-label="Abrir exploracion"
            className={`ridaos-nav__trigger ridaos-nav__trigger--desktop${desktopOpen ? ' is-open' : ''}`}
            data-cursor="interactive"
            onClick={toggleDesktop}
            ref={desktopTriggerRef}
            type="button"
          >
            <NavigationIcon className="ridaos-nav__button-icon" name={navigationMeta.desktopTriggerIcon} />
            <span>{navigationMeta.desktopTriggerLabel}</span>
          </button>

          <a
            className="action-button action-link-button ridaos-nav__cta"
            data-cursor="sales"
            href={navigationMeta.primaryCta.href}
          >
            {navigationMeta.primaryCta.label}
          </a>

          <button
            aria-controls="ridaos-mobile-drawer"
            aria-expanded={mobileOpen}
            aria-haspopup="dialog"
            aria-label={navigationMeta.mobileAriaLabel}
            className="ridaos-nav__mobile-toggle"
            data-cursor="interactive"
            onClick={openMobile}
            ref={mobileTriggerRef}
            type="button"
          >
            <NavigationIcon className="ridaos-nav__button-icon ridaos-nav__button-icon--menu" name={navigationMeta.mobileTriggerIcon} />
            <strong>{navigationMeta.mobileTriggerLabel}</strong>
          </button>
        </div>
      </nav>

      <DesktopCommandMenu
        backdropRef={desktopBackdropRef}
        currentHashRoute={currentHashRoute}
        onClose={() => closeDesktop(true)}
        onNavigate={() => closeDesktop(false)}
        open={desktopOpen}
        panelId="ridaos-command-panel"
        panelRef={desktopPanelRef}
      />

      <MobileCommandDrawer
        backdropRef={mobileBackdropRef}
        brandLabel={brandLabel}
        closeButtonRef={mobileCloseRef}
        currentHashRoute={currentHashRoute}
        drawerId="ridaos-mobile-drawer"
        drawerRef={mobileDrawerRef}
        onClose={() => closeMobile(true)}
        onNavigate={() => closeMobile(false)}
        open={mobileOpen}
      />
    </div>
  )
}
