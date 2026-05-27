import { useEffect, type RefObject } from 'react'
import { initScrollMotion, type ScrollMotionOptions } from './scrollMotion'

export function useScrollMotion(scope: RefObject<HTMLElement | null>, options?: ScrollMotionOptions) {
  useEffect(() => {
    const root = scope.current

    if (!root) {
      return
    }

    const context = initScrollMotion(root, options)
    return () => context.revert()
  }, [scope, options])
}
