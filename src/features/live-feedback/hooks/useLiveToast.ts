import { useCallback } from 'react'
import { useLiveFeedbackStore } from '../store/useLiveFeedbackStore'
import type {
  ConfirmationDialogInput,
  LiveToastInput,
  SuccessModalInput,
} from '../types/liveFeedback'

export function useLiveToast() {
  const pushToast = useLiveFeedbackStore((state) => state.pushToast)
  const removeToast = useLiveFeedbackStore((state) => state.removeToast)
  const openDialog = useLiveFeedbackStore((state) => state.openDialog)
  const closeDialog = useLiveFeedbackStore((state) => state.closeDialog)
  const openSuccess = useLiveFeedbackStore((state) => state.openSuccessModal)
  const closeSuccess = useLiveFeedbackStore((state) => state.closeSuccessModal)

  const toast = useCallback((input: LiveToastInput) => pushToast(input), [pushToast])
  const success = useCallback(
    (title: string, description?: string, durationMs = 2800) =>
      pushToast({ tone: 'success', title, description, durationMs }),
    [pushToast],
  )
  const info = useCallback(
    (title: string, description?: string, durationMs = 2400) =>
      pushToast({ tone: 'info', title, description, durationMs }),
    [pushToast],
  )
  const warning = useCallback(
    (title: string, description?: string, durationMs = 3200) =>
      pushToast({ tone: 'warning', title, description, durationMs }),
    [pushToast],
  )
  const error = useCallback(
    (title: string, description?: string, durationMs = 3800) =>
      pushToast({ tone: 'error', title, description, durationMs }),
    [pushToast],
  )
  const progress = useCallback(
    (title: string, description?: string) =>
      pushToast({ tone: 'progress', title, description, durationMs: 0, dismissible: false }),
    [pushToast],
  )

  const confirm = useCallback((dialog: ConfirmationDialogInput) => openDialog(dialog), [openDialog])
  const showSuccessModal = useCallback((modal: SuccessModalInput) => openSuccess(modal), [openSuccess])

  return {
    toast,
    success,
    info,
    warning,
    error,
    progress,
    dismiss: removeToast,
    confirm,
    closeDialog,
    showSuccessModal,
    closeSuccess,
  }
}
