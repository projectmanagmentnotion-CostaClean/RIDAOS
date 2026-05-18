import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  'input',
  'textarea',
  'select',
  '.clickable',
  '[data-cursor="interactive"]',
  '[data-cursor="sales"]',
  '[data-cursor-zone="conversion"]',
].join(', ')

const SALES_SELECTOR = [
  '[data-cursor="sales"]',
  '[data-cursor-zone="conversion"]',
  '.action-button',
  '.catalog-feature-card',
  '.dtf-cockpit-panel',
  '.cart-summary-card',
  '.checkout-summary-card',
].join(', ')

function canUseOilCursor() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function CursorAssist() {
  const dotRef = useRef<HTMLSpanElement | null>(null)
  const dropRef = useRef<HTMLSpanElement | null>(null)
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    if (!canUseOilCursor()) {
      return
    }

    const root = document.documentElement
    const body = document.body
    const dot = dotRef.current
    const drop = dropRef.current

    if (!dot || !drop) {
      return
    }

    const reducedMotion = prefersReducedMotion()
    const trailElements = trailRefs.current.filter((element): element is HTMLSpanElement => Boolean(element))
    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 }
    const follower = { x: pointer.x, y: pointer.y }
    const motion = { scale: 1, stretch: 1, squeeze: 1, rotation: 0, morph: 0 }
    const setters = {
      dotX: gsap.quickSetter(dot, 'x', 'px'),
      dotY: gsap.quickSetter(dot, 'y', 'px'),
      dropX: gsap.quickSetter(drop, 'x', 'px'),
      dropY: gsap.quickSetter(drop, 'y', 'px'),
      dropRotation: gsap.quickSetter(drop, 'rotation', 'deg'),
      dropScaleX: gsap.quickSetter(drop, 'scaleX'),
      dropScaleY: gsap.quickSetter(drop, 'scaleY'),
      dropBorderRadius: gsap.quickSetter(drop, 'borderRadius'),
    }

    let rafId = 0
    let lastFollowerX = follower.x
    let lastFollowerY = follower.y
    let lastTrailTime = 0
    let isInteractive = false
    let isSales = false
    let motionTween: gsap.core.Tween | null = null
    let scaleTween: gsap.core.Tween | null = null
    let trailIndex = 0
    const followEase = reducedMotion ? 0.34 : 0.16

    const setCursorClasses = () => {
      root.classList.add('has-oil-cursor')
      body.classList.add('has-oil-cursor')
      body.classList.toggle('oil-cursor-interactive', isInteractive)
      body.classList.toggle('oil-cursor-sales', isSales)
    }

    const clearCursorClasses = () => {
      root.classList.remove('has-oil-cursor')
      body.classList.remove('has-oil-cursor', 'oil-cursor-interactive', 'oil-cursor-sales')
    }

    const updateTargetScale = () => {
      const targetScale = isSales ? 1.72 : isInteractive ? 1.32 : 1
      scaleTween?.kill()
      scaleTween = gsap.to(motion, {
        scale: targetScale,
        duration: reducedMotion ? 0.16 : 0.24,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    const syncHoverState = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const nextInteractive = Boolean(element?.closest(INTERACTIVE_SELECTOR))
      const nextSales = Boolean(element?.closest(SALES_SELECTOR))

      if (nextInteractive !== isInteractive || nextSales !== isSales) {
        isInteractive = nextInteractive
        isSales = nextSales
        setCursorClasses()
        updateTargetScale()
      }
    }

    const spawnTrail = (directionX: number, directionY: number, speedRatio: number) => {
      if (reducedMotion || trailElements.length === 0) {
        return
      }

      const now = performance.now()

      if (now - lastTrailTime < 30 || speedRatio < 0.14) {
        return
      }

      lastTrailTime = now
      const trail = trailElements[trailIndex % trailElements.length]
      trailIndex += 1
      const offset = 14 + speedRatio * 20
      const startScale = 0.54 + speedRatio * 0.34

      gsap.killTweensOf(trail)
      gsap.set(trail, {
        x: follower.x - directionX * offset,
        y: follower.y - directionY * offset,
        opacity: 0.12 + speedRatio * 0.22,
        scale: startScale,
      })
      gsap.to(trail, {
        opacity: 0,
        scale: startScale * 1.28,
        duration: 0.42,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    const updateDropShape = (speedRatio: number, angle: number) => {
      const targetStretch = reducedMotion ? 1 : 1 + speedRatio * 0.42
      const targetSqueeze = reducedMotion ? 1 : 1 - speedRatio * 0.24
      const targetRotation = reducedMotion ? 0 : angle
      const targetMorph = reducedMotion ? 0 : speedRatio

      motionTween?.kill()
      motionTween = gsap.to(motion, {
        stretch: targetStretch,
        squeeze: targetSqueeze,
        rotation: targetRotation,
        morph: targetMorph,
        duration: reducedMotion ? 0.16 : 0.22,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      setters.dotX(pointer.x)
      setters.dotY(pointer.y)
      syncHoverState(event.target)
    }

    const handlePointerLeave = () => {
      isInteractive = false
      isSales = false
      body.classList.remove('oil-cursor-interactive', 'oil-cursor-sales')
      updateTargetScale()
    }

    const handleHoverSync = (event: Event) => {
      syncHoverState(event.target)
    }

    const render = () => {
      follower.x = gsap.utils.interpolate(follower.x, pointer.x, followEase)
      follower.y = gsap.utils.interpolate(follower.y, pointer.y, followEase)
      const followerDeltaX = follower.x - lastFollowerX
      const followerDeltaY = follower.y - lastFollowerY
      const followerSpeed = Math.min(Math.hypot(followerDeltaX, followerDeltaY), 32)
      const speedRatio = clamp(followerSpeed / 18, 0, 1)
      const angle = Math.atan2(followerDeltaY, followerDeltaX || 0.0001) * (180 / Math.PI)
      const directionX = followerSpeed > 0.001 ? followerDeltaX / followerSpeed : 0
      const directionY = followerSpeed > 0.001 ? followerDeltaY / followerSpeed : 0
      const radius = speedRatio > 0.42
        ? '42% 58% 47% 53% / 59% 41% 56% 44%'
        : speedRatio > 0.12
          ? '48% 52% 45% 55% / 55% 45% 52% 48%'
          : '50%'

      updateDropShape(speedRatio, angle)
      setters.dropX(follower.x)
      setters.dropY(follower.y)
      setters.dropRotation(motion.rotation)
      setters.dropScaleX(Number((motion.scale * motion.stretch).toFixed(4)))
      setters.dropScaleY(Number((motion.scale * motion.squeeze).toFixed(4)))
      setters.dropBorderRadius(radius)
      drop.style.setProperty('--cursor-oil-tail-offset', `${12 + speedRatio * 16}px`)
      drop.style.setProperty('--cursor-oil-tail-scale', (0.48 + speedRatio * 0.34).toFixed(3))
      drop.style.setProperty('--cursor-oil-tail-opacity', (0.18 + speedRatio * 0.24).toFixed(3))
      drop.style.setProperty('--cursor-oil-secondary-offset', `${6 + speedRatio * 10}px`)
      spawnTrail(directionX, directionY, speedRatio)

      lastFollowerX = follower.x
      lastFollowerY = follower.y
      rafId = window.requestAnimationFrame(render)
    }

    gsap.set(dot, { xPercent: -50, yPercent: -50 })
    gsap.set(drop, { xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' })
    gsap.set(trailElements, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.5 })
    setters.dotX(pointer.x)
    setters.dotY(pointer.y)
    setters.dropX(follower.x)
    setters.dropY(follower.y)
    setCursorClasses()
    updateTargetScale()

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handleHoverSync, { passive: true })
    document.addEventListener('pointerover', handleHoverSync, { passive: true })
    document.addEventListener('focusin', handleHoverSync)
    document.addEventListener('pointerleave', handlePointerLeave)
    rafId = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handleHoverSync)
      document.removeEventListener('pointerover', handleHoverSync)
      document.removeEventListener('focusin', handleHoverSync)
      document.removeEventListener('pointerleave', handlePointerLeave)
      motionTween?.kill()
      scaleTween?.kill()
      gsap.killTweensOf(trailElements)
      clearCursorClasses()
    }
  }, [])

  return (
    <div aria-hidden="true" className="oil-cursor-root">
      {Array.from({ length: 6 }, (_, index) => (
        <span
          className="cursor-oil-trail"
          key={`oil-cursor-trail-${index}`}
          ref={(element) => {
            trailRefs.current[index] = element
          }}
        />
      ))}
      <span className="cursor-oil-drop" ref={dropRef} />
      <span className="cursor-precision-dot" ref={dotRef} />
    </div>
  )
}

export default CursorAssist
