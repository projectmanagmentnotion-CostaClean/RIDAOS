import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

const CURSOR_DEBUG_KEY = 'ridaosCursorDebug'
const CURSOR_ENABLED_CLASS = 'premium-cursor-enabled'
const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '[data-cursor="interest"]',
  '.cursor-interest',
  '[data-cursor="interactive"]',
  '[data-cursor="sales"]',
  '[data-cursor-zone="conversion"]',
].join(', ')

type CursorEnvironment = {
  canUseCursor: boolean
  hoverCapable: boolean
  finePointer: boolean
  reducedMotion: boolean
}

function getCursorEnvironment(): CursorEnvironment {
  if (typeof window === 'undefined') {
    return {
      canUseCursor: false,
      hoverCapable: false,
      finePointer: false,
      reducedMotion: false,
    }
  }

  const hoverCapable = window.matchMedia('(hover: hover)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return {
    canUseCursor: hoverCapable && finePointer && !reducedMotion,
    hoverCapable,
    finePointer,
    reducedMotion,
  }
}

function resolveInterestTarget(target: EventTarget | null) {
  return target instanceof Element ? target.closest(INTERACTIVE_SELECTOR) : null
}

function PremiumCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const visibleRef = useRef(false)
  const interestRef = useRef(false)
  const debugEnabledRef = useRef(false)
  const envRef = useRef<CursorEnvironment>(getCursorEnvironment())
  const [environment, setEnvironment] = useState<CursorEnvironment>(() => getCursorEnvironment())

  const debugLog = useMemo(
    () => (...args: unknown[]) => {
      if (debugEnabledRef.current) {
        console.info('[PremiumCursor]', ...args)
      }
    },
    [],
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    debugEnabledRef.current = window.localStorage.getItem(CURSOR_DEBUG_KEY) === '1'

    const hoverQuery = window.matchMedia('(hover: hover)')
    const pointerQuery = window.matchMedia('(pointer: fine)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncEnvironment = () => {
      const nextEnvironment = getCursorEnvironment()
      envRef.current = nextEnvironment
      setEnvironment(nextEnvironment)
      debugEnabledRef.current = window.localStorage.getItem(CURSOR_DEBUG_KEY) === '1'
      debugLog('environment', {
        enabled: nextEnvironment.canUseCursor,
        hoverCapable: nextEnvironment.hoverCapable,
        finePointer: nextEnvironment.finePointer,
        reducedMotion: nextEnvironment.reducedMotion,
        route: window.location.hash || '#/',
      })
    }

    syncEnvironment()
    hoverQuery.addEventListener('change', syncEnvironment)
    pointerQuery.addEventListener('change', syncEnvironment)
    motionQuery.addEventListener('change', syncEnvironment)
    window.addEventListener('hashchange', syncEnvironment)

    return () => {
      hoverQuery.removeEventListener('change', syncEnvironment)
      pointerQuery.removeEventListener('change', syncEnvironment)
      motionQuery.removeEventListener('change', syncEnvironment)
      window.removeEventListener('hashchange', syncEnvironment)
    }
  }, [debugLog])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const cursor = cursorRef.current
    const root = document.documentElement
    const body = document.body

    if (!cursor || !body) {
      return
    }

    const applyRootClasses = (enabled: boolean) => {
      root.classList.toggle(CURSOR_ENABLED_CLASS, enabled)
      body.classList.toggle(CURSOR_ENABLED_CLASS, enabled)
    }

    if (!environment.canUseCursor) {
      applyRootClasses(false)
      visibleRef.current = false
      interestRef.current = false
      gsap.killTweensOf(cursor)
      gsap.set(cursor, { autoAlpha: 0, clearProps: 'mixBlendMode' })
      debugLog('disabled', {
        finePointer: environment.finePointer,
        hoverCapable: environment.hoverCapable,
        reducedMotion: environment.reducedMotion,
      })
      return
    }

    applyRootClasses(true)
    debugLog('mounted', { route: window.location.hash || '#/' })

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      width: 11,
      height: 11,
      borderRadius: 999,
      backgroundColor: '#ff00b8',
      mixBlendMode: 'normal',
      autoAlpha: 0,
      scale: 1,
    })

    const xTo = gsap.quickTo(cursor, 'x', {
      duration: environment.reducedMotion ? 0.01 : 0.14,
      ease: 'power3.out',
    })

    const yTo = gsap.quickTo(cursor, 'y', {
      duration: environment.reducedMotion ? 0.01 : 0.14,
      ease: 'power3.out',
    })

    const showCursor = () => {
      if (visibleRef.current) {
        return
      }

      visibleRef.current = true
      gsap.to(cursor, {
        autoAlpha: 1,
        duration: 0.16,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const hideCursor = () => {
      visibleRef.current = false
      interestRef.current = false
      gsap.set(cursor, {
        width: 11,
        height: 11,
        backgroundColor: '#ff00b8',
        mixBlendMode: 'normal',
      })
      gsap.to(cursor, {
        autoAlpha: 0,
        duration: 0.16,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const setInterestState = (nextInterest: boolean, source?: EventTarget | null) => {
      if (interestRef.current === nextInterest) {
        return
      }

      interestRef.current = nextInterest
      debugLog('hover', {
        active: nextInterest,
        target:
          source instanceof Element
            ? source.tagName.toLowerCase()
            : null,
      })

      if (nextInterest) {
        gsap.to(cursor, {
          width: 68,
          height: 68,
          backgroundColor: '#39ff14',
          mixBlendMode: 'difference',
          duration: environment.reducedMotion ? 0.01 : 0.24,
          ease: 'power3.out',
          overwrite: true,
        })
        return
      }

      gsap.to(cursor, {
        width: 11,
        height: 11,
        backgroundColor: '#ff00b8',
        mixBlendMode: 'normal',
        duration: environment.reducedMotion ? 0.01 : 0.2,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    const moveCursor = (x: number, y: number, target: EventTarget | null) => {
      if (!visibleRef.current) {
        debugLog('first-move', { x, y, route: window.location.hash || '#/' })
      }

      showCursor()
      xTo(x)
      yTo(y)
      setInterestState(Boolean(resolveInterestTarget(target)), target)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        return
      }

      moveCursor(event.clientX, event.clientY, event.target)
    }

    const handleMouseMove = (event: MouseEvent) => {
      moveCursor(event.clientX, event.clientY, event.target)
    }

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        return
      }

      setInterestState(Boolean(resolveInterestTarget(event.target)), event.target)
    }

    const handlePointerOut = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        return
      }

      const currentTarget = resolveInterestTarget(event.target)
      const relatedTarget = resolveInterestTarget(event.relatedTarget)

      if (currentTarget && !relatedTarget) {
        setInterestState(false, event.target)
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      setInterestState(Boolean(resolveInterestTarget(event.target)), event.target)
    }

    const handleFocusOut = (event: FocusEvent) => {
      if (!resolveInterestTarget(event.relatedTarget)) {
        setInterestState(false, event.target)
      }
    }

    const handleWindowMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        hideCursor()
      }
    }

    const handleWindowBlur = () => {
      hideCursor()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hideCursor()
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('pointerover', handlePointerOver, { passive: true })
    document.addEventListener('pointerout', handlePointerOut, { passive: true })
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    window.addEventListener('mouseout', handleWindowMouseOut)
    window.addEventListener('blur', handleWindowBlur)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
      window.removeEventListener('mouseout', handleWindowMouseOut)
      window.removeEventListener('blur', handleWindowBlur)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      xTo.tween?.kill()
      yTo.tween?.kill()
      gsap.killTweensOf(cursor)
      visibleRef.current = false
      interestRef.current = false
      applyRootClasses(false)
      gsap.set(cursor, { autoAlpha: 0, clearProps: 'mixBlendMode' })
      debugLog('cleanup', { route: window.location.hash || '#/' })
    }
  }, [environment, debugLog])

  return <div aria-hidden="true" className="premium-cursor" hidden={!environment.canUseCursor} ref={cursorRef} />
}

export default PremiumCursor
