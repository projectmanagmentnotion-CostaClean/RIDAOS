import { useLiveFeedbackStore } from '../store/useLiveFeedbackStore'
import { LiveToast } from './LiveToast'

export function LiveToastViewport() {
  const toasts = useLiveFeedbackStore((state) => state.toasts)
  const removeToast = useLiveFeedbackStore((state) => state.removeToast)

  return (
    <div aria-atomic="true" aria-live="polite" className="live-toast-viewport">
      {toasts.map((toast) => (
        <LiveToast key={toast.id} onDismiss={removeToast} toast={toast} />
      ))}
    </div>
  )
}
