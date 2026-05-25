import { useEffect, useRef } from 'react'
import { useLiveFeedbackStore } from '../store/useLiveFeedbackStore'

export function ConfirmationDialog() {
  const dialog = useLiveFeedbackStore((state) => state.dialog)
  const closeDialog = useLiveFeedbackStore((state) => state.closeDialog)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!dialog.open) {
      return
    }

    const previousFocus = document.activeElement as HTMLElement | null
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>('button')
    firstFocusable?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        void dialog.onCancel?.()
        closeDialog()
      }

      if (event.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
        ).filter((element) => !element.hasAttribute('disabled'))

        if (focusable.length === 0) {
          return
        }

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [closeDialog, dialog])

  if (!dialog.open) {
    return null
  }

  return (
    <div className="live-dialog-backdrop" role="presentation">
      <div
        aria-describedby={dialog.description ? 'live-dialog-description' : undefined}
        aria-labelledby="live-dialog-title"
        aria-modal="true"
        className={`live-dialog live-dialog--${dialog.intent}`}
        ref={panelRef}
        role="dialog"
      >
        <div className="live-dialog__copy">
          <p className="section-label">Confirmacion</p>
          <h2 id="live-dialog-title">{dialog.title}</h2>
          {dialog.description ? <p id="live-dialog-description">{dialog.description}</p> : null}
        </div>
        <div className="live-dialog__actions">
          <button
            className="action-button action-button-muted"
            onClick={() => {
              void dialog.onCancel?.()
              closeDialog()
            }}
            type="button"
          >
            {dialog.cancelLabel}
          </button>
          <button
            className={`action-button${dialog.confirm.intent === 'danger' ? ' action-button-danger' : ''}`}
            onClick={() => {
              void dialog.onConfirm?.()
              closeDialog()
            }}
            type="button"
          >
            {dialog.confirm.label}
          </button>
        </div>
      </div>
    </div>
  )
}
