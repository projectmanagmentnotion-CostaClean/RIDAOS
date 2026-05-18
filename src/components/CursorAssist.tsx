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
    let lastPointerX = pointer.x
    let lastPointerY = pointer.y
    let lastTrailTime = 0
    let isInteractive = false
    let isSales = false
    let followerTweenX: gsap.core.Tween | null = null
    let followerTweenY: gsap.core.Tween | null = null
    let motionTween: gsap.core.Tween | null = null
    let scaleTween: gsap.core.Tween | null = null
    let trailIndex = 0

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

      if (now - lastTrailTime < 42 || speedRatio < 0.18) {
        return
      }

      lastTrailTime = now
      const trail = trailElements[trailIndex % trailElements.length]
      trailIndex += 1
      const offset = 10 + speedRatio * 16
      const startScale = 0.58 + speedRatio * 0.3

      gsap.killTweensOf(trail)
      gsap.set(trail, {
        x: follower.x - directionX * offset,
        y: follower.y - directionY * offset,
        opacity: 0.22 + speedRatio * 0.16,
        scale: startScale,
      })
      gsap.to(trail, {
        opacity: 0,
        scale: startScale * 1.18,
        duration: 0.34,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const updateDropShape = (speedRatio: number, angle: number) => {
      const targetStretch = reducedMotion ? 1 : 1 + speedRatio * 0.34
      const targetSqueeze = reducedMotion ? 1 : 1 - speedRatio * 0.2
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

      followerTweenX?.kill()
      followerTweenY?.kill()
      followerTweenX = gsap.to(follower, {
        x: pointer.x,
        duration: reducedMotion ? 0.12 : 0.28,
        ease: 'power3.out',
        overwrite: true,
      })
      followerTweenY = gsap.to(follower, {
        y: pointer.y,
        duration: reducedMotion ? 0.12 : 0.28,
        ease: 'power3.out',
        overwrite: true,
      })
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
      const deltaX = pointer.x - lastPointerX
      const deltaY = pointer.y - lastPointerY
      const speed = Math.min(Math.hypot(deltaX, deltaY), 32)
      const speedRatio = clamp(speed / 24, 0, 1)
      const angle = Math.atan2(deltaY, deltaX || 0.0001) * (180 / Math.PI)
      const directionX = speed > 0.001 ? deltaX / speed : 0
      const directionY = speed > 0.001 ? deltaY / speed : 0
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
      spawnTrail(directionX, directionY, speedRatio)

      lastPointerX = pointer.x
      lastPointerY = pointer.y
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
      followerTweenX?.kill()
      followerTweenY?.kill()
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
