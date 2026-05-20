import { createContext } from 'react'
import type { CmsPreviewContextValue } from '../types/cmsPreview'

export const CmsPreviewContext = createContext<CmsPreviewContextValue | null>(null)
