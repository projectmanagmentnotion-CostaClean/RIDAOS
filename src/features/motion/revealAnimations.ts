import { initPanelAnimations, initRevealAnimations } from '../../lib/animations'

export function initStorefrontRevealAnimations(scope: HTMLElement) {
  const revealContext = initRevealAnimations(scope)
  const panelContext = initPanelAnimations(scope)

  return {
    revert() {
      revealContext.revert()
      panelContext.revert()
    },
  }
}
