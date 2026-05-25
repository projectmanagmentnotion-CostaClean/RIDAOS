import { useLiveFeedbackStore } from '../store/useLiveFeedbackStore'
import type {
  ConfirmationDialogInput,
  LiveToastInput,
  SuccessModalInput,
} from '../types/liveFeedback'

export function pushLiveToast(toast: LiveToastInput) {
  return useLiveFeedbackStore.getState().pushToast(toast)
}

export function removeLiveToast(id: string) {
  useLiveFeedbackStore.getState().removeToast(id)
}

export function openConfirmationDialog(dialog: ConfirmationDialogInput) {
  useLiveFeedbackStore.getState().openDialog(dialog)
}

export function closeConfirmationDialog() {
  useLiveFeedbackStore.getState().closeDialog()
}

export function openSuccessModal(modal: SuccessModalInput) {
  useLiveFeedbackStore.getState().openSuccessModal(modal)
}

export function closeSuccessModal() {
  useLiveFeedbackStore.getState().closeSuccessModal()
}
