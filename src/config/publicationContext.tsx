import { createContext, useContext } from 'react'
import type { PublicationPolicy } from './publicationPolicy.mjs'

export const PublicationContext = createContext<PublicationPolicy>({
  isPublicLaunch: false,
  dtiOnlyMode: false,
  publishedProductCodes: [],
})

export function usePublicationPolicy() {
  return useContext(PublicationContext)
}
