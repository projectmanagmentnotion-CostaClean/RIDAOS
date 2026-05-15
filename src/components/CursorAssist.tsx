import { useEffect } from 'react'

function canUseCursorAssist() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function CursorAssist() {
  useEffect(() => {
    if (!canUseCursorAssist()) {
      return
    }

    document.body.classList.add('has-cursor-assist')
    const root = document.documentElement
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

    const tick = () => {
      blobX += (pointerX - blobX) * 0.16
      blobY += (pointerY - blobY) * 0.16
      velocityX += (pointerX - lastPointerX - velocityX) * 0.12
      velocityY += (pointerY - lastPointerY - velocityY) * 0.12

      const angle = Math.atan2(velocityY, velocityX || 0.0001) * (180 / Math.PI)
      const velocityMagnitude = Math.min(Math.hypot(velocityX, velocityY), 26)
      const stretch = 1 + velocityMagnitude / 120
      const interactiveScale = isInteractive ? 1.08 : 1
      const salesScale = isSales ? 1.18 : 1
      const jellyScale = Math.min(interactiveScale * salesScale, 1.28)

      root.style.setProperty('--cursor-pointer-x', `${pointerX}px`)
      root.style.setProperty('--cursor-pointer-y', `${pointerY}px`)
      root.style.setProperty('--cursor-blob-x', `${blobX}px`)
      root.style.setProperty('--cursor-blob-y', `${blobY}px`)
      root.style.setProperty('--cursor-droplet-rotation', `${angle}deg`)
      root.style.setProperty('--cursor-droplet-stretch', stretch.toFixed(3))
      root.style.setProperty('--cursor-jelly-scale', jellyScale.toFixed(3))

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
      <span className="cursor-assist__droplet" />
      <span className="cursor-assist__glow" />
      <span className="cursor-assist__ring" />
      <span className="cursor-assist__dot" />
    </div>
  )
}

export default CursorAssist
