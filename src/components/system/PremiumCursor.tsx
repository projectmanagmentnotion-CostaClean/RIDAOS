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
  if (!(target instanceof Element)) {
    return null
  }

  if (target.closest('.premium-cursor')) {
    return null
  }

  return target.closest(INTERACTIVE_SELECTOR)
}

function PremiumCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const visualRef = useRef<HTMLDivElement | null>(null)
  const visibleRef = useRef(false)
  const interestRef = useRef(false)
  const debugEnabledRef = useRef(false)
  const lastMoveLogRef = useRef(0)
  const [environment, setEnvironment] = useState<CursorEnvironment>(() => getCursorEnvironment())

  const debugLog = useMemo(
    () => (event: string, payload?: Record<string, unknown>) => {
      if (!debugEnabledRef.current) {
        return
      }

      console.info('[PremiumCursor]', event, payload ?? null)
    },
    [],
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const hoverQuery = window.matchMedia('(hover: hover)')
    const pointerQuery = window.matchMedia('(pointer: fine)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncEnvironment = () => {
      debugEnabledRef.current = window.localStorage.getItem(CURSOR_DEBUG_KEY) === '1'

      const nextEnvironment = getCursorEnvironment()
      setEnvironment(nextEnvironment)
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
    const visual = visualRef.current
    const root = document.documentElement
    const body = document.body

    if (!cursor || !visual || !body) {
      return
    }

    const applyRootClasses = (enabled: boolean) => {
      root.classList.toggle(CURSOR_ENABLED_CLASS, enabled)
      body.classList.toggle(CURSOR_ENABLED_CLASS, enabled)
    }

    const resetVisual = () => {
      gsap.set(visual, {
        width: 11,
        height: 11,
        backgroundColor: '#ff00b8',
        mixBlendMode: 'normal',
        scale: 1,
        autoAlpha: 0,
      })
    }

    if (!environment.canUseCursor) {
      applyRootClasses(false)
      visibleRef.current = false
      interestRef.current = false
      gsap.killTweensOf(cursor)
      gsap.killTweensOf(visual)
      resetVisual()
      debugLog('disabled', {
        finePointer: environment.finePointer,
        hoverCapable: environment.hoverCapable,
        reducedMotion: environment.reducedMotion,
      })
      return
    }

    applyRootClasses(true)
    visibleRef.current = false
    interestRef.current = false
    lastMoveLogRef.current = 0

    gsap.set(cursor, {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      autoAlpha: 1,
    })
    resetVisual()

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
      gsap.to(visual, {
        autoAlpha: 1,
        duration: 0.14,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const hideCursor = () => {
      visibleRef.current = false
      interestRef.current = false
      gsap.killTweensOf(visual)
      resetVisual()
      debugLog('hide')
    }

    const setInterestState = (nextInterest: boolean, source?: EventTarget | null) => {
      if (interestRef.current === nextInterest) {
        return
      }

      interestRef.current = nextInterest
      debugLog(nextInterest ? 'hover-enter' : 'hover-leave', {
        target: source instanceof Element ? source.tagName.toLowerCase() : null,
      })

      gsap.to(visual, {
        width: nextInterest ? 68 : 11,
        height: nextInterest ? 68 : 11,
        backgroundColor: nextInterest ? '#39ff14' : '#ff00b8',
        mixBlendMode: nextInterest ? 'difference' : 'normal',
        scale: 1,
        autoAlpha: visibleRef.current ? 1 : 0,
        duration: environment.reducedMotion ? 0.01 : nextInterest ? 0.24 : 0.18,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const moveCursor = (x: number, y: number, target: EventTarget | null) => {
      if (!visibleRef.current) {
        debugLog('first-move', { x, y, route: window.location.hash || '#/' })
      }

      showCursor()
      xTo(x)
      yTo(y)

      const now = window.performance.now()
      if (debugEnabledRef.current && now - lastMoveLogRef.current > 450) {
        lastMoveLogRef.current = now
        debugLog('move-active', {
          x: Math.round(x),
          y: Math.round(y),
          interest: interestRef.current,
          target: target instanceof Element ? target.tagName.toLowerCase() : null,
        })
      }
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

      const nextTarget = resolveInterestTarget(event.target)
      if (nextTarget) {
        setInterestState(true, nextTarget)
      }
    }

    const handlePointerOut = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        return
      }

      const currentTarget = resolveInterestTarget(event.target)
      if (!currentTarget) {
        return
      }

      const relatedTarget = resolveInterestTarget(event.relatedTarget)
      if (currentTarget !== relatedTarget) {
        setInterestState(false, event.target)
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      const nextTarget = resolveInterestTarget(event.target)
      if (nextTarget) {
        setInterestState(true, nextTarget)
      }
    }

    const handleFocusOut = (event: FocusEvent) => {
      const currentTarget = resolveInterestTarget(event.target)
      if (!currentTarget) {
        return
      }

      const relatedTarget = resolveInterestTarget(event.relatedTarget)
      if (currentTarget !== relatedTarget) {
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

    debugLog('mounted', { route: window.location.hash || '#/' })

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
      gsap.killTweensOf(visual)
      visibleRef.current = false
      interestRef.current = false
      applyRootClasses(false)
      resetVisual()
      debugLog('cleanup', { route: window.location.hash || '#/' })
    }
  }, [environment, debugLog])

  return (
    <div aria-hidden="true" className="premium-cursor" hidden={!environment.canUseCursor} ref={cursorRef}>
      <div className="premium-cursor__visual" ref={visualRef} />
    </div>
  )
}

export default PremiumCursor
