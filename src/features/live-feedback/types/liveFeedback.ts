export type LiveToastTone = 'success' | 'info' | 'warning' | 'error' | 'progress'

export type LiveToastAction = {
  label: string
  onAction: () => void | Promise<void>
}

export type LiveToast = {
  id: string
  tone: LiveToastTone
  title: string
  description?: string
  durationMs?: number
  dismissible?: boolean
  action?: LiveToastAction
  createdAt: number
}

export type LiveToastInput = Omit<LiveToast, 'id' | 'createdAt'>

export type ConfirmationDialogIntent = 'default' | 'danger' | 'success'

export type ConfirmationDialogAction = {
  label: string
  intent?: ConfirmationDialogIntent
}

export type ConfirmationDialogState = {
  open: boolean
  title: string
  description?: string
  confirm: ConfirmationDialogAction
  cancelLabel: string
  intent: ConfirmationDialogIntent
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
}

export type ConfirmationDialogInput = Omit<ConfirmationDialogState, 'open'>

export type SuccessModalState = {
  open: boolean
  title: string
  description?: string
  ctaLabel?: string
  onClose?: () => void | Promise<void>
}

export type SuccessModalInput = Omit<SuccessModalState, 'open'>

export type LiveFeedbackSnapshot = {
  toasts: LiveToast[]
  dialog: ConfirmationDialogState
  successModal: SuccessModalState
}
