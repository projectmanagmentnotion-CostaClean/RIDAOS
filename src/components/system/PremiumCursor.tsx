import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input[type="submit"]',
  '[role="button"]',
  '[data-cursor="interest"]',
  '.cursor-interest',
  '[data-cursor="interactive"]',
  '[data-cursor="sales"]',
  '[data-cursor-zone="conversion"]',
].join(', ')

function canUsePremiumCursor() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover)').matches &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function isInterestTarget(target: EventTarget | null) {
  return target instanceof Element ? target.closest(INTERACTIVE_SELECTOR) : null
}

function PremiumCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const [enabled] = useState(() => canUsePremiumCursor())

  useEffect(() => {
    if (!enabled) {
      return
    }

    const cursor = cursorRef.current

    if (!cursor) {
      return
    }

    const root = document.documentElement
    let isInterest = false

    root.classList.add('has-premium-cursor')

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      width: 11,
      height: 11,
      backgroundColor: '#ff00b8',
      borderRadius: 999,
      mixBlendMode: 'normal',
      autoAlpha: 0,
      scale: 1,
    })

    const xTo = gsap.quickTo(cursor, 'x', {
      duration: 0.14,
      ease: 'power3.out',
    })

    const yTo = gsap.quickTo(cursor, 'y', {
      duration: 0.14,
      ease: 'power3.out',
    })

    const setInterestState = (nextInterest: boolean) => {
      if (isInterest === nextInterest) {
        return
      }

      isInterest = nextInterest

      if (nextInterest) {
        gsap.set(cursor, { mixBlendMode: 'difference' })
        gsap.to(cursor, {
          width: 68,
          height: 68,
          backgroundColor: '#39ff14',
          duration: 0.28,
          ease: 'power3.out',
          overwrite: true,
        })
        return
      }

      gsap.to(cursor, {
        width: 11,
        height: 11,
        backgroundColor: '#ff00b8',
        duration: 0.22,
        ease: 'power3.out',
        overwrite: true,
        onComplete: () => {
          if (!isInterest) {
            gsap.set(cursor, { mixBlendMode: 'normal' })
          }
        },
      })
    }

    const showCursor = () => {
      gsap.to(cursor, {
        autoAlpha: 1,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const hideCursor = () => {
      setInterestState(false)
      gsap.to(cursor, {
        autoAlpha: 0,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const handlePointerMove = (event: PointerEvent) => {
      showCursor()
      xTo(event.clientX)
      yTo(event.clientY)
      setInterestState(Boolean(isInterestTarget(event.target)))
    }

    const handlePointerOver = (event: Event) => {
      setInterestState(Boolean(isInterestTarget(event.target)))
    }

    const handlePointerOut = (event: Event) => {
      const target = isInterestTarget(event.target)
      const related = isInterestTarget((event as PointerEvent).relatedTarget)

      if (target && !related) {
        setInterestState(false)
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      setInterestState(Boolean(isInterestTarget(event.target)))
    }

    const handleFocusOut = (event: FocusEvent) => {
      const related = isInterestTarget(event.relatedTarget)
      if (!related) {
        setInterestState(false)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerenter', showCursor)
    window.addEventListener('pointerleave', hideCursor)
    document.addEventListener('pointerover', handlePointerOver, { passive: true })
    document.addEventListener('pointerout', handlePointerOut, { passive: true })
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerenter', showCursor)
      window.removeEventListener('pointerleave', hideCursor)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
      xTo.tween?.kill()
      yTo.tween?.kill()
      gsap.killTweensOf(cursor)
      root.classList.remove('has-premium-cursor')
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return <div aria-hidden="true" className="custom-cursor" ref={cursorRef} />
}

export default PremiumCursor
