import { initScrollMotion } from './scrollMotion'
import { storefrontMotionSelectors } from './motionSelectors'

export function initStorefrontRevealAnimations(scope: HTMLElement) {
  return initScrollMotion(scope, {
    heroSelector: storefrontMotionSelectors.hero,
    revealSelector: storefrontMotionSelectors.reveal,
    panelSelector: storefrontMotionSelectors.panel,
    parallaxSelector: storefrontMotionSelectors.parallax,
    overlaySelector: storefrontMotionSelectors.overlay,
    revealStagger: 0.08,
    panelStagger: 0.1,
    parallaxStrength: 6,
    parallaxScrub: 0.85,
  })
}
