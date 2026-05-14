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

    const handlePointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--cursor-assist-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--cursor-assist-y', `${event.clientY}px`)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      document.body.classList.remove('has-cursor-assist')
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  return (
    <div aria-hidden="true" className="cursor-assist">
      <span className="cursor-assist__ring" />
      <span className="cursor-assist__dot" />
    </div>
  )
}

export default CursorAssist
