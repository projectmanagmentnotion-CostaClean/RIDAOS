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
  const dropRef = useRef<HTMLSpanElement | null>(null)
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    if (!canUseOilCursor()) {
      return
    }

    const root = document.documentElement
    const body = document.body
    const drop = dropRef.current

    if (!drop) {
      return
    }

    const reducedMotion = prefersReducedMotion()
    const trailElements = trailRefs.current.filter((element): element is HTMLSpanElement => Boolean(element))
    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 }
    const follower = { x: pointer.x, y: pointer.y }
    const motion = { scale: 1, stretch: 1, squeeze: 1, rotation: 0, morph: 0, opacity: 1 }
    const setters = {
      dropX: gsap.quickSetter(drop, 'x', 'px'),
      dropY: gsap.quickSetter(drop, 'y', 'px'),
      dropRotation: gsap.quickSetter(drop, 'rotation', 'deg'),
      dropScaleX: gsap.quickSetter(drop, 'scaleX'),
      dropScaleY: gsap.quickSetter(drop, 'scaleY'),
      dropBorderRadius: gsap.quickSetter(drop, 'borderRadius'),
      dropOpacity: gsap.quickSetter(drop, 'opacity'),
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
      const targetScale = isSales ? 1.78 : isInteractive ? 1.36 : 1
      scaleTween?.kill()
      scaleTween = gsap.to(motion, {
        scale: targetScale,
        opacity: isSales ? 0.98 : isInteractive ? 0.94 : 0.9,
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
      const offset = 18 + speedRatio * 24
      const angle = Math.atan2(directionY, directionX || 0.0001) * (180 / Math.PI)
      const startScaleX = 0.94 + speedRatio * 0.86
      const startScaleY = 0.28 + speedRatio * 0.18
      const drift = 24 + speedRatio * 34

      gsap.killTweensOf(trail)
      gsap.set(trail, {
        x: follower.x - directionX * offset,
        y: follower.y - directionY * offset,
        opacity: 0.08 + speedRatio * 0.16,
        scaleX: startScaleX,
        scaleY: startScaleY,
        rotation: angle,
      })
      gsap.to(trail, {
        x: follower.x - directionX * (offset + drift),
        y: follower.y - directionY * (offset + drift),
        opacity: 0,
        scaleX: startScaleX * 0.72,
        scaleY: startScaleY * 0.64,
        duration: 0.52,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    const updateDropShape = (speedRatio: number, angle: number) => {
      const targetStretch = reducedMotion ? 1 : 1 + speedRatio * 0.48
      const targetSqueeze = reducedMotion ? 1 : 1 - speedRatio * 0.26
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
      const speedRatio = clamp(followerSpeed / 16, 0, 1)
      const angle = Math.atan2(followerDeltaY, followerDeltaX || 0.0001) * (180 / Math.PI)
      const directionX = followerSpeed > 0.001 ? followerDeltaX / followerSpeed : 0
      const directionY = followerSpeed > 0.001 ? followerDeltaY / followerSpeed : 0
      const radius = speedRatio > 0.42
        ? '40% 60% 46% 54% / 61% 39% 58% 42%'
        : speedRatio > 0.12
          ? '47% 53% 44% 56% / 57% 43% 53% 47%'
          : '50%'

      updateDropShape(speedRatio, angle)
      setters.dropX(follower.x)
      setters.dropY(follower.y)
      setters.dropRotation(motion.rotation)
      setters.dropScaleX(Number((motion.scale * motion.stretch).toFixed(4)))
      setters.dropScaleY(Number((motion.scale * motion.squeeze).toFixed(4)))
      setters.dropBorderRadius(radius)
      setters.dropOpacity(Number(motion.opacity.toFixed(3)))
      drop.style.setProperty('--cursor-oil-tail-offset', `${14 + speedRatio * 18}px`)
      drop.style.setProperty('--cursor-oil-tail-scale', (0.54 + speedRatio * 0.38).toFixed(3))
      drop.style.setProperty('--cursor-oil-tail-opacity', (0.16 + speedRatio * 0.22).toFixed(3))
      drop.style.setProperty('--cursor-oil-secondary-offset', `${8 + speedRatio * 12}px`)
      drop.style.setProperty('--cursor-oil-core-scale', (0.42 + speedRatio * 0.08).toFixed(3))
      drop.style.setProperty('--cursor-oil-core-opacity', (0.1 + speedRatio * 0.08).toFixed(3))
      spawnTrail(directionX, directionY, speedRatio)

      lastFollowerX = follower.x
      lastFollowerY = follower.y
      rafId = window.requestAnimationFrame(render)
    }

    gsap.set(drop, { xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' })
    gsap.set(trailElements, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.5 })
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
      {Array.from({ length: 8 }, (_, index) => (
        <span
          className="cursor-oil-trail"
          key={`oil-cursor-trail-${index}`}
          ref={(element) => {
            trailRefs.current[index] = element
          }}
        />
      ))}
      <span className="cursor-oil-drop" ref={dropRef} />
    </div>
  )
}

export default CursorAssist
