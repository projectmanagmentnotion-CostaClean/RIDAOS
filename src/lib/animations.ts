import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenisInstance } from './smoothScroll'

let pluginsRegistered = false
let lenisBound = false

const baseRevealSettings = {
  duration: 0.95,
  ease: 'power3.out',
  clearProps: 'opacity,transform',
  overwrite: 'auto' as const,
}

function ensurePlugins() {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    pluginsRegistered = true
  }
}

function animateHeadingTargets(scope: HTMLElement) {
  const headingTargets = gsap.utils
    .toArray<HTMLElement>('[data-animate-heading]', scope)
    .filter((heading) => heading.offsetParent !== null)

  headingTargets.forEach((heading) => {
    const segments = heading.querySelectorAll<HTMLElement>('.heading-segment')

    if (segments.length === 0) {
      return
    }

    gsap.from(segments, {
      autoAlpha: 0,
      yPercent: 120,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.05,
      clearProps: 'opacity,transform',
      overwrite: 'auto',
      immediateRender: false,
    })
  })
}

function shouldReduceMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function createNoopContext() {
  return {
    revert() {},
  }
}

export function syncScrollTriggerWithLenis() {
  ensurePlugins()

  const lenis = getLenisInstance()

  if (!lenis || lenisBound) {
    return
  }

  lenis.on('scroll', () => {
    ScrollTrigger.update()
  })

  lenisBound = true
}

export function refreshScrollNarrative() {
  ensurePlugins()
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

export function initHeroAnimation(scope: HTMLElement) {
  if (shouldReduceMotion()) {
    return createNoopContext()
  }

  ensurePlugins()

  return gsap.context(() => {
    animateHeadingTargets(scope)

    const heroes = gsap.utils
      .toArray<HTMLElement>('[data-animate="hero"]', scope)
      .filter((hero) => hero.offsetParent !== null)

    heroes.forEach((hero) => {
      const heroChildren = Array.from(hero.children) as HTMLElement[]

      if (heroChildren.length === 0) {
        return
      }

      gsap.from(heroChildren, {
        autoAlpha: 0,
        ...baseRevealSettings,
        duration: 1,
        stagger: 0.12,
        y: 42,
        immediateRender: false,
      })
    })
  }, scope)
}

export function initRevealAnimations(scope: HTMLElement) {
  if (shouldReduceMotion()) {
    return createNoopContext()
  }

  ensurePlugins()

  return gsap.context(() => {
    const revealTargets = gsap.utils
      .toArray<HTMLElement>('[data-animate="reveal"]', scope)
      .filter((element) => element !== scope && element.offsetParent !== null)

    if (revealTargets.length === 0) {
      return
    }

    gsap.from(revealTargets, {
      autoAlpha: 0,
      ...baseRevealSettings,
      immediateRender: false,
      stagger: 0.08,
      y: 40,
    })
  }, scope)
}

export function initPanelAnimations(scope: HTMLElement) {
  if (shouldReduceMotion()) {
    return createNoopContext()
  }

  ensurePlugins()

  return gsap.context(() => {
    const panelTargets = gsap.utils
      .toArray<HTMLElement>('[data-animate="panel"]', scope)
      .filter((panel) => panel.offsetParent !== null)

    if (panelTargets.length === 0) {
      return
    }

    gsap.from(panelTargets, {
      autoAlpha: 0,
      ...baseRevealSettings,
      duration: 0.85,
      immediateRender: false,
      scale: 0.985,
      stagger: 0.06,
      y: 18,
    })
  }, scope)
}

export function initLetterMotion(scope: HTMLElement) {
  if (shouldReduceMotion()) {
    return createNoopContext()
  }

  ensurePlugins()

  return gsap.context(() => {
    const headingTargets = gsap.utils
      .toArray<HTMLElement>('[data-letter-motion] [data-animate-heading], .type-split [data-animate-heading]', scope)
      .filter((heading) => heading.offsetParent !== null)

    headingTargets.forEach((heading) => {
      const segments = heading.querySelectorAll<HTMLElement>('.heading-segment')

      if (segments.length === 0) {
        return
      }

      gsap.from(segments, {
        autoAlpha: 0,
        yPercent: 118,
        rotate: () => gsap.utils.random(-7, 7),
        scale: () => gsap.utils.random(0.94, 1.04),
        stagger: {
          each: 0.045,
          from: 'start',
        },
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        overwrite: 'auto',
        immediateRender: false,
      })
    })
  }, scope)
}

export function initFisheyeTextMotion(scope: HTMLElement) {
  if (shouldReduceMotion()) {
    return createNoopContext()
  }

  ensurePlugins()

  return gsap.context(() => {
    const words = gsap.utils
      .toArray<HTMLElement>('.cinematic-word, .type-negative', scope)
      .filter((word) => word.offsetParent !== null)

    words.forEach((word) => {
      const spans = word.querySelectorAll<HTMLElement>('span')
      if (spans.length === 0) {
        return
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: word,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })

      timeline.fromTo(
        spans,
        {
          yPercent: (index) => 18 + index * 6,
          xPercent: (index) => (index % 2 === 0 ? -4 : 5),
          rotate: (index) => (index % 2 === 0 ? -2 : 2),
          scale: (index) => 0.96 + index * 0.015,
          autoAlpha: 0.82,
        },
        {
          yPercent: (index) => -12 + index * 3,
          xPercent: (index) => (index % 2 === 0 ? 5 : -3),
          rotate: (index) => (index % 2 === 0 ? 1.5 : -1.5),
          scale: 1.02,
          autoAlpha: 1,
          ease: 'none',
          immediateRender: false,
          stagger: 0.03,
        },
        0,
      )
    })
  }, scope)
}

export function initMarqueeTypography(scope: HTMLElement) {
  if (shouldReduceMotion()) {
    return createNoopContext()
  }

  ensurePlugins()

  return gsap.context(() => {
    const marquees = gsap.utils
      .toArray<HTMLElement>('.giant-marquee', scope)
      .filter((marquee) => marquee.offsetParent !== null)

    marquees.forEach((marquee) => {
      gsap.fromTo(
        marquee,
        {
          xPercent: -8,
          autoAlpha: 0.54,
        },
        {
          xPercent: 10,
          autoAlpha: 0.9,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: marquee,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      )
    })
  }, scope)
}

export function initUrbanTextMotion(scope: HTMLElement) {
  if (shouldReduceMotion()) {
    return createNoopContext()
  }

  ensurePlugins()
  syncScrollTriggerWithLenis()

  return gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        desktop: '(min-width: 921px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 920px) and (prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        if (context.conditions?.reduce) {
          return undefined
        }

        const intensity = context.conditions?.desktop ? 1 : 0.68

        const heroStages = gsap.utils
          .toArray<HTMLElement>('[data-motion="hero-stage"]', scope)
          .filter((target) => target.offsetParent !== null)

        heroStages.forEach((stage) => {
          const title = stage.querySelector<HTMLElement>('[data-motion="hero-impact"]')
          const flashBand = stage.querySelector<HTMLElement>('.hero-flash-band')

          const stageTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: 'top 82%',
              end: 'bottom 24%',
              scrub: 0.45,
            },
          })

          if (title) {
            stageTimeline.fromTo(
              title,
              {
                scale: 1,
                xPercent: 0,
                '--hero-blur': '0px',
              } as gsap.TweenVars,
              {
                scale: 0.94 + intensity * 0.015,
                xPercent: 6 * intensity,
                '--hero-blur': `${2.4 * intensity}px`,
                ease: 'none',
                immediateRender: false,
              },
              0,
            )
          }

          if (flashBand) {
            stageTimeline.fromTo(
              flashBand,
              {
                scaleX: 0.08,
                xPercent: -100,
                autoAlpha: 0.18,
              },
              {
                scaleX: 1,
                xPercent: 80,
                autoAlpha: 0.72,
                ease: 'none',
                transformOrigin: 'left center',
                immediateRender: false,
              },
              0.02,
            )
          }
        })

        const heroTitles = gsap.utils
          .toArray<HTMLElement>('[data-motion="hero-impact"]', scope)
          .filter((target) => target.offsetParent !== null)

        heroTitles.forEach((title) => {
          const lines = title.querySelectorAll<HTMLElement>('.text-line')

          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: title,
              start: 'top 88%',
              end: 'bottom 18%',
              scrub: 0.55,
            },
          })

          heroTimeline.fromTo(
            lines,
            {
              yPercent: 130,
              xPercent: (index) => (index % 2 === 0 ? -6 : 7),
              rotate: (index) => (index % 2 === 0 ? -3.5 : 3.5),
              autoAlpha: 0.28,
            },
            {
              yPercent: 0,
              xPercent: 0,
              rotate: 0,
              autoAlpha: 1,
              stagger: 0.08,
              ease: 'none',
              immediateRender: false,
            },
            0,
          )
        })

        const subheads = gsap.utils
          .toArray<HTMLElement>('[data-motion="subheadline"]', scope)
          .filter((target) => target.offsetParent !== null)

        subheads.forEach((subhead) => {
          const words = subhead.querySelectorAll<HTMLElement>('.text-word')

          gsap.fromTo(
            words,
            {
              yPercent: 118,
              clipPath: 'inset(0 0 100% 0)',
              autoAlpha: 0.42,
            },
            {
              yPercent: 0,
              clipPath: 'inset(0 0 0% 0)',
              autoAlpha: 1,
              stagger: 0.035,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: subhead,
                start: 'top 92%',
                end: 'bottom 42%',
                scrub: 0.45,
              },
            },
          )
        })

        const glitchStacks = gsap.utils
          .toArray<HTMLElement>('[data-motion="glitch"]', scope)
          .filter((target) => target.offsetParent !== null)

        glitchStacks.forEach((stack) => {
          const outline = stack.querySelector<HTMLElement>('.misprint-layer-outline')
          const offset = stack.querySelector<HTMLElement>('.misprint-layer-offset')
          const main = stack.querySelector<HTMLElement>('.misprint-layer-main')

          const glitchTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: stack,
              start: 'top 92%',
              end: 'bottom 30%',
              scrub: 0.4,
            },
          })

          if (outline) {
            glitchTimeline.fromTo(
              outline,
              {
                x: -16 * intensity,
                y: 12 * intensity,
                autoAlpha: 0.45,
              },
              {
                x: 0,
                y: 0,
                autoAlpha: 0.72,
                ease: 'none',
                immediateRender: false,
              },
              0,
            )
          }

          if (offset) {
            glitchTimeline.fromTo(
              offset,
              {
                x: 18 * intensity,
                y: -10 * intensity,
                autoAlpha: 0.32,
              },
              {
                x: 0,
                y: 0,
                autoAlpha: 0.52,
                ease: 'none',
                immediateRender: false,
              },
              0,
            )
          }

          if (main) {
            glitchTimeline.fromTo(
              main,
              {
                yPercent: 14,
                autoAlpha: 0.62,
              },
              {
                yPercent: 0,
                autoAlpha: 1,
                ease: 'none',
                immediateRender: false,
              },
              0,
            )
          }
        })

        const rowTextHeadings = gsap.utils
          .toArray<HTMLElement>('.editorial-row-main [data-animate-heading]', scope)
          .filter((target) => target.offsetParent !== null)

        rowTextHeadings.forEach((heading) => {
          const words = heading.querySelectorAll<HTMLElement>('.heading-segment')

          gsap.fromTo(
            words,
            {
              yPercent: 86,
              xPercent: (index) => (index % 2 === 0 ? -4 : 4),
              rotate: (index) => (index % 2 === 0 ? -2 : 2),
            },
            {
              yPercent: 0,
              xPercent: 0,
              rotate: 0,
              stagger: 0.035,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: heading,
                start: 'top 92%',
                end: 'bottom 36%',
                scrub: 0.45,
              },
            },
          )
        })

        const manifestoSections = gsap.utils
          .toArray<HTMLElement>('[data-motion="manifesto"]', scope)
          .filter((target) => target.offsetParent !== null)

        manifestoSections.forEach((section) => {
          const words = section.querySelectorAll<HTMLElement>('.manifesto-word')

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              end: 'bottom 20%',
              scrub: 0.65,
            },
          })

          tl.fromTo(
            words,
            {
              autoAlpha: 0.22,
              yPercent: 20,
              scale: 0.92,
              rotate: (index) => (index % 2 === 0 ? -2 : 2),
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              scale: (index) => (index % 2 === 0 ? 1.05 : 1),
              rotate: (index) => (index === 1 || index === 3 ? -1.5 : 0),
              stagger: 0.08,
              ease: 'none',
              immediateRender: false,
            },
          )
        })

        const marqueeTracks = gsap.utils
          .toArray<HTMLElement>('[data-motion="marquee"] .marquee-track', scope)
          .filter((target) => target.offsetParent !== null)

        marqueeTracks.forEach((track, index) => {
          gsap.fromTo(
            track,
            {
              xPercent: index % 2 === 0 ? -12 : 10,
            },
            {
              xPercent: index % 2 === 0 ? 10 : -8,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: track.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.85,
              },
            },
          )
        })

        const posterSections = gsap.utils
          .toArray<HTMLElement>('[data-motion="poster-stack"]', scope)
          .filter((target) => target.offsetParent !== null)

        posterSections.forEach((section, index) => {
          gsap.fromTo(
            section,
            {
              y: 34 + index * 4,
              scale: 0.985,
              rotate: index % 2 === 0 ? -0.7 : 0.7,
              clipPath: 'inset(4% 4% 4% 4% round 28px)',
              autoAlpha: 0.82,
            },
            {
              y: 0,
              scale: 1,
              rotate: 0,
              clipPath: 'inset(0% 0% 0% 0% round 28px)',
              autoAlpha: 1,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                end: 'bottom 34%',
                scrub: 0.48,
              },
            },
          )
        })

        const shuffleGrids = gsap.utils
          .toArray<HTMLElement>('[data-motion="grid-shuffle"]', scope)
          .filter((target) => target.offsetParent !== null)

        shuffleGrids.forEach((grid) => {
          const cards = Array.from(grid.children) as HTMLElement[]

          gsap.fromTo(
            cards,
            {
              x: (index) => (index % 2 === 0 ? -18 : 20) * intensity,
              y: (index) => (12 + (index % 3) * 8) * intensity,
              rotate: (index) => (index % 2 === 0 ? -2.2 : 2.2),
              scale: 0.96,
              autoAlpha: 0.72,
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              autoAlpha: 1,
              stagger: 0.06,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: grid,
                start: 'top 88%',
                end: 'bottom 38%',
                scrub: 0.55,
              },
            },
          )
        })

        const ctaBlocks = gsap.utils
          .toArray<HTMLElement>('[data-motion="cta-overload"]', scope)
          .filter((target) => target.offsetParent !== null)

        ctaBlocks.forEach((cta) => {
          const title = cta.querySelector<HTMLElement>('.overload-title')
          const titleLayers = cta.querySelectorAll<HTMLElement>('.overload-layer')
          const button = cta.querySelector<HTMLElement>('.overload-button')
          const band = cta.querySelector<HTMLElement>('.overload-band')

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: cta,
              start: 'top 84%',
              end: 'bottom 20%',
              scrub: 0.6,
            },
          })

          if (titleLayers.length > 0) {
            tl.fromTo(
              titleLayers,
              {
                x: (index) => (index % 2 === 0 ? -20 : 18),
                y: (index) => (index === 0 ? 14 : -10),
                autoAlpha: 0.42,
              },
              {
                x: 0,
                y: 0,
                autoAlpha: 1,
                stagger: 0.04,
                ease: 'none',
                immediateRender: false,
              },
              0,
            )
          }

          if (title) {
            tl.fromTo(
              title,
              {
                yPercent: 18,
                scale: 0.96,
              },
              {
                yPercent: 0,
                scale: 1,
                ease: 'none',
                immediateRender: false,
              },
              0,
            )
          }

          if (button) {
            tl.fromTo(
              button,
              {
                y: 22,
                scale: 0.88,
                autoAlpha: 0.36,
              },
              {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                ease: 'none',
                immediateRender: false,
              },
              0.08,
            )
          }

          if (band) {
            tl.fromTo(
              band,
              {
                scaleX: 0.06,
                xPercent: -100,
              },
              {
                scaleX: 1,
                xPercent: 100,
                ease: 'none',
                transformOrigin: 'left center',
                immediateRender: false,
              },
              0.02,
            )
          }
        })

        return undefined
      },
    )

    return () => {
      mm.revert()
    }
  }, scope)
}

export function initEditorialRows(scope: HTMLElement) {
  if (shouldReduceMotion()) {
    return createNoopContext()
  }

  ensurePlugins()

  return gsap.context(() => {
    const rows = gsap.utils
      .toArray<HTMLElement>('[data-animate="row"]', scope)
      .filter((row) => row.offsetParent !== null)

    rows.forEach((row, index) => {
      const targets = row.querySelectorAll<HTMLElement>(
        '.editorial-row-index, .editorial-row-main, .editorial-row-preview',
      )

      gsap.from(targets, {
        autoAlpha: 0,
        y: 34,
        duration: 0.88,
        delay: index * 0.05,
        ease: 'power3.out',
        stagger: 0.06,
        clearProps: 'opacity,transform',
        overwrite: 'auto',
        immediateRender: false,
      })
    })
  }, scope)
}

export function initCursorAwareReveals(scope: HTMLElement) {
  if (shouldReduceMotion()) {
    return createNoopContext()
  }

  ensurePlugins()

  return gsap.context(() => {
    const targets = gsap.utils
      .toArray<HTMLElement>('[data-cursor="invert"]', scope)
      .filter((target) => target.offsetParent !== null)

    gsap.set(targets, {
      transformPerspective: 1000,
    })
  }, scope)
}

export function initScrollNarrative(scope: HTMLElement) {
  ensurePlugins()
  syncScrollTriggerWithLenis()

  return gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: reduce)', () => {
      return undefined
    })

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const progressRail = document.querySelector<HTMLElement>('[data-scroll-progress]')

      if (progressRail) {
        gsap.to(progressRail, {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: scope,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
          },
        })
      }

      const cinematicScenes = gsap.utils.toArray<HTMLElement>('.cinematic-scene', scope)
      cinematicScenes.forEach((scene, index) => {
        const word = scene.querySelector<HTMLElement>('.cinematic-word')
        const mask = scene.querySelector<HTMLElement>('.cinematic-mask')
        const image = scene.querySelector<HTMLElement>('.cinematic-image')
        const bridge = scene.querySelector<HTMLElement>('.scroll-bridge')
        const marquee = scene.querySelector<HTMLElement>('.giant-marquee')
        const sceneTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: 'top 90%',
            end: 'bottom 18%',
            scrub: 0.55,
          },
        })

        gsap.to(scene, {
          '--scene-shift': `${0.12 + index * 0.05}`,
          ease: 'none',
          scrollTrigger: {
            trigger: scene,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        })

        if (word) {
          sceneTimeline.fromTo(
            word,
            {
              xPercent: -5,
              yPercent: 6,
              rotate: -1.5,
            },
            {
              xPercent: 5,
              yPercent: -4,
              rotate: 1,
              ease: 'none',
              immediateRender: false,
            },
            0,
          )
        }

        if (mask) {
          sceneTimeline.fromTo(
            mask,
            {
              clipPath: 'inset(10% 10% 10% 10% round 28px)',
              scale: 0.94,
            },
            {
              clipPath: 'inset(0% 0% 0% 0% round 28px)',
              scale: 1,
              ease: 'none',
              immediateRender: false,
            },
            0.02,
          )
        }

        if (image) {
          sceneTimeline.fromTo(
            image,
            {
              scale: 1.08,
              yPercent: 6,
            },
            {
              scale: 1,
              yPercent: -3,
              ease: 'none',
              immediateRender: false,
            },
            0,
          )
        }

        if (bridge) {
          sceneTimeline.fromTo(
            bridge,
            {
              xPercent: -8,
            },
            {
              xPercent: 8,
              ease: 'none',
              immediateRender: false,
            },
            0.08,
          )
        }

        if (marquee) {
          sceneTimeline.fromTo(
            marquee,
            {
              xPercent: -6,
            },
            {
              xPercent: 6,
              ease: 'none',
              immediateRender: false,
            },
            0.12,
          )
        }
      })

      const depthTargets = gsap.utils.toArray<HTMLElement>('[data-depth]', scope)
      depthTargets.forEach((target) => {
        const depth = Number(target.dataset.depth || '0.08')

        gsap.to(target, {
          yPercent: depth * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: target,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9,
          },
        })
      })

      const rows = gsap.utils.toArray<HTMLElement>('[data-scroll-row]', scope)
      rows.forEach((row) => {
        const preview = row.querySelector<HTMLElement>('.editorial-ghost-panel')
        const content = row.querySelector<HTMLElement>('.editorial-row-main')
        const arrow = row.querySelector<HTMLElement>('.editorial-row-arrow')
        const number = row.querySelector<HTMLElement>('.editorial-row-index')
        const slash = row.querySelector<HTMLElement>('.editorial-row-slash')
        const rowTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 92%',
            end: 'bottom 34%',
            scrub: 0.5,
          },
        })

        rowTimeline
          .fromTo(
            row,
            {
              y: 18,
            },
            {
              y: 0,
              ease: 'none',
              immediateRender: false,
            },
            0,
          )
          .fromTo(
            number,
            {
              x: -14,
            },
            {
              x: 0,
              ease: 'none',
              immediateRender: false,
            },
            0,
          )
          .fromTo(
            content,
            {
              x: -10,
            },
            {
              x: 0,
              ease: 'none',
              immediateRender: false,
            },
            0,
          )

        if (preview) {
          rowTimeline.fromTo(
            preview,
            {
              xPercent: 8,
              yPercent: 5,
              scale: 0.94,
            },
            {
              xPercent: -2,
              yPercent: -3,
              scale: 1.01,
              ease: 'none',
              immediateRender: false,
            },
            0,
          )
        }

        if (content) {
          gsap.to(content, {
            xPercent: 1.8,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.65,
            },
          })
        }

        if (arrow) {
          rowTimeline.fromTo(
            arrow,
            {
              x: -8,
            },
            {
              x: 12,
              ease: 'none',
              immediateRender: false,
            },
            0,
          )
        }

        if (slash) {
          rowTimeline.fromTo(
            slash,
            {
              rotate: -5,
              x: -4,
            },
            {
              rotate: 3,
              x: 4,
              ease: 'none',
              immediateRender: false,
            },
            0,
          )
        }
      })

      const pinnedBlock = scope.querySelector<HTMLElement>('[data-scroll-pin="dtf-narrative"]')
      if (pinnedBlock) {
        const steps = gsap.utils.toArray<HTMLElement>('[data-step-index]', pinnedBlock)
        const progressLine = pinnedBlock.querySelector<HTMLElement>('[data-step-progress]')
        const narrativeTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedBlock,
            start: 'top 72%',
            end: 'bottom 28%',
            scrub: 0.55,
            onUpdate: (self) => {
              const segment = self.progress * steps.length

              steps.forEach((step, index) => {
                const isActive = segment >= index && segment < index + 1
                step.classList.toggle('is-active', isActive)
              })
            },
          },
        })

        narrativeTimeline.fromTo(
          pinnedBlock.querySelector('.narrative-copy-panel'),
          {
            y: 20,
            autoAlpha: 0.76,
          },
          {
            y: -8,
            autoAlpha: 1,
            ease: 'none',
            immediateRender: false,
          },
          0,
        )

        steps.forEach((step, index) => {
          const stepNumber = step.querySelector<HTMLElement>('.narrative-step-number')
          const stepBody = step.querySelector<HTMLElement>('.narrative-step-body')
          const offset = index * 0.11

          if (stepNumber) {
            narrativeTimeline.fromTo(
              stepNumber,
              {
                x: -14,
                autoAlpha: 0.52,
              },
              {
                x: 0,
                autoAlpha: 1,
                ease: 'none',
                immediateRender: false,
              },
              offset,
            )
          }

          if (stepBody) {
            narrativeTimeline.fromTo(
              stepBody,
              {
                x: 20,
                autoAlpha: 0.64,
              },
              {
                x: 0,
                autoAlpha: 1,
                ease: 'none',
                immediateRender: false,
              },
              offset,
            )
          }
        })

        if (progressLine) {
          narrativeTimeline.fromTo(
            progressLine,
            {
              scaleY: 0,
            },
            {
              scaleY: 1,
              ease: 'none',
              transformOrigin: 'top center',
              immediateRender: false,
            },
            0,
          )
        }
      }

      const previewPanel = scope.querySelector<HTMLElement>('[data-scroll-scene="dtf-preview"]')
      if (previewPanel) {
        gsap.fromTo(
          previewPanel,
          {
            yPercent: 3,
          },
          {
            yPercent: -2,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: previewPanel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        )
      }

      const pricingPanel = scope.querySelector<HTMLElement>('[data-scroll-scene="dtf-pricing"]')
      if (pricingPanel) {
        gsap.fromTo(
          pricingPanel,
          {
            y: 10,
          },
          {
            y: -10,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: pricingPanel,
              start: 'top 88%',
              end: 'bottom 36%',
              scrub: 0.55,
            },
          },
        )
      }

      const preflightItems = gsap.utils.toArray<HTMLElement>('[data-scroll-scene="dtf-preflight"] .preflight-item', scope)
      preflightItems.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            y: 12 + index * 4,
          },
          {
            y: 0,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: item,
              start: 'top 92%',
              end: 'top 44%',
              scrub: 0.45,
            },
          },
        )
      })
    })

    return () => {
      mm.revert()
    }
  }, scope)
}

export function initCinematicScroll(scope: HTMLElement) {
  return initScrollNarrative(scope)
}
