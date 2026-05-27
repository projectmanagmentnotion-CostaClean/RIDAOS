import { useMemo } from 'react'
import { useScrollMotion } from '../../../motion/useScrollMotion'
import { productMotionSelectors } from '../../../motion/motionSelectors'
import { productDetailMotionTokens } from './productDetailMotionTokens'

export function useProductExperienceMotion(scope: React.RefObject<HTMLElement | null>) {
  const options = useMemo(
    () => ({
      heroSelector: productMotionSelectors.hero,
      revealSelector: productMotionSelectors.reveal,
      panelSelector: productMotionSelectors.panel,
      parallaxSelector: productMotionSelectors.parallax,
      overlaySelector: productMotionSelectors.overlay,
      heroStart: 'top 90%',
      revealStart: productDetailMotionTokens.revealStart,
      panelStart: 'top 92%',
      revealOnce: true,
      panelOnce: true,
      revealStagger: 0.06,
      panelStagger: 0.08,
      parallaxStrength: productDetailMotionTokens.parallaxStrength,
      parallaxScrub: productDetailMotionTokens.desktopScrub,
    }),
    [],
  )

  useScrollMotion(scope, options)
}
