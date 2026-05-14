import { useEffect, useRef } from 'react'

type MouseMotionVisualProps = {
  className?: string
  variant?: 'dtf' | 'catalog' | 'portfolio'
}

function canUseMotionVisual() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function MouseMotionVisual({ className, variant = 'dtf' }: MouseMotionVisualProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current

    if (!root || !canUseMotionVisual()) {
      return
    }

    let frame = 0

    const handlePointerMove = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5

        root.style.setProperty('--motion-x', x.toFixed(3))
        root.style.setProperty('--motion-y', y.toFixed(3))
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className={className ? `mouse-motion-visual mouse-motion-visual--${variant} ${className}` : `mouse-motion-visual mouse-motion-visual--${variant}`}
      ref={rootRef}
    >
      <span className="mouse-motion-visual__plate mouse-motion-visual__plate--primary" />
      <span className="mouse-motion-visual__plate mouse-motion-visual__plate--secondary" />
      <span className="mouse-motion-visual__line mouse-motion-visual__line--one" />
      <span className="mouse-motion-visual__line mouse-motion-visual__line--two" />
    </div>
  )
}

export default MouseMotionVisual
