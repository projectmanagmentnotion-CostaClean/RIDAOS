import { useEffect } from 'react'
import type { LiveToast as LiveToastModel } from '../types/liveFeedback'

type LiveToastProps = {
  toast: LiveToastModel
  onDismiss: (id: string) => void
}

export function LiveToast({ toast, onDismiss }: LiveToastProps) {
  useEffect(() => {
    if (!toast.durationMs || toast.durationMs <= 0) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss(toast.id)
    }, toast.durationMs)

    return () => window.clearTimeout(timeoutId)
  }, [onDismiss, toast.durationMs, toast.id])

  return (
    <article
      aria-live="polite"
      className={`live-toast live-toast--${toast.tone}`}
      role={toast.tone === 'error' ? 'alert' : 'status'}
    >
      <div className="live-toast__meta">
        <strong>{toast.title}</strong>
        {toast.description ? <p>{toast.description}</p> : null}
      </div>
      <div className="live-toast__actions">
        {toast.action ? (
          <button
            className="action-button action-button-muted action-button-small"
            onClick={() => {
              void toast.action?.onAction()
              onDismiss(toast.id)
            }}
            type="button"
          >
            {toast.action.label}
          </button>
        ) : null}
        {toast.dismissible ? (
          <button
            aria-label="Cerrar aviso"
            className="live-toast__dismiss"
            onClick={() => onDismiss(toast.id)}
            type="button"
          >
            x
          </button>
        ) : null}
      </div>
    </article>
  )
}
