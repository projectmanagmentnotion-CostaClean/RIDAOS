import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { syncScrollTriggerWithLenis } from '../../lib/animations'

type ScrollMotionOptions = {
  heroSelector?: string
  revealSelector?: string
  panelSelector?: string
  parallaxSelector?: string
  overlaySelector?: string
  heroStart?: string
  revealStart?: string
  panelStart?: string
  revealOnce?: boolean
  panelOnce?: boolean
  revealStagger?: number
  panelStagger?: number
  parallaxStrength?: number
  parallaxScrub?: number
}

let pluginsRegistered = false

function ensurePlugins() {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    pluginsRegistered = true
  }
}

function noopContext() {
  return {
    revert() {},
  }
}

function getVisibleElements(scope: HTMLElement, selector?: string) {
  if (!selector) {
    return [] as HTMLElement[]
  }

  return gsap.utils
    .toArray<HTMLElement>(selector, scope)
    .filter((element, index, list) => list.indexOf(element) === index && element.offsetParent !== null)
}

function getHeroChildren(hero: HTMLElement) {
  return Array.from(
    hero.querySelectorAll<HTMLElement>(
      '.section-label, .eyebrow, h1, h2, .section-copy, .product-visual-hero__claim, .catalog-cta-row, .storefront-inline-tags, .storefront-catalog-hero__chips, .hero-orbit-stack, .hero-orbit-line, .product-visual-hero__benefit, .storefront-family-visual',
    ),
  ).filter((element, index, list) => list.indexOf(element) === index && element.offsetParent !== null)
}

function resetVisibleState(scope: HTMLElement, selectors: Array<string | undefined>) {
  const targets = selectors.flatMap((selector) => getVisibleElements(scope, selector))

  if (!targets.length) {
    return
  }

  gsap.set(targets, {
    clearProps: 'all',
    autoAlpha: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    yPercent: 0,
    xPercent: 0,
  })
}

export function initScrollMotion(scope: HTMLElement, options: ScrollMotionOptions = {}) {
  if (typeof window === 'undefined') {
    return noopContext()
  }

  ensurePlugins()
  syncScrollTriggerWithLenis()

  return gsap.context(() => {
    const media = gsap.matchMedia()

    media.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 921px)',
      },
      (context) => {
        if (context.conditions?.reduce) {
          resetVisibleState(scope, [
            options.heroSelector,
            options.revealSelector,
            options.panelSelector,
            options.parallaxSelector,
            options.overlaySelector,
          ])
          return undefined
        }

        const heroes = getVisibleElements(scope, options.heroSelector)
        heroes.forEach((hero) => {
          const children = getHeroChildren(hero)

          if (!children.length) {
            return
          }

          gsap.fromTo(
            children,
            {
              autoAlpha: 0,
              y: 34,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.92,
              ease: 'power3.out',
              stagger: 0.08,
              clearProps: 'opacity,transform',
              overwrite: 'auto',
              immediateRender: false,
              scrollTrigger: {
                trigger: hero,
                start: options.heroStart ?? 'top 86%',
                once: true,
              },
            },
          )
        })

        const revealTargets = getVisibleElements(scope, options.revealSelector).filter(
          (element) => !element.matches(options.heroSelector ?? '__never__'),
        )

        if (revealTargets.length) {
          ScrollTrigger.batch(revealTargets, {
            start: options.revealStart ?? 'top 88%',
            once: options.revealOnce ?? true,
            interval: 0.1,
            batchMax: 6,
            onEnter: (elements) =>
              gsap.fromTo(
                elements,
                {
                  autoAlpha: 0,
                  y: 28,
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.88,
                  ease: 'power3.out',
                  stagger: options.revealStagger ?? 0.08,
                  clearProps: 'opacity,transform',
                  overwrite: 'auto',
                  immediateRender: false,
                },
              ),
            onEnterBack:
              options.revealOnce ?? true
                ? undefined
                : (elements) =>
                    gsap.fromTo(
                      elements,
                      {
                        autoAlpha: 0,
                        y: 20,
                      },
                      {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.68,
                        ease: 'power3.out',
                        stagger: 0.06,
                        clearProps: 'opacity,transform',
                        overwrite: 'auto',
                        immediateRender: false,
                      },
                    ),
          })
        }

        const panelTargets = getVisibleElements(scope, options.panelSelector)

        if (panelTargets.length) {
          ScrollTrigger.batch(panelTargets, {
            start: options.panelStart ?? 'top 90%',
            once: options.panelOnce ?? true,
            interval: 0.08,
            batchMax: 4,
            onEnter: (elements) =>
              gsap.fromTo(
                elements,
                {
                  autoAlpha: 0,
                  y: 36,
                  scale: 0.985,
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.96,
                  ease: 'power3.out',
                  stagger: options.panelStagger ?? 0.1,
                  clearProps: 'opacity,transform',
                  overwrite: 'auto',
                  immediateRender: false,
                },
              ),
          })
        }

        const overlayTargets = getVisibleElements(scope, options.overlaySelector)
        overlayTargets.forEach((overlay) => {
          gsap.fromTo(
            overlay,
            {
              autoAlpha: 0.22,
              scale: 0.98,
            },
            {
              autoAlpha: 1,
              scale: 1,
              ease: 'power3.out',
              duration: 1.05,
              immediateRender: false,
              scrollTrigger: {
                trigger: overlay.parentElement ?? overlay,
                start: 'top bottom',
                end: 'center center',
                scrub: 0.8,
              },
            },
          )
        })

        if (context.conditions?.desktop) {
          const parallaxTargets = getVisibleElements(scope, options.parallaxSelector)
          parallaxTargets.forEach((target) => {
            const strength = Number(target.dataset.parallaxStrength ?? options.parallaxStrength ?? 6)

            gsap.to(target, {
              yPercent: strength,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: target.parentElement ?? target,
                start: 'top bottom',
                end: 'bottom top',
                scrub: options.parallaxScrub ?? 0.9,
              },
            })
          })
        }

        return undefined
      },
    )

    return () => media.revert()
  }, scope)
}

export type { ScrollMotionOptions }
