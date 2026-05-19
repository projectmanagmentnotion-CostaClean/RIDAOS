import { useEffect } from 'react'
import type { RefObject } from 'react'
import type { CinematicSceneDefinition } from './cinematic.types'

type UseCinematicScrollArgs = {
  scopeRef: RefObject<HTMLElement | null>
  overlayRef: RefObject<HTMLDivElement | null>
  scenes: CinematicSceneDefinition[]
}

function canUseCinematicScroll() {
  return (
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function useCinematicScroll({ scopeRef, overlayRef, scenes }: UseCinematicScrollArgs) {
  useEffect(() => {
    if (!canUseCinematicScroll()) {
      return
    }

    const scope = scopeRef.current
    const overlay = overlayRef.current

    if (!scope || !overlay) {
      return
    }

    let disposed = false
    let teardown: (() => void) | undefined

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (disposed) {
        return
      }

      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia()

        mm.add(
          {
            desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
            tablet:
              '(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)',
            mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
            reduce: '(prefers-reduced-motion: reduce)',
          },
          (context) => {
            if (context.conditions?.reduce) {
              return undefined
            }

            const isDesktop = Boolean(context.conditions?.desktop)
            const isTablet = Boolean(context.conditions?.tablet)
            const motionScale = isDesktop ? 1 : isTablet ? 0.72 : 0.42

            gsap.set(overlay, {
              autoAlpha: 1,
            })

            scenes.forEach((scene, index) => {
              const zone = scope.querySelector<HTMLElement>(`[data-zone="${scene.triggerZoneId}"]`)
              const sceneEl = overlay.querySelector<HTMLElement>(`[data-scene="${scene.id}"]`)
              const orb = sceneEl?.querySelector<HTMLElement>('[data-cinematic-layer="orb"]')
              const placeholder = sceneEl?.querySelector<HTMLElement>('[data-cinematic-layer="placeholder"]')
              const shimmer = sceneEl?.querySelector<HTMLElement>('[data-cinematic-layer="shimmer"]')

              if (!zone || !sceneEl) {
                return
              }

              gsap.set(sceneEl, {
                autoAlpha: isDesktop ? 0.5 : 0.36,
                scale: 0.96,
                xPercent: 0,
                yPercent: 0,
              })

              gsap.to(sceneEl, {
                autoAlpha: isDesktop ? 0.9 : 0.64,
                scale: 1 + scene.depth * 0.12 * motionScale,
                xPercent: (index % 2 === 0 ? 10 : -10) * motionScale,
                yPercent: -12 * motionScale,
                ease: 'none',
                scrollTrigger: {
                  trigger: zone,
                  start: 'top 90%',
                  end: 'bottom 18%',
                  scrub: isDesktop ? 0.7 : 0.45,
                },
              })

              if (orb) {
                gsap.fromTo(
                  orb,
                  {
                    scale: 0.84,
                    autoAlpha: 0.18,
                    rotate: index % 2 === 0 ? -4 : 4,
                  },
                  {
                    scale: 1.16,
                    autoAlpha: isDesktop ? 0.36 : 0.24,
                    rotate: index % 2 === 0 ? 8 : -8,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: zone,
                      start: 'top bottom',
                      end: 'bottom top',
                      scrub: isDesktop ? 0.9 : 0.55,
                    },
                  },
                )
              }

              if (placeholder) {
                gsap.fromTo(
                  placeholder,
                  {
                    scale: 0.92,
                    rotate: (index % 2 === 0 ? -5 : 5) * motionScale,
                    yPercent: 8 * motionScale,
                  },
                  {
                    scale: 1.02 + scene.depth * 0.08,
                    rotate: (index % 2 === 0 ? 3 : -3) * motionScale,
                    yPercent: -6 * motionScale,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: zone,
                      start: 'top 88%',
                      end: 'bottom 24%',
                      scrub: isDesktop ? 0.75 : 0.5,
                    },
                  },
                )
              }

              if (shimmer && isDesktop) {
                gsap.fromTo(
                  shimmer,
                  {
                    xPercent: -110,
                    autoAlpha: 0.12,
                  },
                  {
                    xPercent: 120,
                    autoAlpha: 0.42,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: zone,
                      start: 'top 94%',
                      end: 'bottom 12%',
                      scrub: 0.65,
                    },
                  },
                )
              }
            })

            return undefined
          },
        )

        teardown = () => {
          mm.revert()
        }
      }, scope)

      teardown = () => {
        ctx.revert()
      }
    })()

    return () => {
      disposed = true
      teardown?.()
    }
  }, [overlayRef, scopeRef, scenes])
}
