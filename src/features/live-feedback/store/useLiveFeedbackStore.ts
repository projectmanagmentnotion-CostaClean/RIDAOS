import { create } from 'zustand'
import type {
  ConfirmationDialogInput,
  ConfirmationDialogState,
  LiveToast,
  LiveToastInput,
  SuccessModalInput,
  SuccessModalState,
} from '../types/liveFeedback'

const defaultDialogState: ConfirmationDialogState = {
  open: false,
  title: '',
  description: '',
  confirm: { label: 'Confirmar', intent: 'default' },
  cancelLabel: 'Cancelar',
  intent: 'default',
}

const defaultSuccessModalState: SuccessModalState = {
  open: false,
  title: '',
  description: '',
  ctaLabel: 'Cerrar',
}

type LiveFeedbackStore = {
  toasts: LiveToast[]
  dialog: ConfirmationDialogState
  successModal: SuccessModalState
  pushToast: (toast: LiveToastInput) => string
  dismissToast: (id: string) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  openDialog: (dialog: ConfirmationDialogInput) => void
  closeDialog: () => void
  openSuccessModal: (modal: SuccessModalInput) => void
  closeSuccessModal: () => void
}

export const useLiveFeedbackStore = create<LiveFeedbackStore>((set) => ({
  toasts: [],
  dialog: defaultDialogState,
  successModal: defaultSuccessModalState,
  pushToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          createdAt: Date.now(),
          dismissible: toast.dismissible ?? true,
          durationMs: toast.durationMs ?? (toast.tone === 'progress' ? 0 : 3600),
          ...toast,
        },
      ],
    }))
    return id
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              durationMs: 0,
              dismissible: false,
            }
          : toast,
      ),
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
  openDialog: (dialog) =>
    set({
      dialog: {
        ...defaultDialogState,
        ...dialog,
        open: true,
      },
    }),
  closeDialog: () =>
    set({
      dialog: defaultDialogState,
    }),
  openSuccessModal: (modal) =>
    set({
      successModal: {
        ...defaultSuccessModalState,
        ...modal,
        open: true,
      },
    }),
  closeSuccessModal: () =>
    set({
      successModal: defaultSuccessModalState,
    }),
}))
