import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const INTEREST_SELECTOR = [
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

function canUseCustomCursor() {
  return (
    typeof window !== 'undefined'
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function CustomCursor() {
  const cursorRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (!canUseCustomCursor()) {
      return
    }

    const root = document.documentElement
    const body = document.body
    const cursor = cursorRef.current

    if (!cursor) {
      return
    }

    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
    }

    const moveX = gsap.quickTo(cursor, 'x', {
      duration: 0.12,
      ease: 'power3.out',
    })
    const moveY = gsap.quickTo(cursor, 'y', {
      duration: 0.12,
      ease: 'power3.out',
    })

    let isInterest = false

    const applyCursorState = (interest: boolean) => {
      isInterest = interest
      body.classList.toggle('custom-cursor-interest', interest)

      gsap.to(cursor, {
        width: interest ? 68 : 11,
        height: interest ? 68 : 11,
        backgroundColor: interest ? '#39ff14' : '#ff00b8',
        duration: 0.22,
        ease: 'power3.out',
        overwrite: true,
      })

      cursor.style.mixBlendMode = interest ? 'difference' : 'normal'
    }

    const syncInterest = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const nextInterest = Boolean(element?.closest(INTEREST_SELECTOR))

      if (nextInterest !== isInterest) {
        applyCursorState(nextInterest)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      moveX(pointer.x)
      moveY(pointer.y)
      syncInterest(event.target)
    }

    const handlePointerOver = (event: Event) => {
      syncInterest(event.target)
    }

    const handlePointerLeave = () => {
      applyCursorState(false)
    }

    root.classList.add('has-custom-cursor')
    body.classList.add('has-custom-cursor')
    gsap.set(cursor, {
      x: pointer.x,
      y: pointer.y,
      xPercent: -50,
      yPercent: -50,
      width: 11,
      height: 11,
      backgroundColor: '#ff00b8',
      opacity: 1,
    })
    cursor.style.mixBlendMode = 'normal'

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerover', handlePointerOver, { passive: true })
    document.addEventListener('focusin', handlePointerOver)
    document.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('focusin', handlePointerOver)
      document.removeEventListener('pointerleave', handlePointerLeave)
      gsap.killTweensOf(cursor)
      root.classList.remove('has-custom-cursor')
      body.classList.remove('has-custom-cursor', 'custom-cursor-interest')
    }
  }, [])

  return (
    <span
      aria-hidden="true"
      className="custom-cursor"
      ref={cursorRef}
    />
  )
}

export default CustomCursor
