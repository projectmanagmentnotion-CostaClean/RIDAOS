import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useNavigationMotion(currentHashRoute: string) {
  const [desktopOpen, setDesktopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRootRef = useRef<HTMLDivElement | null>(null)
  const desktopTriggerRef = useRef<HTMLButtonElement | null>(null)
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null)
  const mobileCloseRef = useRef<HTMLButtonElement | null>(null)
  const desktopBackdropRef = useRef<HTMLDivElement | null>(null)
  const desktopPanelRef = useRef<HTMLDivElement | null>(null)
  const mobileBackdropRef = useRef<HTMLDivElement | null>(null)
  const mobileDrawerRef = useRef<HTMLElement | null>(null)
  const desktopTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const mobileTimelineRef = useRef<gsap.core.Timeline | null>(null)

  const closeDesktop = useCallback((restoreFocus = false) => {
    setDesktopOpen(false)

    if (restoreFocus) {
      requestAnimationFrame(() => desktopTriggerRef.current?.focus())
    }
  }, [])

  const closeMobile = useCallback((restoreFocus = false) => {
    setMobileOpen(false)

    if (restoreFocus) {
      requestAnimationFrame(() => mobileTriggerRef.current?.focus())
    }
  }, [])

  const toggleDesktop = useCallback(() => {
    setDesktopOpen((current) => !current)
    setMobileOpen(false)
  }, [])

  const openMobile = useCallback(() => {
    setDesktopOpen(false)
    setMobileOpen(true)
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDesktopOpen(false)
      setMobileOpen(false)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [currentHashRoute])

  useEffect(() => {
    if (!mobileOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!desktopOpen && !mobileOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      if (mobileOpen) {
        event.preventDefault()
        closeMobile(true)
        return
      }

      if (desktopOpen) {
        event.preventDefault()
        closeDesktop(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeDesktop, closeMobile, desktopOpen, mobileOpen])

  useEffect(() => {
    if (!desktopOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      const root = navRootRef.current

      if (!target || !root) {
        return
      }

      if (root.contains(target)) {
        return
      }

      closeDesktop(true)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [closeDesktop, desktopOpen])

  useEffect(() => {
    const backdrop = desktopBackdropRef.current
    const panel = desktopPanelRef.current

    if (!backdrop || !panel) {
      return
    }

    const reducedMotion = prefersReducedMotion()
    const items = Array.from(panel.querySelectorAll<HTMLElement>('[data-nav-item]'))
    const accents = Array.from(panel.querySelectorAll<HTMLElement>('.ridaos-nav__accent-line'))
    const glow = panel.querySelector<HTMLElement>('.ridaos-nav__featured-glow')

    desktopTimelineRef.current?.kill()

    if (desktopOpen) {
      gsap.set([backdrop, panel], { display: 'block', pointerEvents: 'auto' })

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: reducedMotion ? 0.18 : 0.28 }, 0)
        .fromTo(
          panel,
          { autoAlpha: 0, y: reducedMotion ? 0 : -16, scale: reducedMotion ? 1 : 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: reducedMotion ? 0.24 : 0.42 },
          0,
        )
        .fromTo(
          items,
          { autoAlpha: 0, y: reducedMotion ? 0 : 14 },
          { autoAlpha: 1, y: 0, duration: reducedMotion ? 0.16 : 0.28, stagger: reducedMotion ? 0 : 0.04 },
          0.06,
        )
        .fromTo(
          accents,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: reducedMotion ? 0.16 : 0.24, stagger: reducedMotion ? 0 : 0.02 },
          0.08,
        )

      if (glow) {
        timeline.fromTo(glow, { autoAlpha: 0 }, { autoAlpha: 1, duration: reducedMotion ? 0.18 : 0.3 }, 0.1)
      }

      desktopTimelineRef.current = timeline
      return () => {
        timeline.kill()
      }
    }

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => gsap.set([backdrop, panel], { clearProps: 'all', display: 'none', pointerEvents: 'none' }),
    })
    timeline
      .to(items, { autoAlpha: 0, y: reducedMotion ? 0 : -6, duration: reducedMotion ? 0.1 : 0.14, stagger: 0.015 }, 0)
      .to(panel, { autoAlpha: 0, y: reducedMotion ? 0 : -10, scale: reducedMotion ? 1 : 0.985, duration: reducedMotion ? 0.14 : 0.22 }, 0.02)
      .to(backdrop, { autoAlpha: 0, duration: reducedMotion ? 0.12 : 0.2 }, 0.04)

    desktopTimelineRef.current = timeline
    return () => {
      timeline.kill()
    }
  }, [desktopOpen])

  useEffect(() => {
    const backdrop = mobileBackdropRef.current
    const drawer = mobileDrawerRef.current

    if (!backdrop || !drawer) {
      return
    }

    const reducedMotion = prefersReducedMotion()
    const items = Array.from(drawer.querySelectorAll<HTMLElement>('[data-nav-item], .ridaos-nav__drawer-section, .ridaos-nav__drawer-footer'))

    mobileTimelineRef.current?.kill()

    if (mobileOpen) {
      gsap.set([backdrop, drawer], { display: 'block', pointerEvents: 'auto' })

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: reducedMotion ? 0.18 : 0.26 }, 0)
        .fromTo(
          drawer,
          { autoAlpha: 0, xPercent: reducedMotion ? 0 : 8, y: reducedMotion ? 0 : 24 },
          { autoAlpha: 1, xPercent: 0, y: 0, duration: reducedMotion ? 0.22 : 0.42 },
          0,
        )
        .fromTo(
          items,
          { autoAlpha: 0, y: reducedMotion ? 0 : 12 },
          { autoAlpha: 1, y: 0, duration: reducedMotion ? 0.18 : 0.24, stagger: reducedMotion ? 0 : 0.035 },
          0.08,
        )

      mobileTimelineRef.current = timeline
      requestAnimationFrame(() => mobileCloseRef.current?.focus())
      return () => {
        timeline.kill()
      }
    }

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => gsap.set([backdrop, drawer], { clearProps: 'all', display: 'none', pointerEvents: 'none' }),
    })
    timeline
      .to(items, { autoAlpha: 0, y: reducedMotion ? 0 : -6, duration: reducedMotion ? 0.1 : 0.14, stagger: 0.01 }, 0)
      .to(drawer, { autoAlpha: 0, xPercent: reducedMotion ? 0 : 8, y: reducedMotion ? 0 : 16, duration: reducedMotion ? 0.16 : 0.22 }, 0.03)
      .to(backdrop, { autoAlpha: 0, duration: reducedMotion ? 0.12 : 0.2 }, 0.05)

    mobileTimelineRef.current = timeline
    return () => {
      timeline.kill()
    }
  }, [mobileOpen])

  return useMemo(
    () => ({
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
    }),
    [closeDesktop, closeMobile, desktopOpen, mobileOpen, openMobile, toggleDesktop],
  )
}
