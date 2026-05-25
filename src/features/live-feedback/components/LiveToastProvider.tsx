import type { PropsWithChildren } from 'react'
import { ConfirmationDialog } from './ConfirmationDialog'
import { LiveToastViewport } from './LiveToastViewport'
import { SuccessModal } from './SuccessModal'

export function LiveToastProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <LiveToastViewport />
      <ConfirmationDialog />
      <SuccessModal />
    </>
  )
}
