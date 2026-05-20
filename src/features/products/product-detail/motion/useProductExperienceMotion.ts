import { useEffect } from 'react'
import { productDetailMotionTokens } from './productDetailMotionTokens'

export function useProductExperienceMotion(scope: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current

    if (!root || typeof window === 'undefined') {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 760px)').matches

    if (prefersReducedMotion) {
      return
    }

    let ctx: { revert: () => void } | null = null
    let mounted = true

    void (async () => {
      const gsapModule = await import('gsap')
      const scrollTriggerModule = await import('gsap/ScrollTrigger')

      if (!mounted || !root) {
        return
      }

      const gsap = gsapModule.default
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const revealTargets = root.querySelectorAll<HTMLElement>('[data-product-reveal]')
        revealTargets.forEach((target, index) => {
          gsap.fromTo(
            target,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: productDetailMotionTokens.revealDuration,
              ease: 'power3.out',
              delay: index * 0.03,
              scrollTrigger: {
                trigger: target,
                start: productDetailMotionTokens.revealStart,
                once: true,
              },
            },
          )
        })

        if (!isMobile) {
          const depthTargets = root.querySelectorAll<HTMLElement>('[data-product-depth]')
          depthTargets.forEach((target) => {
            const depth = Number(target.dataset.productDepth ?? '0.04')
            gsap.to(target, {
              yPercent: depth * -100,
              ease: 'none',
              scrollTrigger: {
                trigger: target,
                start: 'top bottom',
                end: 'bottom top',
                scrub: productDetailMotionTokens.desktopScrub,
              },
            })
          })
        }
      }, root)
    })()

    return () => {
      mounted = false
      ctx?.revert()
    }
  }, [scope])
}
