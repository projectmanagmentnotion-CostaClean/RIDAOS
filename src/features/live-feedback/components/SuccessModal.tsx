import { useEffect, useRef } from 'react'
import { useLiveFeedbackStore } from '../store/useLiveFeedbackStore'

export function SuccessModal() {
  const modal = useLiveFeedbackStore((state) => state.successModal)
  const closeModal = useLiveFeedbackStore((state) => state.closeSuccessModal)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!modal.open) {
      return
    }

    buttonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        void modal.onClose?.()
        closeModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeModal, modal])

  if (!modal.open) {
    return null
  }

  return (
    <div className="live-dialog-backdrop" role="presentation">
      <div aria-modal="true" className="live-dialog live-dialog--success" role="dialog">
        <div className="live-dialog__copy">
          <p className="section-label">Confirmado</p>
          <h2>{modal.title}</h2>
          {modal.description ? <p>{modal.description}</p> : null}
        </div>
        <div className="live-dialog__actions">
          <button
            className="action-button"
            onClick={() => {
              void modal.onClose?.()
              closeModal()
            }}
            ref={buttonRef}
            type="button"
          >
            {modal.ctaLabel ?? 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  )
}
