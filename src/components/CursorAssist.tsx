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

    let previousX = window.innerWidth * 0.5
    let previousY = window.innerHeight * 0.5
    let frame = 0

    const handlePointerMove = (event: PointerEvent) => {
      const nextX = event.clientX
      const nextY = event.clientY
      const deltaX = nextX - previousX
      const deltaY = nextY - previousY
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      const speed = Math.min(Math.hypot(deltaX, deltaY), 48)

      previousX = nextX
      previousY = nextY

      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      frame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--cursor-assist-x', `${nextX}px`)
        document.documentElement.style.setProperty('--cursor-assist-y', `${nextY}px`)
        document.documentElement.style.setProperty('--cursor-droplet-rotation', `${angle}deg`)
        document.documentElement.style.setProperty('--cursor-droplet-stretch', String(1 + speed / 420))
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      document.body.classList.remove('has-cursor-assist')
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      window.removeEventListener('pointermove', handlePointerMove)
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
