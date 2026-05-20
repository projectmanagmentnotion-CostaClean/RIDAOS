import { useContext } from 'react'
import { CmsPreviewContext } from '../providers/CmsPreviewContext'

export function useCmsPreview() {
  const context = useContext(CmsPreviewContext)

  if (!context) {
    throw new Error('useCmsPreview must be used inside CmsPreviewProvider.')
  }

  return context
}
