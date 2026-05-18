import { useEffect, useRef } from 'react'

function canUseCursorAssist() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function CursorAssist() {
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    if (!canUseCursorAssist()) {
      return
    }

    const root = document.documentElement
    root.classList.add('has-cursor-assist')
    document.body.classList.add('has-cursor-assist')
    const interactiveSelector = [
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
    const salesSelector = ['[data-cursor="sales"]', '[data-cursor-zone="conversion"]'].join(', ')

    let pointerX = window.innerWidth * 0.5
    let pointerY = window.innerHeight * 0.5
    let blobX = pointerX
    let blobY = pointerY
    let lastPointerX = pointerX
    let lastPointerY = pointerY
    let velocityX = 0
    let velocityY = 0
    let isInteractive = false
    let isSales = false
    let animationFrame = 0
    let lastTickTime = performance.now()
    let lastTrailTime = 0
    const trailLifetime = 360
    const maxTrailParticles = 8
    const trailParticles: Array<{
      age: number
      life: number
      scale: number
      x: number
      y: number
    }> = []

    const syncHoverState = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const nextInteractive = Boolean(element?.closest(interactiveSelector))
      const nextSales = Boolean(element?.closest(salesSelector))

      if (nextInteractive !== isInteractive) {
        isInteractive = nextInteractive
        document.body.classList.toggle('cursor-assist-interactive', isInteractive)
      }

      if (nextSales !== isSales) {
        isSales = nextSales
        document.body.classList.toggle('cursor-assist-sales', isSales)
      }
    }

    const syncTrail = () => {
      for (let index = 0; index < trailRefs.current.length; index += 1) {
        const element = trailRefs.current[index]
        const particle = trailParticles[index]

        if (!element) {
          continue
        }

        if (!particle) {
          element.style.opacity = '0'
          element.style.transform = 'translate3d(-120px, -120px, 0) scale(0.2)'
          continue
        }

        const progress = Math.min(particle.age / particle.life, 1)
        const opacity = Math.max(0, 0.22 * (1 - progress))
        const scale = particle.scale * (1 + progress * 0.22)

        element.style.opacity = opacity.toFixed(3)
        element.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0) scale(${scale.toFixed(3)})`
      }
    }

    const tick = () => {
      const now = performance.now()
      const deltaTime = Math.min(now - lastTickTime, 34)
      lastTickTime = now

      blobX += (pointerX - blobX) * 0.16
      blobY += (pointerY - blobY) * 0.16
      velocityX += (pointerX - lastPointerX - velocityX) * 0.12
      velocityY += (pointerY - lastPointerY - velocityY) * 0.12

      const angle = Math.atan2(velocityY, velocityX || 0.0001) * (180 / Math.PI)
      const velocityMagnitude = Math.min(Math.hypot(velocityX, velocityY), 26)
      const speedRatio = Math.min(velocityMagnitude / 24, 1)
      const stretch = 1 + speedRatio * 0.54
      const squeeze = 1 - speedRatio * 0.28
      const interactiveScale = isInteractive ? 1.18 : 1
      const salesScale = isSales ? 1.18 : 1
      const flowScale = Math.min(interactiveScale * salesScale, 1.52)
      const stillRadius = 50
      const radiusX = stillRadius - speedRatio * 14
      const radiusY = stillRadius + speedRatio * 10
      const trailScale = 0.42 + speedRatio * 0.28
      const trailOffset = Math.min(10 + velocityMagnitude * 0.42, 22)
      const secondaryOffset = Math.min(6 + velocityMagnitude * 0.26, 13)
      const trailOpacity = 0.22 + speedRatio * 0.22
      const particleScale = 0.34 + speedRatio * 0.26
      const shouldSpawnTrail = velocityMagnitude > 2.8 && now - lastTrailTime > 34

      root.style.setProperty('--cursor-pointer-x', `${pointerX}px`)
      root.style.setProperty('--cursor-pointer-y', `${pointerY}px`)
      root.style.setProperty('--cursor-flow-x', `${blobX}px`)
      root.style.setProperty('--cursor-flow-y', `${blobY}px`)
      root.style.setProperty('--cursor-flow-rotation', `${angle}deg`)
      root.style.setProperty('--cursor-flow-stretch', stretch.toFixed(3))
      root.style.setProperty('--cursor-flow-squeeze', squeeze.toFixed(3))
      root.style.setProperty('--cursor-flow-scale', flowScale.toFixed(3))
      root.style.setProperty('--cursor-flow-radius', `${radiusX.toFixed(1)}% ${radiusY.toFixed(1)}% ${radiusX.toFixed(1)}% ${radiusY.toFixed(1)}% / ${radiusY.toFixed(1)}% ${radiusX.toFixed(1)}% ${radiusY.toFixed(1)}% ${radiusX.toFixed(1)}%`)
      root.style.setProperty('--cursor-flow-trail-scale', trailScale.toFixed(3))
      root.style.setProperty('--cursor-flow-trail-offset', `${trailOffset.toFixed(2)}px`)
      root.style.setProperty('--cursor-flow-secondary-offset', `${secondaryOffset.toFixed(2)}px`)
      root.style.setProperty('--cursor-flow-trail-opacity', trailOpacity.toFixed(3))

      if (shouldSpawnTrail) {
        trailParticles.unshift({
          age: 0,
          life: trailLifetime,
          scale: particleScale,
          x: blobX,
          y: blobY,
        })
        lastTrailTime = now

        if (trailParticles.length > maxTrailParticles) {
          trailParticles.length = maxTrailParticles
        }
      }

      for (let index = trailParticles.length - 1; index >= 0; index -= 1) {
        trailParticles[index].age += deltaTime

        if (trailParticles[index].age >= trailParticles[index].life) {
          trailParticles.splice(index, 1)
        }
      }

      syncTrail()

      lastPointerX = pointerX
      lastPointerY = pointerY
      animationFrame = window.requestAnimationFrame(tick)
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      syncHoverState(event.target)
    }

    const handlePointerLeave = () => {
      document.body.classList.remove('cursor-assist-interactive', 'cursor-assist-sales')
      isInteractive = false
      isSales = false
    }

    const handleScrollOrFocus = (event: Event) => {
      syncHoverState(event.target)
    }

    animationFrame = window.requestAnimationFrame(tick)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handleScrollOrFocus, { passive: true })
    document.addEventListener('focusin', handleScrollOrFocus)
    document.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      root.classList.remove('has-cursor-assist')
      document.body.classList.remove('has-cursor-assist', 'cursor-assist-interactive', 'cursor-assist-sales')
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handleScrollOrFocus)
      document.removeEventListener('focusin', handleScrollOrFocus)
      document.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    <div aria-hidden="true" className="cursor-assist" data-cursor-assist="active">
      {Array.from({ length: 8 }, (_, index) => (
        <span
          className="cursor-assist__trail"
          key={`cursor-trail-${index}`}
          ref={(element) => {
            trailRefs.current[index] = element
          }}
        />
      ))}
      <span className="cursor-assist__droplet" />
      <span className="cursor-assist__dot" />
    </div>
  )
}

export default CursorAssist
