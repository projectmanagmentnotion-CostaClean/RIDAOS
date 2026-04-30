import Lenis from 'lenis'

type SmoothScrollController = {
  destroy: () => void
  scrollToTop: (immediate?: boolean) => void
  isReducedMotion: () => boolean
}

let lenisInstance: Lenis | null = null
let animationFrameId: number | null = null
let mediaQuery: MediaQueryList | null = null

export function getLenisInstance() {
  return lenisInstance
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const stopAnimationFrame = () => {
  if (animationFrameId !== null) {
    window.cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

const destroyLenis = () => {
  stopAnimationFrame()

  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}

const nativeScrollToTop = (immediate = false) => {
  window.scrollTo({
    top: 0,
    behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

export function initSmoothScroll(): SmoothScrollController {
  if (typeof window === 'undefined') {
    return {
      destroy: () => {},
      scrollToTop: () => {},
      isReducedMotion: () => true,
    }
  }

  mediaQuery ??= window.matchMedia('(prefers-reduced-motion: reduce)')

  if (prefersReducedMotion()) {
    destroyLenis()

    return {
      destroy: destroyLenis,
      scrollToTop: nativeScrollToTop,
      isReducedMotion: () => true,
    }
  }

  if (!lenisInstance) {
    lenisInstance = new Lenis({
      duration: 1,
      lerp: 0.12,
      smoothWheel: true,
      gestureOrientation: 'vertical',
      wheelMultiplier: 0.95,
      touchMultiplier: 1,
    })

    const raf = (time: number) => {
      lenisInstance?.raf(time)
      animationFrameId = window.requestAnimationFrame(raf)
    }

    animationFrameId = window.requestAnimationFrame(raf)
  }

  return {
    destroy: destroyLenis,
    scrollToTop: (immediate = false) => {
      if (!lenisInstance || immediate || prefersReducedMotion()) {
        nativeScrollToTop(true)
        return
      }

      lenisInstance.scrollTo(0, {
        duration: 0.9,
        immediate: false,
        lock: false,
        force: true,
      })
    },
    isReducedMotion: prefersReducedMotion,
  }
}
