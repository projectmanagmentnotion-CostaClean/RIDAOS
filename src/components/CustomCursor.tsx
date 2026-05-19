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
  const dotRef = useRef<HTMLSpanElement | null>(null)
  const hoverRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (!canUseCustomCursor()) {
      return
    }

    const root = document.documentElement
    const body = document.body
    const cursor = cursorRef.current
    const dot = dotRef.current
    const hover = hoverRef.current

    if (!cursor || !dot || !hover) {
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

      gsap.to(dot, {
        opacity: interest ? 0 : 1,
        scale: interest ? 0.35 : 1,
        duration: 0.18,
        ease: 'power3.out',
        overwrite: true,
      })

      gsap.to(hover, {
        width: interest ? 68 : 11,
        height: interest ? 68 : 11,
        backgroundColor: '#39ff14',
        opacity: interest ? 1 : 0,
        duration: 0.22,
        ease: 'power3.out',
        overwrite: true,
      })

      hover.style.mixBlendMode = interest ? 'difference' : 'normal'
      hover.style.setProperty('--cursor-hover-blend-opacity', interest ? '0.92' : '0')
      hover.style.setProperty('--cursor-hover-blend-scale', interest ? '1.28' : '1')
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
      opacity: 1,
    })
    gsap.set(dot, {
      width: 11,
      height: 11,
      backgroundColor: '#ff00b8',
      opacity: 1,
      scale: 1,
    })
    gsap.set(hover, {
      width: 11,
      height: 11,
      backgroundColor: '#39ff14',
      opacity: 0,
    })
    hover.style.mixBlendMode = 'normal'
    hover.style.setProperty('--cursor-hover-blend-opacity', '0')
    hover.style.setProperty('--cursor-hover-blend-scale', '1')

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
      gsap.killTweensOf(dot)
      gsap.killTweensOf(hover)
      root.classList.remove('has-custom-cursor')
      body.classList.remove('has-custom-cursor', 'custom-cursor-interest')
    }
  }, [])

  return (
    <span
      aria-hidden="true"
      className="custom-cursor"
      ref={cursorRef}
    >
      <span className="custom-cursor__dot" ref={dotRef} />
      <span className="custom-cursor__hover" ref={hoverRef} />
    </span>
  )
}

export default CustomCursor
